'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import OrderDetails from '@/components/vendor/OrderDetails'
import { OrderStatus } from '@prisma/client'
import { toast } from 'react-hot-toast'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    imageUrl: string | null
  }
}

type Order = {
  id: string
  shortId: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  customer: {
    name: string | null
    email: string
    phone: string | null
  }
  items: OrderItem[]
  deliveryAddress: string | null
  deliveryInstructions: string | null
  paymentMethod: string
  paymentStatus: string
}

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/vendor/orders/${params.id}`)
        setOrder(response.data)
        setError(null)
      } catch (err) {
        console.error('Error al obtener el pedido:', err)
        setError('No se pudo cargar el pedido')
        toast.error('Error al cargar el pedido')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (order) {
      setOrder({ ...order, status: newStatus })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Pedido no encontrado'}</p>
          <button
            onClick={() => router.push('/vendor/orders')}
            className="mt-2 text-sm underline"
          >
            Volver a la lista de pedidos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles del Pedido</h1>
        <button
          onClick={() => router.push('/vendor/orders')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          Volver a la lista
        </button>
      </div>

      <OrderDetails order={order} onStatusChange={handleStatusChange} />
    </div>
  )
} 