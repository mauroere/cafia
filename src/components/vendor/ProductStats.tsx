'use client'

import { Product } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProductStatsProps {
  products: Product[]
}

export function ProductStats({ products }: ProductStatsProps) {
  // Preparar datos para el gráfico
  const chartData = products.map(product => ({
    name: product.name,
    stock: product.stock,
    price: product.price
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="stock" fill="#8884d8" name="Stock" />
              <Bar yAxisId="right" dataKey="price" fill="#82ca9d" name="Precio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 