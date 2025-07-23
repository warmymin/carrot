// components/SearchModal.jsx
import { useState, useEffect, useRef } from 'react';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onSearch, 
  selectedLocation = '응암동' 
}) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  const categories = [
    { icon: '🔍', name: '알바', key: 'job' },
    { icon: '🚗', name: '중고차', key: 'car' },
    { icon: '🏠', name: '부동산', key: 'real-estate' },
    { icon: '👥', name: '모임', key: 'group' },
    { icon: '📖', name: '스토리', key: 'story' },
    { icon: '☰', name: '전체', key: 'all' }
  ];

  const recommendedSearches = [
    '건조대 빨래',
    '빨래건조대대형', 
    '이불건조대',
    '드레스룸',
    '에어컨',
    '맥북',
    '아이폰',
    '냉장고'
  ];

  // 최근 검색어 로컬 스토리지에서 불러오기
  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(saved);
      setSearchKeyword(''); // 모달 열 때마다 검색어 초기화
      setIsSearching(false); // 검색 상태 초기화
      // 모달이 열릴 때 input에 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // 실시간 검색어 변경 처리
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    // 검색어가 있을 때 실시간 검색 상태로 변경
    setIsSearching(value.trim().length > 0);
  };

  // 검색 실행
  const handleSearch = (keyword) => {
    if (!keyword.trim()) return;
    
    // 최근 검색어에 추가
    const newRecentSearches = [
      keyword.trim(),
      ...recentSearches.filter(item => item !== keyword.trim())
    ].slice(0, 10); // 최대 10개까지
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // 검색 실행
    onSearch(keyword.trim());
    onClose();
  };

  // 최근 검색어 삭제
  const removeRecentSearch = (keyword) => {
    const updated = recentSearches.filter(item => item !== keyword);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 전체 최근 검색어 삭제
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onClose} className="notion-icon-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            {selectedLocation} 근처에서 검색
          </h1>
          <button onClick={onClose} className="text-slate-600 font-medium">
            닫기
          </button>
        </div>
      </header>

      {/* 검색 입력 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchKeyword}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
            placeholder="검색어를 입력하세요"
            className="w-full bg-gray-100 border-0 rounded-lg py-3 pl-4 pr-12 text-slate-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setIsSearching(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

              {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-4 py-6 space-y-8">
            {/* 실시간 검색 상태 표시 */}
            {isSearching && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm font-medium">"{searchKeyword}"로 검색 중...</span>
                </div>
                <button
                  onClick={() => handleSearch(searchKeyword)}
                  className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  검색하기 →
                </button>
              </div>
            )}

            {/* 카테고리 */}
            {!isSearching && (
              <div>
                <div className="grid grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => handleSearch(category.name)}
                      className="flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-colors"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                        {category.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 추천 검색 */}
            {!isSearching && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">추천 검색</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedSearches.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleSearch(keyword)}
                      className="bg-white rounded-lg p-4 text-left hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <span className="text-slate-700 font-medium">{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 최근 검색 */}
            {!isSearching && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">최근 검색</h3>
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={clearAllRecentSearches}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        전체 삭제
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((keyword, index) => (
                        <div
                          key={`${keyword}-${index}`}
                          className="bg-white rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
                        >
                          <button
                            onClick={() => handleSearch(keyword)}
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-slate-700">{keyword}</span>
                          </button>
                          <button
                            onClick={() => removeRecentSearch(keyword)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">최근 검색 기록이 없어요</p>
                    <p className="text-gray-400 text-xs mt-1">원하는 상품을 검색해보세요!</p>
                  </div>
                )}
              </div>
            )}

            {/* 검색어 입력 중일 때 안내 메시지 */}
            {isSearching && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">Enter 키를 누르거나 검색하기 버튼을 클릭하세요</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
} 