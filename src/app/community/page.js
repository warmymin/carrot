'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 기본 동네생활 게시글 데이터
const defaultCommunityPosts = [
  {
    id: 1,
    type: 'news',
    title: '응암동 새로운 카페 오픈했어요!',
    content: '응암로에 새로운 카페가 오픈했습니다. 분위기도 좋고 커피도 맛있더라고요. 한번 가보세요~',
    author: '카페러버',
    location: '응암동',
    timeAgo: '1시간 전',
    likeCount: 12,
    commentCount: 5,
    viewCount: 89,
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'],
    tags: ['카페', '신규', '추천']
  },
  {
    id: 2,
    type: 'question',
    title: '북가좌동 맛있는 중국집 추천해주세요!',
    content: '이사온지 얼마 안되서 아직 동네 맛집을 잘 몰라요. 중국집 추천 부탁드립니다.',
    author: '새이웃',
    location: '북가좌동',
    timeAgo: '3시간 전',
    likeCount: 8,
    commentCount: 15,
    viewCount: 156,
    images: [],
    tags: ['질문', '맛집', '중국집']
  },
  {
    id: 3,
    type: 'lost',
    title: '고양이를 찾아요 (남가좌동)',
    content: '어제 저녁부터 고양이가 없어졌어요. 노란색 털에 흰 배, 목에 파란 목걸이를 하고 있습니다. 혹시 보신 분 계시면 연락 부탁드려요.',
    author: '냥집사',
    location: '남가좌동',
    timeAgo: '6시간 전',
    likeCount: 23,
    commentCount: 8,
    viewCount: 234,
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'],
    tags: ['분실', '고양이', '급해요']
  },
  {
    id: 4,
    type: 'restaurant',
    title: '갈현동 백종원 골목식당 다녀왔어요',
    content: 'TV에 나왔던 그 집! 정말 맛있더라고요. 줄은 좀 있지만 기다려도 먹을 가치가 있어요. 강추!',
    author: '먹방러',
    location: '갈현동',
    timeAgo: '1일 전',
    likeCount: 45,
    commentCount: 22,
    viewCount: 567,
    images: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400'],
    tags: ['맛집', '골목식당', '강추']
  },
  {
    id: 5,
    type: 'life',
    title: '응암동 주민센터 주차 팁',
    content: '주민센터 가실 때 뒤편 공영주차장 이용하시면 2시간 무료예요. 앞쪽은 항상 자리가 없더라고요.',
    author: '동네토박이',
    location: '응암동',
    timeAgo: '2일 전',
    likeCount: 67,
    commentCount: 12,
    viewCount: 234,
    images: [],
    tags: ['생활정보', '주차', '꿀팁']
  }
];

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(defaultCommunityPosts);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('응암동');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef(null);

  const categories = [
    { key: 'all', name: '전체', icon: '📋' },
    { key: 'news', name: '동네소식', icon: '📢' },
    { key: 'question', name: '동네질문', icon: '❓' },
    { key: 'lost', name: '분실/실종', icon: '🔍' },
    { key: 'restaurant', name: '동네맛집', icon: '🍽️' },
    { key: 'life', name: '생활정보', icon: '💡' }
  ];

  const locations = ['응암동', '북가좌동', '남가좌동', '갈현동'];

  // 지역 선택 처리
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  // 검색 및 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchesKeyword = keyword === '' || 
      post.title.toLowerCase().includes(keyword.toLowerCase()) ||
      post.content.toLowerCase().includes(keyword.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()));
    
    const matchesCategory = selectedCategory === '전체' || 
      post.type === categories.find(cat => cat.name === selectedCategory)?.key;
    
    return matchesKeyword && matchesCategory;
  });

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 컴포넌트 마운트 시 로컬 스토리지에서 게시글 불러오기
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    if (savedPosts.length > 0) {
      setPosts([...savedPosts, ...defaultCommunityPosts]);
    }
  }, []);

  const handleWritePost = () => {
    router.push('/community/write');
  };

  const handlePostClick = (postId) => {
    router.push(`/community/${postId}`);
  };

  const getCategoryColor = (type) => {
    const colors = {
      news: 'bg-blue-100 text-blue-700',
      question: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
      restaurant: 'bg-orange-100 text-orange-700',
      life: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            {/* 뒤로가기 버튼 */}
            <button 
              onClick={() => router.push('/')}
              className="notion-icon-btn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 지역 선택 */}
            <div className="relative" ref={locationDropdownRef}>
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <h1 className="text-xl font-bold text-slate-900">{selectedLocation} 동네생활</h1>
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
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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

            {/* 글쓰기 버튼 */}
            <button 
              onClick={handleWritePost}
              className="notion-btn-primary px-4 py-2"
            >
              글쓰기
            </button>
          </div>
        </div>
      </header>

      {/* 검색바 */}
      <div className="bg-white border-b border-gray-200">
        <div className="notion-container py-4">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="궁금한 것을 검색해보세요"
              className="w-full bg-gray-100 border-0 rounded-lg py-3 pl-10 pr-4 text-slate-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white border-b border-gray-200">
        <div className="notion-container">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button 
                key={category.key}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.name 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 pb-24">
        <div className="notion-container py-6">
          {/* 게시글 통계 */}
          <div className="notion-card mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  {keyword ? (
                    <div className="flex items-center gap-2">
                      <span>"{keyword}" 검색결과</span>
                      <span className="text-xl">🔍</span>
                    </div>
                  ) : (
                    `${selectedLocation} ${selectedCategory}`
                  )}
                </h2>
                <p className="text-gray-600 text-sm">
                  {filteredPosts.length}개의 게시글
                  {keyword && posts.length !== filteredPosts.length && (
                    <span className="text-blue-600 ml-1">(전체 {posts.length}개 중)</span>
                  )}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>💬 총 {filteredPosts.reduce((sum, p) => sum + p.commentCount, 0)}개 댓글</span>
                  <span>❤️ 총 {filteredPosts.reduce((sum, p) => sum + p.likeCount, 0)}개 좋아요</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredPosts.length}</div>
                <div className="text-xs text-gray-500">개</div>
              </div>
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post.id)}
                className="notion-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* 게시글 내용 */}
                  <div className="flex-1 min-w-0">
                    {/* 카테고리 배지 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(post.type)}`}>
                        {categories.find(cat => cat.key === post.type)?.name}
                      </span>
                      <span className="text-xs text-gray-500">{post.location}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{post.timeAgo}</span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-slate-900 font-semibold text-lg leading-tight mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* 내용 */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* 태그 */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 상호작용 */}
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.commentCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 (있는 경우만) */}
                  {post.images.length > 0 && (
                    <div className="flex-shrink-0">
                      <img 
                        src={post.images[0]} 
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {keyword && filteredPosts.length === 0 && (
            <div className="notion-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">검색 결과가 없어요</h3>
              <p className="text-gray-600 mb-4">"{keyword}"와 관련된 게시글을 찾을 수 없습니다.</p>
              <button 
                onClick={() => setKeyword('')}
                className="notion-btn-secondary"
              >
                검색어 지우기
              </button>
            </div>
          )}

          {/* 빈 상태 */}
          {!keyword && filteredPosts.length === 0 && (
            <div className="notion-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">아직 게시글이 없어요</h3>
              <p className="text-gray-600 mb-4">첫 번째 동네 이야기를 시작해보세요!</p>
              <button 
                onClick={handleWritePost}
                className="notion-btn-primary"
              >
                글쓰기
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="notion-container">
          <div className="flex justify-around py-2">
            <button 
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              </div>
              <span className="text-xs font-medium">중고거래</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-4 text-blue-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">동네생활</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">내 근처</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs font-medium">채팅</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
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