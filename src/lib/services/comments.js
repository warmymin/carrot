import { supabase } from '../supabase'

// 특정 상품의 댓글 목록 가져오기
export const getComments = async (productId) => {
  try {
    console.log('💬 Fetching comments for product:', productId)
    
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching comments:', error)
      throw error
    }
    
    console.log('✅ Comments loaded:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('💥 Failed to fetch comments:', error.message)
    return []
  }
}

// 새 댓글 작성
export const createComment = async (productId, content, user) => {
  try {
    console.log('💬 Creating comment for product:', productId)
    
    const commentData = {
      product_id: productId,
      user_id: user.id,
      user_email: user.email,
      user_nickname: user.user_metadata?.nickname || user.email?.split('@')[0],
      content: content.trim()
    }
    
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating comment:', error)
      throw error
    }
    
    console.log('✅ Comment created:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Failed to create comment:', error.message)
    return { success: false, error: error.message }
  }
}

// 댓글 수정
export const updateComment = async (commentId, content, user) => {
  try {
    console.log('💬 Updating comment:', commentId)
    
    const { data, error } = await supabase
      .from('comments')
      .update({ 
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', user.id) // 본인 댓글만 수정 가능
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating comment:', error)
      throw error
    }
    
    console.log('✅ Comment updated:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Failed to update comment:', error.message)
    return { success: false, error: error.message }
  }
}

// 댓글 삭제
export const deleteComment = async (commentId, user) => {
  try {
    console.log('💬 Deleting comment:', commentId)
    
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id) // 본인 댓글만 삭제 가능
    
    if (error) {
      console.error('❌ Error deleting comment:', error)
      throw error
    }
    
    console.log('✅ Comment deleted successfully')
    return { success: true }
  } catch (error) {
    console.error('💥 Failed to delete comment:', error.message)
    return { success: false, error: error.message }
  }
}

// 실시간 댓글 구독
export const subscribeToComments = (productId, callback) => {
  console.log('🔄 Subscribing to comments for product:', productId)
  
  return supabase
    .channel(`comments-${productId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `product_id=eq.${productId}`
      },
      (payload) => {
        console.log('🔄 Comment change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
}

// 댓글 구독 해제
export const unsubscribeFromComments = (subscription) => {
  if (subscription) {
    console.log('🔄 Unsubscribing from comments')
    subscription.unsubscribe()
  }
} 