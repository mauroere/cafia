'use client'

import { Order } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

interface SalesTrendsProps {
  orders: Order[]
}

const dayLabels: Record<string, string> = {
  'lunes': 'Lun',
  'martes': 'Mar',
  'miércoles': 'Mié',
  'jueves': 'Jue',
  'viernes': 'Vie',
  'sábado': 'Sáb',
  'domingo': 'Dom'
}

export function SalesTrends({ orders }: SalesTrendsProps) {
  // Obtener las fechas de la semana actual
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Preparar datos para el gráfico
  const data = weekDays.map(day => {
    const dayOrders = orders.filter(order => {
      const orderDate = parseISO(order.createdAt.toString())
      return format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    })

    const total = dayOrders.reduce((acc, order) => acc + order.totalAmount, 0)
    const count = dayOrders.length

    return {
      name: dayLabels[format(day, 'EEEE', { locale: es }).toLowerCase()],
      total,
      count
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'total' ? `$${value.toFixed(2)}` : value,
                  name === 'total' ? 'Total' : 'Pedidos'
                ]}
              />
              <Bar
                yAxisId="left"
                dataKey="total"
                fill="#8884d8"
                name="total"
              />
              <Bar
                yAxisId="right"
                dataKey="count"
                fill="#82ca9d"
                name="count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">Total Ventas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#82ca9d] rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">Número de Pedidos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 