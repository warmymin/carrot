import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

// 기본값 제공 (개발 환경에서만)
const fallbackUrl = 'https://oyqczjwygubkdkmpcryp.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cWN6and5Z3Via2RrbXBjcnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTc3NDAsImV4cCI6MjA2ODg5Mzc0MH0.CIVlaSag9vCO5SxhL2yBv-KZ7KJUyshXNkZiTZSfhcg'

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
)
