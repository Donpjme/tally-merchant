'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function createStore(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create a store.' }
  }

  const name = formData.get('storeName') as string
  const subdomain = formData.get('subdomain') as string

  if (!name || !subdomain) {
    return { error: 'Store name and subdomain are required.' }
  }

  const { error } = await supabase.from('stores').insert({
    owner_id: user.id,
    name,
    slug: subdomain,
    currency: 'NGN',
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'This subdomain is already taken.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to add a product.' }
  }

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) {
    return { error: 'Store not found.' }
  }

  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const stock = parseInt(formData.get('stock') as string)
  const status = formData.get('status') as string
  const compareAtPrice = formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price') as string) : null
  const costPerItem = formData.get('cost_per_item') ? parseFloat(formData.get('cost_per_item') as string) : null

  if (!name || name.length < 2) {
    return { error: 'Product name is required.' }
  }

  if (isNaN(price) || price < 0) {
    return { error: 'Price must be a valid positive number.' }
  }

  const imageFile = formData.get('image') as File
  let imageUrls: string[] | null = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${store.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      return { error: 'Image upload failed: ' + uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    imageUrls = [publicUrl]
  }

  const variantsJson = formData.get('variants') as string
  let variants: { name: string; price: number; stock: number; options: Record<string, string> }[] = []
  if (variantsJson) {
    try { variants = JSON.parse(variantsJson) } catch {}
  }

  const { data: product, error } = await supabase.from('products').insert({
    store_id: store.id,
    name,
    description,
    price,
    compare_at_price: compareAtPrice,
    cost_per_item: costPerItem,
    inventory_count: stock,
    category,
    status,
    images: imageUrls,
  }).select().single()

  if (error) {
    return { error: error.message }
  }

  if (variants.length > 0 && product) {
    const { error: variantError } = await supabase.from('product_variants').insert(
      variants.map((v) => ({
        product_id: product.id,
        name: v.name,
        price: v.price,
        inventory_count: v.stock,
        options: v.options,
      }))
    )

    if (variantError) {
      // We log but don't fail the whole request since the product was created
      console.error('Error creating variants:', variantError)
    }
  }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const fullName = formData.get('fullName') as string

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: fullName,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profile')
  return { error: null }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/products')
}

export async function updateProduct(prevState: unknown, formData?: FormData) {
  const data = prevState instanceof FormData ? prevState : formData

  if (!data) return { error: 'Invalid form data.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update a product.' }
  }

  const id = data.get('id') as string
  if (!id) {
    return { error: 'Product ID is required.' }
  }

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) {
    return { error: 'Store not found.' }
  }

  const name = data.get('name') as string
  const price = parseFloat(data.get('price') as string)
  const description = data.get('description') as string
  const category = data.get('category') as string
  const stock = parseInt(data.get('stock') as string)
  const status = data.get('status') as string
  const compareAtPrice = data.get('compare_at_price') ? parseFloat(data.get('compare_at_price') as string) : null
  const costPerItem = data.get('cost_per_item') ? parseFloat(data.get('cost_per_item') as string) : null

  const imageFile = data.get('image') as File
  let imageUrls: string[] | null = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${store.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      return { error: 'Image upload failed: ' + uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    imageUrls = [publicUrl]
  }

  const updateData: {
    name: string
    description: string
    price: number
    compare_at_price: number | null
    cost_per_item: number | null
    inventory_count: number
    category: string
    status: string
    images?: string[]
  } = {
    name,
    description,
    price,
    compare_at_price: compareAtPrice,
    cost_per_item: costPerItem,
    inventory_count: stock,
    category,
    status,
  }

  if (imageUrls) {
    updateData.images = imageUrls
  }

  const { error } = await supabase.from('products').update(updateData).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Note: Variant update logic would go here (e.g., delete existing and re-insert)
  // For this MVP step, we focus on the main product fields.

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export async function updateStore(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update store settings.' }
  }

  const name = formData.get('name') as string
  const currency = formData.get('currency') as string

  const { error } = await supabase
    .from('stores')
    .update({ name, currency })
    .eq('owner_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { error: null }
}