'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.fullName) {
      newErrors.fullName = '이름을 입력해주세요.';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        nickname: formData.nickname
      });
      
      if (result.success) {
        setIsSuccess(true);
        console.log('✅ Sign up successful');
      } else {
        setErrors({ submit: result.error || '회원가입에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ submit: '회원가입 중 오류가 발생했습니다.' });
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

  // 회원가입 성공 화면
  if (isSuccess) {
    return (
      <div className="notion-page flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 notion-fade-in">
          <div className="notion-card p-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-slate-900">회원가입 완료!</h1>
            <p className="text-slate-600 mt-4">
              이메일을 확인하여 계정을 활성화해주세요.<br/>
              확인 링크를 클릭한 후 로그인할 수 있습니다.<br/>
              <span className="text-blue-600 font-medium">이메일이 오지 않았다면 스팸함을 확인해보세요.</span>
            </p>
            <div className="space-y-3 mt-6">
              <Link 
                href="/login"
                className="block w-full notion-btn-primary py-3"
              >
                로그인 페이지로 이동
              </Link>
              <Link 
                href="/"
                className="block w-full notion-btn-secondary py-3"
              >
                메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-page flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 notion-fade-in">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Carrot Market</h1>
          <p className="mt-2 text-slate-600">회원가입</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="notion-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              이메일 *
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

          {/* 이름 */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
              이름 *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`notion-input ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="실명을 입력하세요"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-slate-700 mb-2">
              닉네임 *
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleInputChange}
              className={`notion-input ${errors.nickname ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="닉네임을 입력하세요"
            />
            {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              비밀번호 *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              className={`notion-input ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="비밀번호를 입력하세요 (최소 6자)"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              비밀번호 확인 *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`notion-input ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          {/* 전체 오류 메시지 */}
          {errors.submit && (
            <div className="text-center">
              <p className="text-sm text-red-500">{errors.submit}</p>
            </div>
          )}

            {/* 회원가입 버튼 */}
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
                  회원가입 중...
                </span>
              ) : (
                '회원가입'
              )}
            </button>
          </form>
        </div>

        {/* 하단 링크들 */}
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              로그인
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