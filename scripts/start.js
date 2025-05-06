const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Función para esperar un tiempo determinado
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para verificar la base de datos con reintentos
async function checkDatabaseWithRetry(maxRetries = 5, delay = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Conexión a la base de datos verificada");
      return true;
    } catch (error) {
      console.log(
        `⚠️ Intento ${
          i + 1
        }/${maxRetries}: Error al conectar con la base de datos`
      );
      if (i < maxRetries - 1) {
        console.log(
          `⏳ Esperando ${delay / 1000} segundos antes de reintentar...`
        );
        await wait(delay);
      }
    }
  }
  return false;
}

// Función principal para iniciar el servidor
async function startServer() {
  try {
    console.log("=== Iniciando servidor ===");

    // Verificar variables de entorno críticas
    const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET"];
    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Variables de entorno faltantes: ${missingEnvVars.join(", ")}`
      );
    }

    // Verificar conexión a la base de datos con reintentos
    const dbReady = await checkDatabaseWithRetry();
    if (!dbReady) {
      throw new Error(
        "No se pudo conectar a la base de datos después de varios intentos"
      );
    }

    // Configurar el proceso del servidor
    const server = spawn("node", [".next/standalone/server.js"], {
      env: {
        ...process.env,
        PORT: process.env.PORT || "8080",
        NODE_ENV: "production",
      },
      stdio: "inherit",
    });

    // Configurar manejadores de eventos
    server.on("error", (error) => {
      console.error("❌ Error en el servidor:", error);
      process.exit(1);
    });

    server.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ El servidor se cerró con código ${code}`);
        process.exit(code);
      }
    });

    // Manejar señales de terminación
    const handleShutdown = async (signal) => {
      console.log(`\n⚠️ Recibida señal ${signal}, cerrando servidor...`);
      server.kill(signal);
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));

    // Mantener el proceso activo
    process.stdin.resume();

    // Verificación periódica de la base de datos
    setInterval(async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (error) {
        console.error(
          "❌ Error en la verificación periódica de la base de datos:",
          error
        );
        process.exit(1);
      }
    }, 30000); // Verificar cada 30 segundos
  } catch (error) {
    console.error("❌ Error al iniciar la aplicación:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on("uncaughtException", async (error) => {
  console.error("❌ Error no capturado:", error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  console.error("❌ Promesa rechazada no manejada:", reason);
  await prisma.$disconnect();
  process.exit(1);
});

// Iniciar el servidor
startServer();
