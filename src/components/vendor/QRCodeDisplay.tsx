'use client'

import { useState } from 'react'
import QRCode from 'qrcode.react'
import { ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface QRCodeDisplayProps {
  businessId: string
}

export default function QRCodeDisplay({ businessId }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  
  // Usar la URL de la aplicación o construirla desde window.location
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const menuUrl = `${baseUrl}/menu/${businessId}`

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Menú Digital',
          text: '¡Mira nuestro menú digital!',
          url: menuUrl,
        })
      } else {
        await navigator.clipboard.writeText(menuUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error al compartir:', error)
    }
  }

  const handleDownload = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'menu-qr.png'
      link.href = url
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCode 
          value={menuUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ShareIcon className="h-5 w-5 mr-2 text-gray-500" />
          {copied ? 'Copiado!' : 'Compartir'}
        </button>

        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2 text-gray-500" />
          Descargar
        </button>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Comparte este código QR con tus clientes para que accedan a tu menú digital
        </p>
        <p className="text-xs text-gray-400">
          URL del menú: {menuUrl}
        </p>
      </div>
    </div>
  )
} 