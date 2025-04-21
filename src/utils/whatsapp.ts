import { Order } from '@/types/database'

export class WhatsAppService {
  private phoneNumber: string

  constructor(phoneNumber: string) {
    this.phoneNumber = phoneNumber
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-numeric characters
    return phone.replace(/\D/g, '')
  }

  private createMessage(order: Order): string {
    const items = order.items?.map(item => 
      `- ${item.quantity}x ${item.product.name} ($${item.unitPrice})`
    ).join('\n')

    return `¡Nuevo pedido #${order.shortId}!\n\n` +
           `Cliente: ${order.customer.name}\n` +
           `Tipo: ${order.type === 'DELIVERY' ? 'Delivery' : 'Take Away'}\n` +
           `Dirección: ${order.deliveryAddress || 'Retira en local'}\n` +
           `Teléfono: ${order.customerPhone}\n\n` +
           `Productos:\n${items}\n\n` +
           `Total: $${order.totalAmount}\n\n` +
           `Notas: ${order.notes || 'Sin notas'}`
  }

  getOrderNotificationUrl(order: Order): string {
    const message = encodeURIComponent(this.createMessage(order))
    const phone = this.formatPhoneNumber(this.phoneNumber)
    return `https://wa.me/${phone}?text=${message}`
  }

  getCustomerContactUrl(order: Order): string {
    const message = encodeURIComponent(
      `Hola, sobre mi pedido #${order.shortId}...`
    )
    const phone = this.formatPhoneNumber(this.phoneNumber)
    return `https://wa.me/${phone}?text=${message}`
  }

  getOrderStatusUpdateUrl(order: Order, status: string): string {
    const message = encodeURIComponent(
      `Tu pedido #${order.shortId} ha sido actualizado a: ${status}`
    )
    const phone = this.formatPhoneNumber(order.customerPhone || '')
    return `https://wa.me/${phone}?text=${message}`
  }
}

export const createWhatsAppService = (phoneNumber: string) => {
  return new WhatsAppService(phoneNumber)
} 