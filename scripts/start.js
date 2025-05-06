const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const { validateConfig } = require("../src/lib/config");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection verified");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function startServer() {
  try {
    // Validar configuración
    console.log("Validating configuration...");
    validateConfig();
    console.log("✅ Configuration validated");

    // Verificar la base de datos antes de iniciar
    console.log("Checking database connection...");
    const dbReady = await checkDatabase();
    if (!dbReady) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // Iniciar el servidor Next.js
    console.log("Starting Next.js server...");
    const server = spawn("node", [".next/standalone/server.js"], {
      env: {
        ...process.env,
        PORT: process.env.PORT || "8080",
        NODE_ENV: "production",
      },
      stdio: "inherit",
    });

    server.on("error", (error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });

    server.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Server exited with code ${code}`);
        process.exit(code);
      }
    });

    // Manejar señales de terminación
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM. Gracefully shutting down...");
      server.kill("SIGTERM");
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Gracefully shutting down...");
      server.kill("SIGINT");
    });

    // Manejar errores no capturados
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      server.kill("SIGTERM");
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      server.kill("SIGTERM");
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startServer();
