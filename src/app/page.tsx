export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Bienvenido a Cafia
      </h1>
      <p className="text-xl text-center text-gray-600 mb-8">
        Tu plataforma de menú digital y pedidos online
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Para Negocios</h2>
          <p className="text-gray-600 mb-4">
            Crea tu menú digital, gestiona pedidos y acepta pagos con Mercado Pago.
          </p>
          <button className="btn btn-primary">
            Registrar Negocio
          </button>
        </div>
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Para Clientes</h2>
          <p className="text-gray-600 mb-4">
            Explora menús, realiza pedidos y paga fácilmente con Mercado Pago.
          </p>
          <button className="btn btn-primary">
            Explorar Negocios
          </button>
        </div>
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Sin Comisiones</h2>
          <p className="text-gray-600 mb-4">
            No cobramos comisiones por tus ventas. Mantén el 100% de tus ingresos.
          </p>
          <button className="btn btn-secondary">
            Saber Más
          </button>
        </div>
      </div>
    </div>
  )
} 