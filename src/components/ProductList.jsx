// components/ProductList.jsx
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard.jsx';

export default function ProductList({ 
  products, 
  keyword = '', 
  selectedCategory = '전체',
  onSellClick,
  onClearKeyword,
  selectedLocation = '응암동'
}) {
  const [sortOption, setSortOption] = useState('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'latest', label: '최신순', icon: '🕒' },
    { value: 'price_low', label: '가격 낮은순', icon: '💰' },
    { value: 'price_high', label: '가격 높은순', icon: '💎' },
    { value: 'popular', label: '인기순', icon: '❤️' },
    { value: 'comments', label: '댓글 많은순', icon: '💬' }
  ];

  // 검색 및 필터링된 상품
  const filteredProducts = products.filter(product => {
    const matchesKeyword = keyword === '' || 
      product.title.toLowerCase().includes(keyword.toLowerCase()) ||
      (product.desc && product.desc.toLowerCase().includes(keyword.toLowerCase()));
    
    const matchesCategory = selectedCategory === '전체' || 
      product.category === selectedCategory ||
      (selectedCategory === '나눔' && product.price === '나눔');
    
    return matchesKeyword && matchesCategory;
  });

  // 가격을 숫자로 변환하는 헬퍼 함수
  const getPriceNumber = (price) => {
    if (!price || price === '나눔') return 0;
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseInt(price.replace(/[^0-9]/g, '')) || 0;
    }
    return 0;
  };

  // 상품 정렬
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'latest':
        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      
      case 'price_low':
        const priceA = getPriceNumber(a.price);
        const priceB = getPriceNumber(b.price);
        return priceA - priceB;
      
      case 'price_high':
        const priceA2 = getPriceNumber(a.price);
        const priceB2 = getPriceNumber(b.price);
        return priceB2 - priceA2;
      
      case 'popular':
        return (b.likeCount || 0) - (a.likeCount || 0);
      
      case 'comments':
        return (b.chatCount || 0) - (a.chatCount || 0);
      
      default:
        return 0;
    }
  });

  const currentSortOption = sortOptions.find(option => option.value === sortOption);

  return (
    <div className="notion-container py-6">
      {/* 상품 통계 */}
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
                '오늘의 중고거래'
              )}
            </h2>
            <p className="text-gray-600 text-sm">
              {selectedLocation} 근처 {sortedProducts.length}개의 상품
              {keyword && products.length !== filteredProducts.length && (
                <span className="text-blue-600 ml-1">(전체 {products.length}개 중)</span>
              )}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>💬 총 {filteredProducts.reduce((sum, p) => sum + p.chatCount, 0)}개 댓글</span>
              <span>❤️ 총 {filteredProducts.reduce((sum, p) => sum + p.likeCount, 0)}개 좋아요</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{sortedProducts.length}</div>
            <div className="text-xs text-gray-500">개</div>
          </div>
        </div>
      </div>

      {/* 정렬 옵션 */}
      {sortedProducts.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            총 {sortedProducts.length}개 상품
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{currentSortOption?.icon}</span>
              <span>{currentSortOption?.label}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                      sortOption === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                    {sortOption === option.value && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 상품 리스트 */}
      <div className="space-y-3">
        {sortedProducts.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {keyword && filteredProducts.length === 0 && (
        <div className="notion-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">검색 결과가 없어요</h3>
          <p className="text-gray-600 mb-4">"{keyword}"와 관련된 상품을 찾을 수 없습니다.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClearKeyword}
              className="notion-btn-secondary"
            >
              검색어 지우기
            </button>
            <button 
              onClick={onSellClick}
              className="notion-btn-primary"
            >
              상품 등록하기
            </button>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {!keyword && filteredProducts.length === 0 && (
        <div className="notion-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">아직 상품이 없어요</h3>
          <p className="text-gray-600 mb-4">첫 번째 상품을 등록해보세요!</p>
          <button 
            onClick={onSellClick}
            className="notion-btn-primary"
          >
            상품 등록하기
          </button>
        </div>
      )}

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {showSortDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
} 