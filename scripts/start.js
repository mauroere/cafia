const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let server = null;

// Función para esperar
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para verificar la base de datos
async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    return false;
  }
}

// Función para iniciar el servidor
function startNextServer() {
  console.log("=== Iniciando servidor Next.js ===");

  server = spawn("node", [".next/standalone/server.js"], {
    env: {
      ...process.env,
      PORT: process.env.PORT || "8080",
      NODE_ENV: "production",
    },
    stdio: "inherit",
  });

  server.on("error", (error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });

  server.on("exit", (code) => {
    if (code !== 0) {
      console.error(`El servidor se cerró con código ${code}`);
      process.exit(code);
    }
  });

  return server;
}

// Función principal
async function main() {
  console.log("=== Iniciando aplicación ===");

  // Verificar variables de entorno
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL no está configurada");
    process.exit(1);
  }

  // Esperar a que la base de datos esté lista
  let dbReady = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!dbReady && attempts < maxAttempts) {
    console.log(
      `Intento ${attempts + 1}/${maxAttempts} de conectar a la base de datos...`
    );
    dbReady = await checkDatabase();

    if (!dbReady) {
      attempts++;
      if (attempts < maxAttempts) {
        console.log("Esperando 5 segundos antes de reintentar...");
        await sleep(5000);
      }
    }
  }

  if (!dbReady) {
    console.error(
      "No se pudo conectar a la base de datos después de varios intentos"
    );
    process.exit(1);
  }

  console.log("✅ Base de datos conectada");

  // Iniciar el servidor
  startNextServer();

  // Manejar señales de terminación
  const handleShutdown = async (signal) => {
    console.log(`\nRecibida señal ${signal}, cerrando...`);
    if (server) {
      server.kill(signal);
    }
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));

  // Mantener el proceso activo
  process.stdin.resume();
}

// Manejar errores no capturados
process.on("uncaughtException", async (error) => {
  console.error("Error no capturado:", error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  console.error("Promesa rechazada no manejada:", reason);
  await prisma.$disconnect();
  process.exit(1);
});

// Iniciar la aplicación
main().catch(async (error) => {
  console.error("Error al iniciar la aplicación:", error);
  await prisma.$disconnect();
  process.exit(1);
});
