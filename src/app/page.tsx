import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Bienvenido a Cafia
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Tu plataforma de menú digital y pedidos online
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Para Negocios */}
          <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">Para Negocios</h3>
            <p className="mt-4 text-gray-500">
              Crea tu menú digital, gestiona pedidos y acepta pagos con Mercado Pago.
            </p>
            <Link
              href="/auth/register?role=VENDOR"
              className="mt-6 block w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              Registrar Negocio
            </Link>
          </div>

          {/* Para Clientes */}
          <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">Para Clientes</h3>
            <p className="mt-4 text-gray-500">
              Explora menús, realiza pedidos y paga fácilmente con Mercado Pago.
            </p>
            <Link
              href="/businesses"
              className="mt-6 block w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              Explorar Negocios
            </Link>
          </div>

          {/* Sin Comisiones */}
          <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">Sin Comisiones</h3>
            <p className="mt-4 text-gray-500">
              No cobramos comisiones por tus ventas. Mantén el 100% de tus ingresos.
            </p>
            <Link
              href="/about"
              className="mt-6 block w-full rounded-md bg-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300"
            >
              Saber Más
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 