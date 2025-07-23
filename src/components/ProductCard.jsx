// components/ProductCard.jsx
export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    if (price === '나눔') return price;
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="notion-card group cursor-pointer notion-fade-in overflow-hidden">
      <div className="flex gap-4 p-5">
        {/* 상품 이미지 */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.status && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
              product.status === '나눔' 
                ? 'notion-badge-green' 
                : product.status === '예약중' 
                  ? 'notion-badge-blue'
                  : 'notion-badge-orange'
            }`}>
              {product.status}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* 제목과 설명 */}
          <div className="space-y-2">
            <h3 className="text-slate-900 font-semibold text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.title}
            </h3>
            {product.desc && (
              <p className="text-gray-600 text-sm line-clamp-1">
                {product.desc}
              </p>
            )}
          </div>

          {/* 위치 및 시간 */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-orange-600">{product.location}</span>
            </div>
            {product.distance && (
              <>
                <span>•</span>
                <span>{product.distance}</span>
              </>
            )}
            <span>•</span>
            <span>{product.timeAgo}</span>
          </div>

          {/* 가격 및 상호작용 */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex-1">
              {product.price === '나눔' ? (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold text-lg">나눔</span>
                  <span className="text-lg">🧡</span>
                </div>
              ) : (
                <span className="text-slate-900 font-bold text-lg">
                  {formatPrice(product.price)}원
                </span>
              )}
            </div>

            {/* 상호작용 아이콘들 */}
            <div className="flex items-center gap-3 text-gray-400">
              {product.chatCount > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{product.chatCount}</span>
                </div>
              )}
              
              {product.likeCount > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{product.likeCount}</span>
                </div>
              )}
              
              {product.viewCount > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{product.viewCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 