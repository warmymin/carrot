import { supabase } from '../supabase'

// 채팅방 목록 조회 (뷰 대신 직접 쿼리 사용)
export const getChatRooms = async (userId) => {
  try {
    console.log('🏠 Fetching chat rooms for user:', userId)
    
    // 간단한 메시지 목록으로 채팅방 구성
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        product_id,
        sender_id,
        receiver_id,
        message,
        created_at
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(50)
    
    console.log('🏠 Chat rooms response:', { data, error })
    
    if (error) {
      console.error('❌ Error fetching chat rooms:', error)
      throw error
    }
    
    // 상품별로 그룹화하여 채팅방 목록 생성
    const roomsMap = new Map()
    data?.forEach(msg => {
      const key = `${msg.product_id}_${Math.min(msg.sender_id, msg.receiver_id)}_${Math.max(msg.sender_id, msg.receiver_id)}`
      if (!roomsMap.has(key)) {
        roomsMap.set(key, {
          product_id: msg.product_id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          last_message: msg.message,
          last_message_time: msg.created_at
        })
      }
    })
    
    const rooms = Array.from(roomsMap.values())
    console.log('✅ Chat rooms processed:', rooms.length, 'rooms')
    return rooms
  } catch (error) {
    console.error('💥 Error fetching chat rooms:', error.message || error)
    return []
  }
}

// 특정 채팅방의 메시지 조회
export const getChatMessages = async (productId, senderId, receiverId) => {
  try {
    console.log('📥 Fetching messages for:', { productId, senderId, receiverId })
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        message,
        sender_id,
        receiver_id,
        product_id,
        created_at,
        read_at,
        is_deleted,
        sender:users!sender_id(id, nickname, avatar),
        receiver:users!receiver_id(id, nickname, avatar)
      `)
      .eq('product_id', productId)
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
    
    console.log('📨 Messages response:', { data, error })
    
    if (error) {
      console.error('❌ Error fetching messages:', error)
      throw error
    }
    
    console.log('✅ Messages fetched successfully:', data?.length || 0, 'messages')
    return data || []
  } catch (error) {
    console.error('💥 Error fetching chat messages:', error.message || error)
    return []
  }
}

// 메시지 전송
export const sendMessage = async (messageData) => {
  try {
    console.log('🚀 Sending message with data:', messageData)
    
    const insertData = {
      message: messageData.message,
      sender_id: messageData.sender_id,
      receiver_id: messageData.receiver_id,
      product_id: messageData.product_id
    }
    
    console.log('📝 Insert data:', insertData)
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([insertData])
      .select(`
        id,
        message,
        sender_id,
        receiver_id,
        product_id,
        created_at,
        read_at,
        is_deleted,
        sender:users!sender_id(id, nickname, avatar),
        receiver:users!receiver_id(id, nickname, avatar)
      `)
    
    console.log('📨 Supabase response:', { data, error })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from insert')
    }
    
    console.log('✅ Message sent successfully:', data[0])
    return data[0]
  } catch (error) {
    console.error('💥 Error sending message:', error.message || error)
    throw error
  }
}

// 메시지 읽음 처리
export const markMessageAsRead = async (messageId, userId) => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('receiver_id', userId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}

// 사용자 정보 조회
export const getUsers = async () => {
  try {
    console.log('👥 Fetching users from Supabase...')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('nickname')
    
    console.log('👤 Users response:', { data, error })
    
    if (error) {
      console.error('❌ Error fetching users:', error)
      throw error
    }
    
    console.log('✅ Users fetched successfully:', data)
    return data || []
  } catch (error) {
    console.error('💥 Error fetching users:', error.message || error)
    return []
  }
}

// 특정 사용자 조회
export const getUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// 실시간 메시지 구독
export const subscribeToChatMessages = (productId, senderId, receiverId, callback) => {
  const subscription = supabase
    .channel(`chat:${productId}:${senderId}:${receiverId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `product_id=eq.${productId}`
      },
      (payload) => {
        // 해당 채팅방의 메시지인지 확인
        const newMessage = payload.new
        if (
          (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
          (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
        ) {
          callback(newMessage)
        }
      }
    )
    .subscribe()

  return subscription
}

// 구독 해제
export const unsubscribeFromChat = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
} 