const { PrismaClient } = require("@prisma/client");

async function checkDatabaseConnection() {
  const prisma = new PrismaClient();

  try {
    console.log("Intentando conectar a la base de datos...");

    // Intenta una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Conexión exitosa a la base de datos");
    console.log("Resultado de la consulta:", result);

    // Verifica las tablas existentes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("\nTablas existentes en la base de datos:");
    console.log(tables);
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:");
    console.error("Mensaje de error:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();
