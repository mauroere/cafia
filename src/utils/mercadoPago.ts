import axios from 'axios'
import { Order } from '@/types/database'

interface CreatePaymentData {
  transaction_amount: number
  description: string
  payment_method_id: string
  payer: {
    email: string
  }
  external_reference: string
}

interface PaymentResponse {
  id: string
  status: string
  external_reference: string
}

export class MercadoPagoService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    }
  }

  async createPayment(order: Order): Promise<PaymentResponse> {
    try {
      const paymentData: CreatePaymentData = {
        transaction_amount: order.totalAmount,
        description: `Pedido #${order.shortId}`,
        payment_method_id: 'qr',
        payer: {
          email: order.customer.email,
        },
        external_reference: order.id,
      }

      const response = await axios.post(
        'https://api.mercadopago.com/v1/payments',
        paymentData,
        { headers: this.headers }
      )

      return {
        id: response.data.id,
        status: response.data.status,
        external_reference: response.data.external_reference,
      }
    } catch (error) {
      console.error('Error creating Mercado Pago payment:', error)
      throw new Error('Failed to create payment')
    }
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        { headers: this.headers }
      )

      return response.data.status
    } catch (error) {
      console.error('Error getting Mercado Pago payment status:', error)
      throw new Error('Failed to get payment status')
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await axios.post(
        `https://api.mercadopago.com/v1/payments/${paymentId}/cancel`,
        {},
        { headers: this.headers }
      )
    } catch (error) {
      console.error('Error canceling Mercado Pago payment:', error)
      throw new Error('Failed to cancel payment')
    }
  }
}

export const createMercadoPagoService = (accessToken: string) => {
  return new MercadoPagoService(accessToken)
} 