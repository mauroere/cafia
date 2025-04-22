export enum Role {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum OrderType {
  DELIVERY = 'DELIVERY',
  TAKEAWAY = 'TAKEAWAY',
}

export interface User {
  id: string
  name?: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
  businessId?: string
  business?: Business
  orders?: Order[]
  addresses?: Address[]
}

export interface Business {
  id: string
  ownerId: string
  owner: User
  name: string
  slug: string
  description?: string
  logoUrl?: string
  address?: string
  phone?: string
  whatsappNumber?: string
  isActive: boolean
  isOpen: boolean
  enableDelivery: boolean
  enableTakeaway: boolean
  deliveryFee: number
  estimatedPrepTime?: number
  mercadoPagoAccessToken?: string
  mercadoPagoPublicKey?: string
  createdAt: Date
  updatedAt: Date
  categories?: Category[]
  products?: Product[]
  orders?: Order[]
}

export interface Category {
  id: string
  businessId: string
  business: Business
  name: string
  description?: string
  order: number
  createdAt: Date
  updatedAt: Date
  products?: Product[]
}

export interface Product {
  id: string
  businessId: string
  business: Business
  categoryId: string
  category: Category
  name: string
  description?: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
  orderItems?: OrderItem[]
}

export interface Order {
  id: string
  shortId: string
  customerId: string
  customer: User
  businessId: string
  business: Business
  status: OrderStatus
  type: OrderType
  totalAmount: number
  deliveryAddress?: string
  customerPhone?: string
  notes?: string
  mercadoPagoPaymentId?: string
  mercadoPagoStatus?: string
  createdAt: Date
  updatedAt: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  order: Order
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  subtotal: number
  productSnapshot?: any
}

export interface Address {
  id: string
  userId: string
  user: User
  street: string
  number?: string
  city: string
  state?: string
  zipCode?: string
  details?: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
} 