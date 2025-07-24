'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login successful, redirecting...');
        router.replace('/');
      } else {
        // 이메일 확인 오류에 대한 특별 처리
        if (result.error === 'Email not confirmed') {
          setErrors({ 
            submit: '이메일 확인이 필요합니다. 회원가입 시 받은 이메일을 확인해주세요. 이메일을 받지 못했다면 스팸함도 확인해보세요.' 
          });
        } else {
          setErrors({ submit: result.error || '로그인에 실패했습니다.' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: '로그인 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중이거나 이미 인증된 경우 로딩 화면 표시
  if (loading || isAuthenticated) {
    return (
      <div className="notion-page flex items-center justify-center">
        <div className="text-slate-700 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-page flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 notion-fade-in">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Carrot Market</h1>
          <p className="mt-2 text-slate-600">로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="notion-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`notion-input ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="이메일을 입력하세요"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`notion-input ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* 전체 오류 메시지 */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'notion-btn-primary'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
          </form>
        </div>

        {/* 하단 링크들 */}
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              회원가입
            </Link>
          </p>
          
          <Link 
            href="/" 
            className="inline-block text-slate-500 hover:text-slate-700 transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 