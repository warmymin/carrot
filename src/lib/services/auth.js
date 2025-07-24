import { supabase } from '../supabase'

// 회원가입
export const signUp = async (email, password, userData = {}) => {
  try {
    console.log('📝 Signing up user:', email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName || '',
          nickname: userData.nickname || '',
          ...userData
        }
      }
    })
    
    if (error) {
      console.error('❌ Sign up error:', error)
      throw error
    }
    
    console.log('✅ Sign up successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Sign up failed:', error.message)
    return { success: false, error: error.message }
  }
}

// 로그인
export const signIn = async (email, password) => {
  try {
    console.log('🔑 Signing in user:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Sign in error:', error)
      throw error
    }
    
    console.log('✅ Sign in successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Sign in failed:', error.message)
    return { success: false, error: error.message }
  }
}

// 로그아웃
export const signOut = async () => {
  try {
    console.log('👋 Signing out user')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out error:', error)
      throw error
    }
    
    console.log('✅ Sign out successful')
    return { success: true }
  } catch (error) {
    console.error('💥 Sign out failed:', error.message)
    return { success: false, error: error.message }
  }
}

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // 세션이 없는 경우는 정상적인 상태
      if (error.message === 'Auth session missing!') {
        return null
      }
      console.error('❌ Get user error:', error)
      throw error
    }
    
    return user
  } catch (error) {
    // 세션이 없는 경우는 로그를 출력하지 않음
    if (error.message === 'Auth session missing!') {
      return null
    }
    console.error('💥 Get user failed:', error.message)
    return null
  }
}

// 사용자 정보 업데이트
export const updateUserProfile = async (updates) => {
  try {
    console.log('📝 Updating user profile:', updates)
    
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) {
      console.error('❌ Update profile error:', error)
      throw error
    }
    
    console.log('✅ Profile updated:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Profile update failed:', error.message)
    return { success: false, error: error.message }
  }
}

// 비밀번호 재설정 요청
export const resetPassword = async (email) => {
  try {
    console.log('🔒 Requesting password reset for:', email)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) {
      console.error('❌ Password reset error:', error)
      throw error
    }
    
    console.log('✅ Password reset email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Password reset failed:', error.message)
    return { success: false, error: error.message }
  }
}

// 인증 상태 변화 감지
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', event, session?.user?.email)
    callback(event, session)
  })
} 