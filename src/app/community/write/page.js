'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    location: '응암동',
    tags: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);

  const postTypes = [
    { key: 'news', name: '동네소식', icon: '📢', description: '우리 동네의 새로운 소식을 공유해요' },
    { key: 'question', name: '동네질문', icon: '❓', description: '궁금한 것을 이웃에게 물어보세요' },
    { key: 'lost', name: '분실/실종', icon: '🔍', description: '잃어버린 물건이나 반려동물을 찾아요' },
    { key: 'restaurant', name: '동네맛집', icon: '🍽️', description: '맛있는 음식점을 추천해주세요' },
    { key: 'life', name: '생활정보', icon: '💡', description: '생활에 도움되는 정보를 나눠요' }
  ];

  const locations = ['응암동', '북가좌동', '남가좌동', '갈현동'];

  // 이미지 선택 처리
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (imagePreview.length + files.length > 5) {
      alert('최대 5장까지 업로드 가능합니다.');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 삭제
  const handleImageRemove = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 새 게시글 데이터
    const newPost = {
      id: Date.now(),
      type: formData.type,
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: '익명',
      location: formData.location,
      timeAgo: '방금 전',
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      images: formData.images,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdAt: new Date().toISOString()
    };

    // 로컬 스토리지에 저장
    const savedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const updatedPosts = [newPost, ...savedPosts];
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));

    alert('게시글이 등록되었습니다!');
    router.push('/community');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => router.back()}
              className="notion-icon-btn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">글쓰기</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="notion-container py-6">
            
            {/* 카테고리 선택 */}
            <div className="notion-card p-5 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">카테고리 선택</h3>
              <div className="grid grid-cols-1 gap-3">
                {postTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.key }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      formData.type === type.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          formData.type === type.key ? 'text-blue-700' : 'text-slate-900'
                        }`}>
                          {type.name}
                        </h4>
                        <p className={`text-sm ${
                          formData.type === type.key ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>
                      </div>
                      {formData.type === type.key && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div className="notion-card p-5 mb-6">
              <label className="block text-lg font-semibold text-slate-900 mb-4">제목</label>
              <input 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="제목을 입력하세요"
                className="notion-input"
                required
                maxLength={100}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.title.length}/100
              </div>
            </div>

            {/* 내용 */}
            <div className="notion-card p-5 mb-6">
              <label className="block text-lg font-semibold text-slate-900 mb-4">내용</label>
              <textarea 
                value={formData.content} 
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} 
                placeholder="이웃들과 나누고 싶은 이야기를 자유롭게 작성해주세요."
                rows={8}
                className="notion-textarea"
                required
                maxLength={2000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.content.length}/2000
              </div>
            </div>

            {/* 사진 첨부 */}
            <div className="notion-card p-5 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">사진 첨부 (선택)</h3>
              
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
                  <span className="text-xs text-gray-500">{imagePreview.length}/5</span>
                </label>

                {/* 선택된 이미지들 미리보기 */}
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img 
                      src={image} 
                      alt={`미리보기 ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                    />
                    <button 
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {imagePreview.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-gray-600 text-sm">사진을 추가해주세요</div>
                  <div className="text-gray-400 text-xs mt-1">최대 5장까지 가능</div>
                </div>
              )}
            </div>

            {/* 태그 */}
            <div className="notion-card p-5 mb-6">
              <label className="block text-lg font-semibold text-slate-900 mb-4">태그 (선택)</label>
              <input 
                value={formData.tags} 
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} 
                placeholder="태그를 쉼표로 구분해서 입력하세요 (예: 맛집, 추천, 카페)"
                className="notion-input"
              />
              <div className="text-xs text-gray-500 mt-2">
                태그를 사용하면 다른 이웃들이 글을 더 쉽게 찾을 수 있어요
              </div>
            </div>

            {/* 지역 선택 */}
            <div className="notion-card p-5 mb-6">
              <label className="block text-lg font-semibold text-slate-900 mb-4">지역</label>
              <select 
                value={formData.location} 
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} 
                className="notion-input"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 notion-btn-secondary py-3"
              >
                취소
              </button>
              <button 
                type="submit"
                className="flex-1 notion-btn-primary py-3"
              >
                등록하기
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
} 