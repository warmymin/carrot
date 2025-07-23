// components/ProductForm.jsx
import { useState } from 'react';

export default function ProductForm({ 
  initialData = null,
  isEditMode = false,
  onSubmit,
  onCancel
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [priceType, setPriceType] = useState(initialData?.price === '나눔' ? 'free' : 'sell');
  const [location, setLocation] = useState(initialData?.location || '응암동');
  const [description, setDescription] = useState(initialData?.desc || initialData?.description || '');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(initialData?.images || []);

  const categories = [
    '디지털기기', '생활가전', '가구/인테리어', '생활/가공식품', '스포츠/레저',
    '여성의류', '남성의류', '게임/취미', '뷰티/미용', '유아동', '반려동물용품',
    '도서/티켓/음반', '식물', '기타 중고물품'
  ];

  // 이미지 파일 선택 처리
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (selectedImages.length + files.length > 10) {
      alert('최대 10장까지 업로드 가능합니다.');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          dataUrl: e.target.result,
          name: file.name
        };
        setSelectedImages(prev => [...prev, newImage]);
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 삭제
  const handleImageRemove = (imageId) => {
    const imageToRemove = selectedImages.find(img => img.id === imageId);
    if (imageToRemove) {
      setImagePreview(prev => prev.filter(url => url !== imageToRemove.dataUrl));
    }
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // 자주 쓰는 문구 삽입
  const insertFrequentText = () => {
    const frequentTexts = [
      '직거래 우선입니다.',
      '깨끗한 상태입니다.',
      '사용감 거의 없어요.',
      '실물과 사진이 동일합니다.'
    ];
    const randomText = frequentTexts[Math.floor(Math.random() * frequentTexts.length)];
    setDescription(prev => prev + (prev ? '\n' + randomText : randomText));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }
    
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (priceType === 'sell' && !price.trim()) {
      alert('가격을 입력해주세요.');
      return;
    }

    const formData = {
      title: title.trim(),
      category,
      description: description.trim(),
      price: priceType === 'free' ? '나눔' : parseInt(price.replace(/,/g, '')),
      location,
      images: imagePreview.length > 0 ? imagePreview : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
      priceType,
      status: priceType === 'free' ? '나눔' : null
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 사진 업로드 */}
      <div className="notion-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">사진</h3>
        
        {/* 이미지 미리보기 및 추가 버튼 */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
          {/* 이미지 추가 버튼 */}
          <label className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageSelect}
              className="hidden" 
            />
            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-500">{selectedImages.length}/10</span>
          </label>

          {/* 선택된 이미지들 미리보기 */}
          {selectedImages.map((img, index) => (
            <div key={img.id} className="relative flex-shrink-0">
              <img 
                src={img.dataUrl} 
                alt={`선택된 이미지 ${index + 1}`}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 notion-badge-orange text-xs">
                  대표
                </div>
              )}
              <button 
                type="button"
                onClick={() => handleImageRemove(img.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}

          {/* 기존 이미지들 (편집 모드에서만) */}
          {isEditMode && imagePreview.filter(url => !selectedImages.some(img => img.dataUrl === url)).map((url, index) => (
            <div key={`existing-${index}`} className="relative flex-shrink-0">
              <img 
                src={url} 
                alt={`기존 이미지 ${index + 1}`}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
              <div className="absolute top-2 left-2 notion-badge-green text-xs">
                기존
              </div>
            </div>
          ))}
        </div>
        
        {selectedImages.length === 0 && imagePreview.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-gray-600 text-sm">사진을 추가해 주세요</div>
            <div className="text-gray-400 text-xs mt-1">최대 10장까지 가능</div>
          </div>
        )}
      </div>

      {/* 제목 */}
      <div className="notion-card p-5">
        <label className="block text-lg font-semibold text-slate-900 mb-4">제목</label>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="글 제목"
          className="notion-input"
          required
        />
      </div>

      {/* 카테고리 */}
      <div className="notion-card p-5">
        <label className="block text-lg font-semibold text-slate-900 mb-4">카테고리</label>
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="notion-input"
          required
        >
          <option value="">카테고리를 선택하세요</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 거래 방식 */}
      <div className="notion-card p-5">
        <label className="block text-lg font-semibold text-slate-900 mb-4">거래 방식</label>
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => setPriceType('sell')}
            className={`py-4 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
              priceType === 'sell' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            판매하기
          </button>
          <button 
            type="button"
            onClick={() => setPriceType('free')}
            className={`py-4 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
              priceType === 'free' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            나눔하기
          </button>
        </div>
      </div>

      {/* 가격 (판매하기 선택 시에만 표시) */}
      {priceType === 'sell' && (
        <div className="notion-card p-5">
          <label className="block text-lg font-semibold text-slate-900 mb-4">가격</label>
          <input 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            placeholder="가격을 입력하세요"
            type="number"
            className="notion-input"
            required
          />
        </div>
      )}

      {/* 자세한 설명 */}
      <div className="notion-card p-5">
        <label className="block text-lg font-semibold text-slate-900 mb-4">자세한 설명</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder={`${location}에 올릴 게시글 내용을 작성해 주세요.\n(판매 금지 물품은 게시가 제한될 수 있어요.)\n\n신뢰할 수 있는 거래를 위해 자세히 적어주세요.`}
          rows={6}
          className="notion-textarea"
        />
        
        <button 
          type="button"
          onClick={insertFrequentText}
          className="notion-btn-secondary mt-3"
        >
          자주 쓰는 문구
        </button>
      </div>

      {/* 거래 희망 장소 */}
      <div className="notion-card p-5">
        <label className="block text-lg font-semibold text-slate-900 mb-4">거래 희망 장소</label>
        <input 
          value={location} 
          onChange={e => setLocation(e.target.value)} 
          placeholder="거래 희망 장소"
          className="notion-input"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 notion-btn-secondary py-3"
        >
          취소
        </button>
        <button 
          type="submit"
          className="flex-1 notion-btn-primary py-3"
        >
          {isEditMode ? '수정 완료' : '등록 완료'}
        </button>
      </div>
    </form>
  );
} 