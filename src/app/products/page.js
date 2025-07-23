// app/products/page.jsx
'use client';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const sampleProducts = [
    { 
      id: 1, 
      title: '아이폰 14 프로 256GB 딥퍼플', 
      desc: '거의 새것, 케이스 포함. 보호필름 부착상태입니다.', 
      price: 1200000, 
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format',
      location: '강남구 역삼동',
      distance: '1.2km',
      timeAgo: '1시간 전',
      viewCount: 45,
      likeCount: 12,
      chatCount: 8,
      status: '판매중'
    },
    { 
      id: 2, 
      title: '맥북 에어 M2 13인치', 
      desc: '작년에 구입, 사용감 거의 없음. 원박스 및 충전기 포함', 
      price: 1500000, 
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format',
      location: '서초구 서초동',
      distance: '800m',
      timeAgo: '3시간 전',
      viewCount: 89,
      likeCount: 23,
      chatCount: 15,
      status: '판매중'
    },
    { 
      id: 3, 
      title: '갤럭시 S23 자급제', 
      desc: '액정 깨짐 없음, 배터리 상태 양호. 무선충전기 포함', 
      price: 800000, 
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format',
      location: '마포구 홍대입구',
      distance: '2.1km',
      timeAgo: '5시간 전',
      viewCount: 67,
      likeCount: 18,
      chatCount: 12
    },
    { 
      id: 4, 
      title: '에어팟 프로 2세대', 
      desc: '정품, 박스 및 충전기 포함. 3개월 사용', 
      price: 250000, 
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&auto=format',
      location: '성동구 성수동',
      distance: '1.5km',
      timeAgo: '1일 전',
      viewCount: 134,
      likeCount: 31,
      chatCount: 22,
      status: '예약중'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 상태바 영역 */}
      <div className="safe-area-top bg-gray-900"></div>
      
      {/* 헤더 */}
      <header className="bg-gray-900 px-4 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold">중고거래</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 필터 및 정렬 */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              전체
            </button>
            <button className="px-4 py-2 text-gray-400 text-sm hover:text-white transition-colors">
              필터
            </button>
          </div>
          <button className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
            <span>최신순</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 상품 통계 */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold gradient-text">전체 상품</h3>
              <p className="text-gray-400 text-sm">총 {sampleProducts.length}개의 상품</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-500">{sampleProducts.length}</div>
              <div className="text-xs text-gray-400">개</div>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 리스트 */}
      <main className="flex-1 pb-24 md:pb-28">
        <div className="container">
          <div className="space-y-2">
            {sampleProducts.map(p => (
              <Link href={`/products/${p.id}`} key={p.id}>
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
          
          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8 px-4">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
                이전
              </button>
              <button className="px-3 py-2 rounded-lg btn-primary">
                1
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
                2
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
                3
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
                다음
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 플로팅 액션 버튼 */}
      <button className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-14 h-14 btn-primary rounded-full flex items-center justify-center shadow-2xl z-50 animate-float">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 하단 네비게이션 */}
      <nav className="glass fixed bottom-0 left-0 right-0 safe-area-bottom z-40">
        <div className="flex justify-around py-2 md:py-3">
          <button className="flex flex-col items-center py-2 px-3 md:px-4 text-gray-400 hover:text-white transition-colors group">
            <div className="w-6 h-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V9a1 1 0 011-1h2a1 1 0 011 1v12m-6 0h6m2-13v10a1 1 0 01-1 1h-3m-6 0V9a1 1 0 011-1h2a1 1 0 011 1v12" />
              </svg>
            </div>
            <span className="text-xs font-medium">홈</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 md:px-4 text-gray-400 hover:text-white transition-colors group">
            <div className="w-6 h-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="text-xs font-medium">동네생활</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 md:px-4 text-gray-400 hover:text-white transition-colors group">
            <div className="w-6 h-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium">동네지도</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 md:px-4 text-orange-500 relative group">
            <div className="w-6 h-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">8</span>
              </div>
            </div>
            <span className="text-xs font-medium">채팅</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 md:px-4 text-gray-400 hover:text-white transition-colors group">
            <div className="w-6 h-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium">나의 당근</span>
          </button>
        </div>
      </nav>
    </div>
  );
} 