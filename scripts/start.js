const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const { validateConfig } = require("../src/lib/config");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Conexión a la base de datos verificada");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function startServer() {
  console.log("=== Iniciando servidor ===");

  // Verificar configuración
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL no está configurada");
    process.exit(1);
  }

  // Verificar base de datos
  const dbReady = await checkDatabase();
  if (!dbReady) {
    console.error("❌ No se pudo conectar a la base de datos");
    process.exit(1);
  }

  // Iniciar servidor Next.js
  const server = spawn("node", [".next/standalone/server.js"], {
    env: {
      ...process.env,
      PORT: process.env.PORT || "8080",
      NODE_ENV: "production",
    },
    stdio: "inherit",
  });

  // Manejar señales de terminación
  const signals = ["SIGTERM", "SIGINT", "SIGQUIT"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\n⚠️ Recibida señal ${signal}, cerrando servidor...`);
      server.kill(signal);
      await prisma.$disconnect();
      process.exit(0);
    });
  });

  // Manejar errores del servidor
  server.on("error", (error) => {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  });

  // Manejar cierre del servidor
  server.on("close", (code) => {
    if (code !== 0) {
      console.error(`❌ El servidor se cerró con código ${code}`);
      process.exit(code);
    }
  });

  // Mantener el proceso principal activo
  process.stdin.resume();
}

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error("❌ Error no capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promesa rechazada no manejada:", reason);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("❌ Error al iniciar la aplicación:", error);
  process.exit(1);
});
