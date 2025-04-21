# Cafia - Plataforma de Menú Digital y Pedidos Online

Cafia es una plataforma web multi-tenant donde negocios pueden configurar su tienda online con menú digital, gestionar pedidos y procesar pagos mediante Mercado Pago QR.

## Características Principales

- Menú digital personalizable para negocios
- Sistema de pedidos online (Delivery/Take Away)
- Integración con Mercado Pago QR
- Comunicación vía WhatsApp
- Sin comisiones por transacción
- Panel de administración para cada rol (Admin, Vendedor, Cliente)

## Requisitos Técnicos

- Node.js 18+
- PostgreSQL 14+
- Railway CLI (para despliegue)

## Configuración del Proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/your-username/cafia.git
cd cafia
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cafia"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Mercado Pago (Platform)
MERCADO_PAGO_PUBLIC_KEY="your-public-key-here"
MERCADO_PAGO_ACCESS_TOKEN="your-access-token-here"
```

4. Inicializar la base de datos:

```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── app/              # Next.js 13+ App Router
├── components/       # Componentes React reutilizables
├── lib/             # Utilidades y configuraciones
├── types/           # Definiciones de tipos TypeScript
├── utils/           # Funciones utilitarias
├── hooks/           # Custom React hooks
└── styles/          # Estilos globales y configuración de Tailwind
```

## Despliegue en Railway

1. Instalar Railway CLI:

```bash
npm i -g @railway/cli
```

2. Iniciar sesión en Railway:

```bash
railway login
```

3. Vincular el proyecto:

```bash
railway link
```

4. Desplegar:

```bash
railway up
```

## Roles y Funcionalidades

### Administrador

- Dashboard general
- Gestión de vendedores y usuarios
- Configuración de la plataforma

### Vendedor

- Dashboard de negocio
- Gestión de menú y productos
- Gestión de pedidos
- Configuración de pagos y WhatsApp

### Cliente

- Exploración de negocios
- Visualización de menús
- Realización de pedidos
- Pago con Mercado Pago QR

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
