import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Product {
  id: string
  name: string
  _count: {
    orderItems: number
  }
}

interface ProductStatsProps {
  products: Product[]
}

export function ProductStats({ products }: ProductStatsProps) {
  // Ordenar productos por cantidad de ventas y tomar los top 5
  const topProducts = [...products]
    .sort((a, b) => b._count.orderItems - a._count.orderItems)
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      sales: product._count.orderItems
    }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value, 'Ventas']}
            labelFormatter={(label) => `Producto: ${label}`}
          />
          <Bar dataKey="sales" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 