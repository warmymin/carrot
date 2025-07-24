'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProductForm from '@/components/ProductForm';
import { createSystemNotification } from '@/utils/notifications';
import { getProduct, createProduct, updateProduct } from '@/lib/services/products';

function SellPageContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
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

  // 편집 모드일 때 기존 데이터 불러오기 (Supabase에서)
  useEffect(() => {
    const loadProduct = async () => {
      if (isEditMode && editId) {
        try {
          const product = await getProduct(parseInt(editId));
          if (product) {
            setProductData({
              ...product,
              desc: product.description, // UI에서는 desc 사용
              price: product.price === 0 ? '나눔' : product.price
            });
          } else {
            alert('수정할 상품을 찾을 수 없습니다.');
            router.push('/');
          }
        } catch (error) {
          console.error('상품 로딩 중 오류:', error);
          alert('상품을 불러오는 중 오류가 발생했습니다.');
          router.push('/');
        }
      }
    };

    if (!isLoading) {
      loadProduct();
    }
  }, [isEditMode, editId, router, isLoading]);

  const handleFormSubmit = async (formData) => {
    try {
      const productDataForSave = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        image: formData.images[0],
        images: formData.images,
        location: formData.location,
        status: formData.status
      };

      let savedProduct;
      
      if (isEditMode) {
        // 기존 상품 수정 (Supabase)
        savedProduct = await updateProduct(parseInt(editId), productDataForSave);
        alert('상품이 성공적으로 수정되었습니다!');
      } else {
        // 새 상품 등록 (Supabase) - 사용자 정보 포함
        savedProduct = await createProduct(productDataForSave, user);
        alert('상품이 성공적으로 등록되었습니다!');
        
        // 알림 생성
        createSystemNotification(`새로운 상품 "${savedProduct.title}"이 등록되었어요!`);
      }
      
      // 상품 상세 페이지로 이동
      router.push(`/products/${savedProduct.id}`);
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
