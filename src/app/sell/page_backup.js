'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import ProductForm from '@/components/ProductForm';
import { createSystemNotification } from '@/utils/notifications';

function SellPageContent() {
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 클라이언트 사이드에서만 URL 파라미터 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const editParam = urlParams.get('edit');
      
      if (editParam) {
        setEditId(editParam);
        setIsEditMode(true);
      }
      setIsLoading(false);
    }
  }, []);

  // 편집 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && editId && typeof window !== 'undefined') {
      const savedProducts = JSON.parse(localStorage.getItem('carrotProducts') || '[]');
      const productToEdit = savedProducts.find(p => p.id === parseInt(editId));
      
      if (productToEdit) {
        setProductData(productToEdit);
      } else {
        alert('수정할 상품을 찾을 수 없습니다.');
        router.push('/');
      }
    }
  }, [isEditMode, editId, router]);

  const handleFormSubmit = (formData) => {
    try {
      const productDataForSave = {
        id: isEditMode ? parseInt(editId) : Date.now(),
        title: formData.title,
        desc: formData.description,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        image: formData.images[0],
        images: formData.images,
        location: formData.location,
        distance: '',
        timeAgo: isEditMode ? '수정됨' : '방금 전',
        viewCount: isEditMode ? (JSON.parse(localStorage.getItem('carrotProducts') || '[]').find(p => p.id === parseInt(editId))?.viewCount || 0) : 0,
        likeCount: isEditMode ? (parseInt(localStorage.getItem(`likes_${editId}`) || '0')) : 0,
        chatCount: isEditMode ? (JSON.parse(localStorage.getItem(`comments_${editId}`) || '[]').length) : 0,
        status: formData.status,
        createdAt: isEditMode ? (JSON.parse(localStorage.getItem('carrotProducts') || '[]').find(p => p.id === parseInt(editId))?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const savedProducts = JSON.parse(localStorage.getItem('carrotProducts') || '[]');
      
      let updatedProducts;
      if (isEditMode) {
        // 기존 상품 수정
        updatedProducts = savedProducts.map(p => 
          p.id === parseInt(editId) ? { ...p, ...productDataForSave } : p
        );
        alert('상품이 성공적으로 수정되었습니다!');
      } else {
        // 새 상품 등록
        updatedProducts = [productDataForSave, ...savedProducts];
        alert('상품이 성공적으로 등록되었습니다!');
      }
      
      localStorage.setItem('carrotProducts', JSON.stringify(updatedProducts));
      
      // 알림 생성
      if (!isEditMode) {
        createSystemNotification(`새로운 상품 "${productDataForSave.title}"이 등록되었어요!`);
      }
      
      // 상품 상세 페이지로 이동
      router.push(`/products/${productDataForSave.id}`);
    } catch (error) {
      console.error('상품 등록/수정 중 오류가 발생했습니다:', error);
      alert('상품 등록/수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="notion-page">
        <div className="safe-area-top bg-white"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-page">
      {/* 상태바 영역 */}
      <div className="safe-area-top bg-white"></div>
      
      {/* 헤더 */}
      <header className="notion-header">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            <button onClick={() => router.back()} className="notion-icon-btn">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">
              {isEditMode ? '상품 수정하기' : '내 물건 팔기'}
            </h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="notion-container py-6">
          <ProductForm
            initialData={productData}
            isEditMode={isEditMode}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default function SellPage() {
  return (
    <Suspense fallback={
      <div className="notion-page">
        <div className="safe-area-top bg-white"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">페이지 로딩 중...</p>
          </div>
        </div>
      </div>
    }>
      <SellPageContent />
    </Suspense>
  );
}