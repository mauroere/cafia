-- Verificar que podemos conectarnos y ejecutar una consulta simple
SELECT 1;

-- Verificar que las tablas principales existen
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'business'
) AS business_table_exists;

SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user'
) AS user_table_exists; 