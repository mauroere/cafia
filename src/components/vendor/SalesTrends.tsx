'use client'

import { Order } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SalesTrendsProps {
  orders: Order[]
}

export function SalesTrends({ orders }: SalesTrendsProps) {
  // Agrupar ventas por día
  const dailySales = orders.reduce((acc, order) => {
    const date = format(new Date(order.createdAt), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += order.total
    return acc
  }, {} as Record<string, number>)

  // Convertir a formato para el gráfico
  const chartData = Object.entries(dailySales).map(([date, total]) => ({
    date: format(new Date(date), 'd MMM', { locale: es }),
    total
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 