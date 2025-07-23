'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CommentSection from '@/components/CommentSection';
import { createLikeNotification, createCommentNotification } from '@/utils/notifications';

// 기본 게시글 데이터 (동네생활용)
const defaultCommunityPosts = [
  {
    id: 1,
    type: 'news',
    title: '응암동 새로운 카페 오픈했어요!',
    content: '응암로에 새로운 카페가 오픈했습니다. 분위기도 좋고 커피도 맛있더라고요. 한번 가보세요~\n\n카페 이름은 "동네쉼터"이고, 응암역에서 도보 5분 거리에 있어요. 인테리어가 정말 예쁘고 사장님도 친절하시더라구요.',
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
  }
];

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);

  // 페이지 로드 시 게시글 데이터 불러오기
  useEffect(() => {
    // 로컬 스토리지에서 저장된 게시글 불러오기
    const savedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const allPosts = [...savedPosts, ...defaultCommunityPosts];
    const foundPost = allPosts.find(p => p.id === parseInt(id));
    
    if (foundPost) {
      setPost(foundPost);
      setLikes(foundPost.likeCount);
      
      // 로컬 스토리지에서 좋아요 상태 불러오기
      const likedStatus = localStorage.getItem(`community_liked_${id}`) === 'true';
      setIsLiked(likedStatus);
      
      // 댓글 불러오기
      const savedComments = JSON.parse(localStorage.getItem(`community_comments_${id}`) || '[]');
      setComments(savedComments);
    } else {
      alert('게시글을 찾을 수 없습니다.');
      router.push('/community');
    }
  }, [id, router]);

  // 좋아요 토글
  const toggleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`community_likes_${id}`, newLikes.toString());
    localStorage.setItem(`community_liked_${id}`, newIsLiked.toString());
    
    // 좋아요 시 알림 생성
    if (newIsLiked && post) {
      createLikeNotification(post.title);
    }
  };

  // 댓글 추가
  const handleAddComment = (newComment) => {
    const newComments = [...comments, newComment];
    setComments(newComments);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`community_comments_${id}`, JSON.stringify(newComments));
    
    // 댓글 알림 생성
    if (post) {
      createCommentNotification(post.title, newComment.author);
    }
  };

  // 댓글 삭제
  const handleRemoveComment = (commentId) => {
    const newComments = comments.filter(c => c.id !== commentId);
    setComments(newComments);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`community_comments_${id}`, JSON.stringify(newComments));
  };

  const getCategoryInfo = (type) => {
    const categories = {
      news: { name: '동네소식', icon: '📢', color: 'bg-blue-100 text-blue-700' },
      question: { name: '동네질문', icon: '❓', color: 'bg-green-100 text-green-700' },
      lost: { name: '분실/실종', icon: '🔍', color: 'bg-red-100 text-red-700' },
      restaurant: { name: '동네맛집', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
      life: { name: '생활정보', icon: '💡', color: 'bg-purple-100 text-purple-700' }
    };
    return categories[type] || { name: '기타', icon: '📝', color: 'bg-gray-100 text-gray-700' };
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(post.type);

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
            <h1 className="text-lg font-semibold text-slate-900">동네생활</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="notion-container py-6 space-y-6">
          
          {/* 게시글 내용 */}
          <div className="notion-card p-6">
            {/* 카테고리 및 메타 정보 */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                {categoryInfo.icon} {categoryInfo.name}
              </span>
              <span className="text-sm text-gray-500">{post.location}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.timeAgo}</span>
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* 작성자 정보 */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-slate-900">{post.author}</div>
                <div className="text-sm text-gray-500">{post.location}</div>
              </div>
            </div>

            {/* 이미지 (있는 경우) */}
            {post.images && post.images.length > 0 && (
              <div className="mb-6">
                <div className="grid gap-2">
                  {post.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`게시글 이미지 ${index + 1}`}
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 내용 */}
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 상호작용 버튼 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isLiked 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg 
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none'}`} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span className="font-medium">{likes}</span>
                </button>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{comments.length}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{post.viewCount}</span>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <CommentSection
            productId={id}
            comments={comments}
            onAddComment={handleAddComment}
            onRemoveComment={handleRemoveComment}
          />
        </div>
      </main>
    </div>
  );
} 