export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Acerca de Cafia</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-600">
              En Cafia, nuestra misión es empoderar a los negocios locales con herramientas digitales 
              accesibles y efectivas. Creemos que cada negocio merece tener presencia digital sin 
              comisiones excesivas o complejidades técnicas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sin Comisiones</h2>
            <p className="text-gray-600">
              A diferencia de otras plataformas, no cobramos comisiones por ventas. Los negocios 
              mantienen el 100% de sus ingresos. Solo pagas las tarifas estándar de Mercado Pago 
              por el procesamiento de pagos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Características</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Menú digital personalizable</li>
              <li>Sistema de pedidos en línea</li>
              <li>Integración con Mercado Pago</li>
              <li>Panel de administración intuitivo</li>
              <li>Notificaciones por WhatsApp</li>
              <li>Soporte técnico incluido</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comienza Hoy</h2>
            <p className="text-gray-600 mb-6">
              Únete a la revolución digital de la industria gastronómica. Comienza a recibir 
              pedidos en línea hoy mismo sin complicaciones.
            </p>
            <a
              href="/auth/register?role=VENDOR"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-500"
            >
              Registrar mi Negocio
            </a>
          </section>
        </div>
      </div>
    </main>
  )
} 