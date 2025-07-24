'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductList from "@/components/ProductList";
import SearchModal from "@/components/SearchModal";
import NotificationModal from "@/components/NotificationModal";
import { getProducts } from "@/lib/services/products";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  // 지역 선택 드롭다운
  const [selectedLocation, setSelectedLocation] = useState('응암동');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef(null);
  
  // 검색 기능
  const [keyword, setKeyword] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  // 알림 기능
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  
  const locations = ['응암동', '북가좌동', '남가좌동', '갈현동'];

  // Supabase에서 상품 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('상품 로딩 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 상품에 로컬 스토리지 데이터(댓글, 좋아요) 반영 - Phase 2에서 Supabase로 전환 예정
  const updateProductsWithLocalData = (products) => {
    return products.map(product => {
      // 댓글 수 업데이트
      const comments = JSON.parse(localStorage.getItem(`comments_${product.id}`) || '[]');
      const likes = parseInt(localStorage.getItem(`likes_${product.id}`) || product.like_count || '0');
      
      return {
        ...product,
        chatCount: comments.length,
        likeCount: likes,
        desc: product.description // Supabase에서는 description 필드 사용
      };
    });
  };

  // 상품 수량 카운트 업데이트
  const updateProductChatCount = (productId, count) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, chatCount: count } : p
      )
    );
  };

  // localStorage와 Supabase 데이터 동기화
  const syncedProducts = updateProductsWithLocalData(products);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 알림 개수 업데이트
  useEffect(() => {
    const updateNotificationCount = () => {
      const notifications = JSON.parse(localStorage.getItem('carrotNotifications') || '[]');
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setUnreadNotificationCount(unreadCount);
    };

    updateNotificationCount();
    
    // 스토리지 이벤트 리스너 (다른 탭에서의 변경사항 감지)
    const handleStorageChange = () => updateNotificationCount();
    window.addEventListener('storage', handleStorageChange);
    
    // 주기적으로 확인 (같은 탭 내에서의 변경사항 감지)
    const interval = setInterval(updateNotificationCount, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  const handleSellClick = () => {
    router.push('/sell');
  };

  if (isLoading) {
    return (
      <div className="notion-page">
        <div className="safe-area-top bg-white"></div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">상품을 불러오는 중...</p>
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
      <header className="notion-header sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            {/* 로고 및 지역 선택 */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-500">🥕</span>
              <div className="relative" ref={locationDropdownRef}>
                <button 
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center gap-1 text-slate-900 font-semibold hover:text-orange-500 transition-colors"
                >
                  <span>{selectedLocation}</span>
                  <svg className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isLocationDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationChange(location)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          selectedLocation === location ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 우측 아이콘들 */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="notion-icon-btn"
                aria-label="검색"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button 
                onClick={() => setIsNotificationModalOpen(true)}
                className="notion-icon-btn relative"
                aria-label="알림"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82a3 3 0 014.24 0l.71.7a3 3 0 00.71.7 3 3 0 000 4.24l-.7.71a3 3 0 00-.71.7 3 3 0 01-4.24 0l-.71-.7a3 3 0 00-.7-.71 3 3 0 010-4.24l.7-.71a3 3 0 00.71-.7z" />
                </svg>
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 카테고리 탭 */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-20">
        <div className="notion-container">
          <div className="flex gap-6 py-3 overflow-x-auto">
            {['전체', '가전제품', '디지털기기', '가구/인테리어', '유아동', '나눔'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors ${
                  selectedCategory === category
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-600 border-transparent hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 검색 결과 표시 */}
      {keyword && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="notion-container">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-blue-700 font-medium text-sm">&quot;{keyword}&quot; 검색 결과</span>
              </div>
              <button
                onClick={() => setKeyword('')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
              >
                <span>지우기</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 pb-24">
        <ProductList 
          products={syncedProducts}
          keyword={keyword}
          selectedCategory={selectedCategory}
          onSellClick={handleSellClick}
          onClearKeyword={() => setKeyword('')}
          selectedLocation={selectedLocation}
        />
      </main>

      {/* 검색 모달 */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={(searchKeyword) => {
          setKeyword(searchKeyword);
          setIsSearchModalOpen(false);
        }}
        currentKeyword={keyword}
      />

      {/* 알림 모달 */}
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* 플로팅 액션 버튼 */}
      <button 
        onClick={handleSellClick}
        className="notion-fab"
        aria-label="상품 등록"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 하단 네비게이션 */}
      <nav className="notion-nav fixed bottom-0 left-0 right-0 safe-area-bottom z-40">
        <div className="notion-container">
          <div className="flex justify-around py-3">
            <button className="notion-nav-item active">
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium">홈</span>
            </button>

            <button 
              onClick={() => router.push('/community')}
              className="notion-nav-item"
            >
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-xs font-medium">동네생활</span>
            </button>

            <button className="notion-nav-item">
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">동네지도</span>
            </button>

            <button className="notion-nav-item relative">
              <div className="w-6 h-6 mb-1 flex items-center justify-center relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {syncedProducts.reduce((sum, p) => sum + p.chatCount, 0)}
                </span>
              </div>
              <span className="text-xs font-medium">채팅</span>
            </button>

            <button className="notion-nav-item">
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium">나의 당근</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
