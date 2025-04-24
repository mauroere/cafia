import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Order {
  createdAt: Date
  totalAmount: number
}

interface SalesChartProps {
  orders: Order[]
}

export function SalesChart({ orders }: SalesChartProps) {
  // Agrupar ventas por día
  const dailySales = orders.reduce((acc, order) => {
    const date = format(new Date(order.createdAt), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += order.totalAmount
    return acc
  }, {} as Record<string, number>)

  // Convertir a formato para el gráfico
  const data = Object.entries(dailySales).map(([date, amount]) => ({
    date: format(new Date(date), 'dd MMM', { locale: es }),
    amount
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
            labelFormatter={(label) => `Día: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 