const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

// Función para esperar
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para verificar la base de datos
async function checkDatabase() {
  try {
    console.log("Checking database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar la conexión a la base de datos
    const dbConnected = await checkDatabase();
    if (!dbConnected) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // Iniciar el servidor Next.js
    console.log("Starting Next.js server...");
    const serverPath = path.join(process.cwd(), ".next/standalone/server.js");

    const server = spawn("node", [serverPath], {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: process.env.PORT || "8080",
      },
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
      console.log("Received SIGTERM. Shutting down gracefully...");
      server.kill("SIGTERM");
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Shutting down gracefully...");
      server.kill("SIGINT");
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Iniciar la aplicación
startServer();
