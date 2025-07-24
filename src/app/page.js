'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductList from "@/components/ProductList";
import SearchModal from "@/components/SearchModal";
import NotificationModal from "@/components/NotificationModal";
import { getProducts } from '@/lib/services/products';
import { useAuth } from '@/contexts/AuthContext';

// 기본 더미 상품 데이터
const defaultProducts = [
  {
    id: 1,
    title: "파세코 창문형 인버터 에어컨 PWA-3250W (연장)",
    desc: "거의 새것, 케이스 포함. 보호필름 부착상태입니다.",
    price: 340000,
    image: "https://images.unsplash.com/photo-1596984559333-71b0c7c9e7a0?w=400&auto=format",
    location: "망원제1동",
    distance: "400m",
    timeAgo: "1시간 전",
    viewCount: 45,
    likeCount: 6,
    chatCount: 0,
    status: null
  },
  {
    id: 2,
    title: "캐리어 벽걸이 에어컨",
    desc: "18평형, 설치비 별도. 리모컨 포함",
    price: "나눔",
    image: "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=400&auto=format",
    location: "양평동4가",
    distance: "1.8km",
    timeAgo: "5분 전",
    viewCount: 89,
    likeCount: 0,
    chatCount: 1,
    status: "나눔"
  },
  {
    id: 3,
    title: "m1 맥북 a급 급처",
    desc: "액정 깨짐 없음, 배터리 상태 양호",
    price: 700000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format",
    location: "양평제2동",
    distance: "",
    timeAgo: "4분 전",
    viewCount: 67,
    likeCount: 1,
    chatCount: 1
  },
  {
    id: 4,
    title: "나눔 샤오미 미에어 공기청정기",
    desc: "정품, 박스 및 충전기 포함",
    price: "나눔",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format",
    location: "성산동",
    distance: "900m",
    timeAgo: "1일 전",
    viewCount: 134,
    likeCount: 0,
    chatCount: 8,
    status: "나눔"
  }
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState(defaultProducts);
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

  // 상품에 로컬 스토리지 데이터(댓글, 좋아요) 반영
  const updateProductsWithLocalData = (products) => {
    return products.map(product => {
      // 댓글 수 업데이트
      const comments = JSON.parse(localStorage.getItem(`comments_${product.id}`) || '[]');
      const likes = parseInt(localStorage.getItem(`likes_${product.id}`) || product.likeCount || '0');
      
      return {
        ...product,
        chatCount: comments.length,
        likeCount: likes
      };
    });
  };



  // 컴포넌트 마운트 시 Supabase에서 상품들 불러오기
  useEffect(() => {
    const loadProductsFromSupabase = async () => {
      try {
        console.log('🏠 Loading products from Supabase...');
        const supabaseProducts = await getProducts();
        console.log('📦 Products loaded:', supabaseProducts);
        
        // Supabase 데이터에 로컬 스토리지 댓글/좋아요 데이터 반영
        const productsWithLocalData = updateProductsWithLocalData(supabaseProducts);
        setProducts(productsWithLocalData);
        
      } catch (error) {
        console.error('💥 Error loading products:', error);
        // 오류 시 기본 상품들로 폴백
        const allProducts = updateProductsWithLocalData(defaultProducts);
        setProducts(allProducts);
      }
    };

    loadProductsFromSupabase();
  }, []);

  // 포커스/비져빌리티 변경 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = async () => {
      try {
        console.log('🔄 Refreshing products from Supabase...');
        const supabaseProducts = await getProducts();
        const productsWithLocalData = updateProductsWithLocalData(supabaseProducts);
        setProducts(productsWithLocalData);
      } catch (error) {
        console.error('💥 Error refreshing products:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSellClick = () => {
    router.push('/sell');
  };

  // 지역 선택 처리
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  // 검색 처리
  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setIsSearchModalOpen(false);
  };

  // 읽지 않은 알림 개수 업데이트
  useEffect(() => {
    const updateNotificationCount = () => {
      const notifications = JSON.parse(localStorage.getItem('carrotNotifications') || '[]');
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setUnreadNotificationCount(unreadCount);
    };

    // 초기 로드 시 알림 개수 확인
    updateNotificationCount();

    // 알림 모달이 닫힐 때마다 개수 업데이트
    if (!isNotificationModalOpen) {
      updateNotificationCount();
    }
  }, [isNotificationModalOpen]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = ['전체', '동네소식', '냉방기기', '중고거래', '나눔'];

  return (
    <div className="notion-page">
      {/* 상태바 영역 */}
      <div className="safe-area-top bg-white"></div>
      
      {/* 헤더 */}
      <header className="notion-header">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            {/* 지역 선택 드롭다운 */}
            <div className="relative" ref={locationDropdownRef}>
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
              >
                <h1 className="text-xl font-bold text-slate-900">{selectedLocation}</h1>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isLocationDropdownOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 지역 드롭다운 메뉴 */}
              {isLocationDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedLocation === location 
                          ? 'text-blue-600 bg-blue-50 font-semibold' 
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{location}</span>
                        {selectedLocation === location && (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="notion-icon-btn"
                title="검색"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button 
                onClick={() => setIsNotificationModalOpen(true)}
                className="notion-icon-btn relative"
                title="알림"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a6 6 0 00-12 0v9h12V8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </span>
                )}
              </button>
              
              {/* 인증 상태에 따른 버튼 */}
              {isAuthenticated ? (
                <button 
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 notion-btn-primary text-sm"
                  title="프로필"
                >
                  <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.user_metadata?.nickname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <span className="font-medium">
                    {user?.user_metadata?.nickname || '프로필'}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/login')}
                  className="notion-btn-primary text-sm"
                  title="로그인"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 검색 키워드 표시 */}
      {keyword && (
        <div className="bg-blue-50 border-b border-blue-200">
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

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-gray-200">
        <div className="notion-container">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 pb-24">
        <ProductList 
          products={products}
          keyword={keyword}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          onSellClick={handleSellClick}
          onClearKeyword={() => setKeyword('')}
        />
      </main>

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

            <button 
              onClick={() => router.push('/chat')}
              className="notion-nav-item relative"
            >
              <div className="w-6 h-6 mb-1 flex items-center justify-center relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {products.reduce((sum, p) => sum + p.chatCount, 0)}
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

      {/* 검색 모달 */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
        selectedLocation={selectedLocation}
      />

      {/* 알림 모달 */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
