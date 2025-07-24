import { supabase } from '../supabase'

// 모든 상품 조회
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// 상품 상세 조회
export const getProduct = async (id) => {
  try {
    console.log('🔍 Fetching product with ID:', id, typeof id)
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    console.log('📦 Product query result:', { data, error })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error(`Product fetch error: ${error.message}`)
    }
    
    if (!data) {
      console.warn('⚠️ No product found with ID:', id)
      return null
    }
    
    console.log('✅ Product found:', data)
    return data
  } catch (error) {
    console.error('💥 Error fetching product:', error.message || error)
    return null
  }
}

// 새 상품 생성
export const createProduct = async (product) => {
  try {
    console.log('Creating product with data:', product)
    
    const productData = {
      title: product.title,
      description: product.description || product.desc,
      category: product.category,
      price: product.price === '나눔' ? 0 : parseInt(product.price),
      status: product.status || null,
      image: product.image,
      images: product.images || [product.image],
      location: product.location,
      distance: product.distance || '',
      view_count: 0,
      like_count: 0,
      chat_count: 0
    }
    
    console.log('Formatted product data:', productData)
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
    
    console.log('Supabase response:', { data, error })
    
    if (error) {
      console.error('Supabase error details:', error)
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    return data[0]
  } catch (error) {
    console.error('Error creating product:', error.message || error)
    throw error
  }
}

// 상품 수정
export const updateProduct = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        title: updates.title,
        description: updates.description || updates.desc,
        category: updates.category,
        price: updates.price === '나눔' ? 0 : parseInt(updates.price),
        status: updates.status,
        image: updates.image,
        images: updates.images || [updates.image],
        location: updates.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// 상품 삭제
export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// 상품 조회수 증가
export const incrementViewCount = async (id) => {
  try {
    const { error } = await supabase
      .rpc('increment_view_count', { product_id: id })
    
    if (error) throw error
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

// 상품 좋아요 수 업데이트
export const updateLikeCount = async (id, count) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ like_count: count })
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating like count:', error)
  }
}

// 상품 댓글 수 업데이트
export const updateChatCount = async (id, count) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ chat_count: count })
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating chat count:', error)
  }
}
