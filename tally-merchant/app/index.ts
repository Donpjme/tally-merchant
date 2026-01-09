export interface Product {
  id: string
  store_id: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  cost_per_item: number | null
  inventory_count: number
  category: string | null
  status: 'active' | 'draft' | 'archived'
  images: string[] | null
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price: number
  inventory_count: number
  options: Record<string, string>
}

export interface Order {
  id: string
  store_id: string
  customer_name: string
  status: 'paid' | 'pending' | 'shipped' | 'cancelled'
  total_amount: number
  created_at: string
}

export interface Store {
  id: string
  owner_id: string
  name: string
  slug: string
  currency: string
  created_at: string
}