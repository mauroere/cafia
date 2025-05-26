const { spawn } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

// Función para esperar
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para verificar variables de entorno requeridas
function checkEnvironmentVariables() {
  console.log("=== Environment Variables Check ===");
  const requiredVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_APP_URL",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingVars.join(", ")
    );
    return false;
  }

  console.log("✅ All required environment variables are configured");
  return true;
}

// Función para verificar la base de datos
async function checkDatabase() {
  try {
    console.log("=== Database Connection Check ===");
    console.log(
      "DATABASE_URL:",
      process.env.DATABASE_URL ? "Configured" : "Not configured"
    );
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para verificar la base de datos con reintentos
async function checkDatabaseWithRetries(maxRetries = 5, retryDelay = 5000) {
  console.log(
    `Intentando conectar a la base de datos con ${maxRetries} reintentos...`
  );

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Intento ${attempt} de ${maxRetries}`);

    const connected = await checkDatabase();
    if (connected) {
      return true;
    }

    if (attempt < maxRetries) {
      console.log(`Reintentando en ${retryDelay / 1000} segundos...`);
      await sleep(retryDelay);
    }
  }

  console.error(
    `Fallaron todos los ${maxRetries} intentos de conexión a la base de datos.`
  );
  return false;
}

// Función para verificar el archivo del servidor
function checkServerFile() {
  const serverPath = path.join(process.cwd(), ".next/standalone/server.js");
  console.log("=== Server File Check ===");
  console.log("Checking server file at:", serverPath);

  if (!fs.existsSync(serverPath)) {
    console.error("❌ Server file not found at:", serverPath);
    return false;
  }

  console.log("✅ Server file found");
  return true;
}

// Función para iniciar el servidor
async function startServer() {
  try {
    console.log("=== Starting Application ===");
    console.log("Current directory:", process.cwd());
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", process.env.PORT || "8080");

    // Verificar variables de entorno
    if (!checkEnvironmentVariables()) {
      console.error("Environment variables check failed. Exiting...");
      process.exit(1);
    }

    // Verificar el archivo del servidor
    if (!checkServerFile()) {
      console.error("Server file check failed. Exiting...");
      process.exit(1);
    }

    // Verificar la conexión a la base de datos con reintentos
    const dbConnected = await checkDatabaseWithRetries(5, 5000);
    if (!dbConnected) {
      console.error(
        "Database connection check failed after retries. Exiting..."
      );
      process.exit(1);
    }

    // Iniciar el servidor Next.js
    console.log("=== Starting Next.js Server ===");
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
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    });

    server.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`);
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
    console.error("❌ Error during startup:", error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Iniciar la aplicación
startServer();
