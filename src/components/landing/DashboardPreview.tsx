'use client'

import Image from 'next/image'
import { useState } from 'react'

export function DashboardPreview() {
  const [imgSrc, setImgSrc] = useState('/dashboard-preview.jpg')

  return (
    <div className="relative">
      <div className="relative rounded-2xl bg-gray-900/5 p-2">
        <div className="ring-1 ring-inset ring-gray-900/10 rounded-xl">
          <Image
            src={imgSrc}
            alt="Vista previa del dashboard"
            width={2432}
            height={1442}
            className="w-full rounded-xl shadow-2xl"
            priority
            onError={() => {
              setImgSrc('https://placehold.co/2432x1442/e2e8f0/64748b?text=Dashboard+Preview')
            }}
          />
        </div>
      </div>
    </div>
  )
} 