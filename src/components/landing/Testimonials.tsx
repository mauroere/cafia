import { StarIcon } from '@heroicons/react/24/solid'
import TestimonialAvatar from './TestimonialAvatar'

const testimonials = [
  {
    content: "Cafia ha revolucionado la forma en que gestionamos nuestro restaurante. Los pedidos online han aumentado un 40% desde que comenzamos.",
    author: "María González",
    role: "Dueña de La Cocina de María",
    color: "#FF6B6B"
  },
  {
    content: "La integración con WhatsApp es fantástica. Nuestros clientes pueden hacer pedidos fácilmente y nosotros gestionarlos sin complicaciones.",
    author: "Juan Pérez",
    role: "Gerente de Café del Centro",
    color: "#4ECDC4"
  },
  {
    content: "El sistema de pagos integrado nos ahorra mucho tiempo y nos da tranquilidad. ¡Altamente recomendado!",
    author: "Ana Martínez",
    role: "Propietaria de Pizzas Ana",
    color: "#45B7D1"
  }
]

export default function Testimonials() {
  return (
    <div className="landing-testimonials">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600">Testimonios</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-lg leading-6 text-gray-600">{testimonial.content}</p>
                </div>
                <div className="testimonial-author">
                  <TestimonialAvatar name={testimonial.author} color={testimonial.color} />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 