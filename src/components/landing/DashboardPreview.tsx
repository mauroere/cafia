import Image from 'next/image'

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="relative rounded-2xl bg-gray-900/5 p-2">
        <div className="ring-1 ring-inset ring-gray-900/10 rounded-xl">
          <Image
            src="/dashboard-preview.jpg"
            alt="Dashboard preview"
            width={2432}
            height={1442}
            className="w-full rounded-xl shadow-2xl"
            priority
            onError={(e) => {
              // Fallback a una imagen de placeholder si la imagen principal falla
              const img = e.target as HTMLImageElement
              img.src = 'https://via.placeholder.com/2432x1442?text=Dashboard+Preview'
            }}
          />
        </div>
      </div>
    </div>
  )
} 