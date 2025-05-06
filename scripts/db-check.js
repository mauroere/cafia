const { PrismaClient } = require("@prisma/client");

async function checkDatabaseConnection() {
  console.log("=== Iniciando diagnóstico de base de datos ===");
  console.log(
    "URL de la base de datos:",
    process.env.DATABASE_URL ? "Configurada" : "No configurada"
  );

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    console.log("\n1. Intentando conectar a la base de datos...");

    // Intenta una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Conexión exitosa a la base de datos");
    console.log("Resultado de la consulta:", result);

    // Verifica las tablas existentes
    console.log("\n2. Verificando tablas existentes...");
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tablas encontradas:", tables.length);
    console.log("Lista de tablas:", tables);

    // Verifica la versión de PostgreSQL
    console.log("\n3. Verificando versión de PostgreSQL...");
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log("Versión de PostgreSQL:", version[0].version);

    // Verifica los permisos
    console.log("\n4. Verificando permisos de usuario...");
    const permissions = await prisma.$queryRaw`
      SELECT current_user, current_database()
    `;
    console.log("Usuario actual:", permissions[0].current_user);
    console.log("Base de datos actual:", permissions[0].current_database);

    console.log("\n=== Diagnóstico completado exitosamente ===");
  } catch (error) {
    console.error("\n❌ Error durante el diagnóstico:");
    console.error("Mensaje de error:", error.message);
    console.error("Stack trace:", error.stack);

    if (error.code) {
      console.error("Código de error:", error.code);
    }

    if (error.meta) {
      console.error("Metadatos del error:", error.meta);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();
