'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signOut, updateUserProfile } from '@/lib/services/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        nickname: user.user_metadata?.nickname || ''
      });
    }
  }, [user]);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = '이름을 입력해주세요.';
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const result = await updateUserProfile({
        full_name: formData.fullName.trim(),
        nickname: formData.nickname.trim()
      });

      if (result.success) {
        setIsEditing(false);
        console.log('✅ Profile updated successfully');
      } else {
        setErrors({ submit: result.error || '프로필 업데이트에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ submit: '프로필 업데이트 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await signOut();
      
      if (result.success) {
        console.log('✅ Logout successful');
        router.replace('/');
      } else {
        console.error('❌ Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // 원래 정보로 되돌리기
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        nickname: user.user_metadata?.nickname || ''
      });
    }
  };

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (loading || !isAuthenticated) {
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
    <div className="notion-page px-4 py-8">
      <div className="max-w-md mx-auto notion-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="notion-icon-btn"
          >
            ← 뒤로
          </button>
          <h1 className="text-xl font-bold text-slate-900">프로필</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* 프로필 카드 */}
        <div className="notion-card p-6 space-y-6">
          {/* 아바타 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {formData.nickname ? formData.nickname[0].toUpperCase() : user?.email?.[0].toUpperCase() || '?'}
              </span>
            </div>
          </div>

          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">이메일</label>
            <div className="w-full px-3 py-2 bg-gray-50 text-slate-600 rounded-lg border border-gray-200">
              {user?.email}
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">이름</label>
            {isEditing ? (
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`notion-input ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="이름을 입력하세요"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 text-slate-700 rounded-lg border border-gray-200">
                {formData.fullName || '이름 없음'}
              </div>
            )}
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">닉네임</label>
            {isEditing ? (
              <input
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleInputChange}
                className={`notion-input ${errors.nickname ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="닉네임을 입력하세요"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 text-slate-700 rounded-lg border border-gray-200">
                {formData.nickname || '닉네임 없음'}
              </div>
            )}
            {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
          </div>

          {/* 가입일 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">가입일</label>
            <div className="w-full px-3 py-2 bg-gray-50 text-slate-600 rounded-lg border border-gray-200">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '정보 없음'}
            </div>
          </div>

          {/* 오류 메시지 */}
          {errors.submit && (
            <div className="text-center">
              <p className="text-sm text-red-500">{errors.submit}</p>
            </div>
          )}

          {/* 버튼들 */}
          <div className="space-y-3">
            {isEditing ? (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSaving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'notion-btn-primary'
                  }`}
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 notion-btn-secondary"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 px-4 notion-btn-primary"
              >
                프로필 편집
              </button>
            )}

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoggingOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md'
              }`}
            >
              {isLoggingOut ? (
                <span className="flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  로그아웃 중...
                </span>
              ) : (
                '로그아웃'
              )}
            </button>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
} 