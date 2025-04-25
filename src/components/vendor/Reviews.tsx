'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
}

interface ReviewsProps {
  reviews: Review[]
}

export function Reviews({ reviews }: ReviewsProps) {
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  const ratingDistribution = Array(5).fill(0)
  reviews.forEach(review => {
    ratingDistribution[review.rating - 1]++
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reseñas y Calificaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            ({reviews.length} reseñas)
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((count, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-8 text-sm text-gray-500">{5 - index} estrellas</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${(count / reviews.length) * 100}%`
                  }}
                />
              </div>
              <div className="w-8 text-sm text-gray-500">{count}</div>
            </div>
          ))}
        </div>

        {reviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Últimas reseñas</h3>
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'PPP', { locale: es })}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 