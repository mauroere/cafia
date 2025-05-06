const { PrismaClient } = require('@prisma/client');

async function checkRailwayDatabase() {
  console.log('=== Railway Database Diagnostic ===');
  
  // Verificar variables de entorno
  const dbUrl = process.env.DATABASE_URL;
  console.log('\n1. Environment Variables:');
  console.log('DATABASE_URL:', dbUrl ? '✅ Configured' : '❌ Not configured');
  
  if (!dbUrl) {
    console.error('Error: DATABASE_URL is not configured');
    process.exit(1);
  }

  // Extraer información de la URL de la base de datos
  try {
    const url = new URL(dbUrl);
    console.log('\n2. Database Connection Details:');
    console.log('Host:', url.hostname);
    console.log('Port:', url.port);
    console.log('Database:', url.pathname.substring(1));
    console.log('User:', url.username);
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error.message);
  }

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('\n3. Testing Database Connection...');
    
    // Test básico de conexión
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test successful');
    
    // Verificar versión de PostgreSQL
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log('\n4. PostgreSQL Version:', version[0].version);
    
    // Verificar permisos
    const permissions = await prisma.$queryRaw`
      SELECT current_user, current_database(), 
             (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count
    `;
    console.log('\n5. Database Permissions:');
    console.log('Current User:', permissions[0].current_user);
    console.log('Current Database:', permissions[0].current_database);
    console.log('Number of Tables:', permissions[0].table_count);
    
    // Listar tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('\n6. Existing Tables:');
    if (tables.length === 0) {
      console.log('No tables found in the database');
    } else {
      tables.forEach(table => console.log(`- ${table.table_name}`));
    }

    console.log('\n=== Database Diagnostic Completed Successfully ===');
  } catch (error) {
    console.error('\n❌ Database Diagnostic Failed:');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code || 'N/A');
    console.error('Stack Trace:', error.stack);
    
    if (error.meta) {
      console.error('Error Metadata:', error.meta);
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkRailwayDatabase(); 