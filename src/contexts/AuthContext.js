'use client';

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, getCurrentUser } from '@/lib/services/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 초기 사용자 로드
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // 세션 없음 오류는 정상적인 상태이므로 로그를 출력하지 않음
        if (error?.message !== 'Auth session missing!') {
          console.error('Error loading user:', error)
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // 인증 상태 변화 감지
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('🔄 Auth Context: state changed', event, session?.user?.email)
      
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    userEmail: user?.email,
    userMetadata: user?.user_metadata || {},
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 