// app/products/[id]/page.jsx
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import CommentSection from '@/components/CommentSection';
import ChatModal from '@/components/ChatModal';
import { createLikeNotification, createCommentNotification } from '@/utils/notifications';
import { getProduct, getProducts, updateProduct, updateLikeCount } from '@/lib/services/products';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  const [isMyProduct, setIsMyProduct] = useState(false); // 내가 등록한 상품인지 확인
  
  // 드롭다운 메뉴 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // 댓글 기능
  const [comments, setComments] = useState([]);
  
  // 좋아요 기능
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 채팅 기능
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [seller, setSeller] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // 기본 상품 데이터 (Supabase 연동으로 더 이상 사용 안 함)
  /* const defaultProducts = [
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
      status: null,
      seller: {
        name: "안녕하세요",
        location: "응암동",
        manner: "99°C",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format"
      },
      detailDesc: "파세코 듀얼인버터 창문형에어컨 판매합니다\n\n싱글인버터가 아닌 최신형 듀얼인버터 제품입니다\n\n2023년형 모델로 구매한지 얼마 안되었고 실사용은 1달정도만 했습니다. 깨끗한 상태입니다.\n\n직거래 우선이며 택배거래도 가능합니다.",
      images: [
        "https://images.unsplash.com/photo-1596984559333-71b0c7c9e7a0?w=600&auto=format",
        "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=600&auto=format"
      ]
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
      status: "나눔",
      seller: {
        name: "좋은사람",
        location: "양평동4가",
        manner: "36.5°C",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format"
      },
      detailDesc: "이사가면서 더 이상 필요 없어서 나눔합니다.\n사용하실 분 연락주세요.",
      images: [
        "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=600&auto=format"
      ]
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
      chatCount: 1,
      seller: {
        name: "맥북판매",
        location: "양평제2동",
        manner: "37.2°C",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format"
      },
      detailDesc: "맥북 에어 M1 13인치 급처 판매합니다.\n\n배터리 사이클 100회 미만\n외관 상태 매우 양호\n정품 충전기 포함",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format"
      ]
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
      status: "나눔",
      seller: {
        name: "나눔왕",
        location: "성산동",
        manner: "42.1°C",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format"
      },
      detailDesc: "샤오미 공기청정기 나눔합니다.\n\n필터는 교체하셔야 합니다.\n직거래만 가능합니다.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format"
      ]
    }
  ]; */

  const formatPrice = (price) => {
    if (price === '나눔') return price;
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 댓글 추가
  const handleAddComment = (newComment) => {
    const newComments = [...comments, newComment];
    setComments(newComments);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments_${id}`, JSON.stringify(newComments));
    
    // 상품의 댓글 수 업데이트
    updateProductChatCount(parseInt(id), newComments.length);
    
    // 댓글 알림 생성 (본인 상품이 아닌 경우만)
    if (product) {
      createCommentNotification(product.title, newComment.author);
    }
  };

  // 댓글 삭제
  const handleRemoveComment = (commentId) => {
    const newComments = comments.filter(c => c.id !== commentId);
    setComments(newComments);
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments_${id}`, JSON.stringify(newComments));
    
    // 상품의 댓글 수 업데이트
    updateProductChatCount(parseInt(id), newComments.length);
  };

  // 좋아요 토글 (Supabase 연동)
  const toggleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : likes - 1;
      
      // 즉시 UI 업데이트 (UX 향상)
      setIsLiked(newIsLiked);
      setLikes(newLikes);
      
      // 로컬 스토리지에 사용자 좋아요 상태 저장
      localStorage.setItem(`isLiked_${id}`, newIsLiked.toString());
      
      // Supabase에 좋아요 수 업데이트
      await updateLikeCount(parseInt(id), newLikes);
      console.log('✅ Like count updated in Supabase:', newLikes);
      
      // 좋아요 시 알림 생성 (본인 상품이 아닌 경우만)
      if (newIsLiked && product) {
        createLikeNotification(product.title);
      }
      
    } catch (error) {
      console.error('💥 Error updating like count:', error);
      // 오류 시 UI 되돌리기
      setIsLiked(isLiked);
      setLikes(likes);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 상품 정보 업데이트 (댓글 수) - 추후 Supabase 연동 예정
  const updateProductChatCount = (productId, chatCount) => {
    // localStorage 업데이트는 유지 (댓글 시스템이 아직 Supabase 미연동)
    const savedProducts = JSON.parse(localStorage.getItem('carrotProducts') || '[]');
    const updatedProducts = savedProducts.map(p => 
      p.id === productId ? { ...p, chatCount } : p
    );
    localStorage.setItem('carrotProducts', JSON.stringify(updatedProducts));
  };

  // 상품 삭제 기능
  const deleteProduct = () => {
    setIsDropdownOpen(false); // 드롭다운 닫기
    
    const isConfirmed = window.confirm('정말로 이 상품을 삭제하시겠습니까?\n삭제된 상품은 복구할 수 없습니다.');
    
    if (!isConfirmed) return;

    try {
      // 로컬 스토리지에서 상품 삭제
      const savedProducts = JSON.parse(localStorage.getItem('carrotProducts') || '[]');
      const updatedProducts = savedProducts.filter(p => p.id !== parseInt(id));
      localStorage.setItem('carrotProducts', JSON.stringify(updatedProducts));

      // 관련 댓글과 좋아요 데이터도 삭제
      localStorage.removeItem(`comments_${id}`);
      localStorage.removeItem(`likes_${id}`);
      localStorage.removeItem(`isLiked_${id}`);

      alert('상품이 성공적으로 삭제되었습니다.');
      
      // 메인 페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('상품 삭제 중 오류가 발생했습니다:', error);
      alert('상품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 상품 수정 기능
  const editProduct = () => {
    setIsDropdownOpen(false);
    // 수정 페이지로 이동 (쿼리 파라미터로 상품 ID 전달)
    router.push(`/sell?edit=${id}`);
  };

  // 상품 신고 기능
  const reportProduct = () => {
    setIsDropdownOpen(false);
    alert('신고가 접수되었습니다.\n검토 후 조치하겠습니다.');
  };

  // 상품 공유 기능
  const shareProduct = () => {
    setIsDropdownOpen(false);
    
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `${product.title} - ${formatPrice(product.price)}원`,
        url: window.location.href,
      }).catch(err => console.log('공유 실패:', err));
    } else {
      // 웹 공유 API를 지원하지 않는 경우 클립보드 복사
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('상품 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('링크 복사에 실패했습니다.');
      });
    }
  };

  // 관심상품 토글
  const toggleWishlist = () => {
    setIsDropdownOpen(false);
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = parseInt(id);
    const isInWishlist = wishlist.includes(productId);
    
    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(id => id !== productId);
      alert('관심상품에서 제거되었습니다.');
    } else {
      updatedWishlist = [...wishlist, productId];
      alert('관심상품에 추가되었습니다.');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // URL 파라미터 확인하여 채팅 모달 자동 열기
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldOpenChat = urlParams.get('openChat') === 'true';
      if (shouldOpenChat) {
        // 약간의 지연 후 채팅 모달 열기 (상품 데이터 로드 후)
        setTimeout(() => {
          handleStartChat();
        }, 1000);
      }
    }

    // Supabase에서 상품 데이터 로드
    const loadProductFromSupabase = async () => {
      try {
        console.log('🔍 Loading product from Supabase, ID:', id);
        
        const productData = await getProduct(parseInt(id));
        
        if (productData) {
          console.log('✅ Product loaded from Supabase:', productData);
          
          // Supabase 데이터를 UI 형식에 맞게 변환
          const formattedProduct = {
            ...productData,
            desc: productData.description,
            detailDesc: productData.description || "상품 설명이 없습니다.",
            images: productData.images || [productData.image],
            timeAgo: formatTimeAgo(productData.created_at),
            seller: {
              name: "판매자",
              location: productData.location || "응암동",
              manner: "36.5°C",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format"
            }
          };
          
          setProduct(formattedProduct);
          setIsMyProduct(false); // 현재는 모든 상품을 다른 사람 것으로 처리
          
          // 좋아요와 댓글 데이터는 Supabase 데이터 사용
          setLikes(productData.like_count || 0);
          setComments([]); // 추후 댓글 시스템도 Supabase로 연동 예정
          
          // 로컬 저장된 사용자 좋아요 상태 확인
          const savedIsLiked = localStorage.getItem(`isLiked_${id}`) === 'true';
          setIsLiked(savedIsLiked);
          
        } else {
          console.log('❌ Product not found in Supabase, ID:', id);
          console.log('🔍 Available products in Supabase:');
          
          // 사용 가능한 상품 목록 확인
          try {
            const allProducts = await getProducts();
            console.log('📋 All products:', allProducts.map(p => ({ id: p.id, title: p.title })));
          } catch (err) {
            console.error('Failed to fetch all products:', err);
          }
          
          alert(`상품을 찾을 수 없습니다. (ID: ${id})`);
          router.push('/');
        }
      } catch (error) {
        console.error('💥 Error loading product:', error);
        alert('상품을 불러오는 중 오류가 발생했습니다.');
        router.push('/');
      }
    };

    if (id) {
      loadProductFromSupabase();
    }

    // 현재 사용자 로드
    loadCurrentUser();
  }, [id, router]); // eslint-disable-line react-hooks/exhaustive-deps

  // 시간 포맷팅 함수
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };



  const loadCurrentUser = () => {
    // 현재 사용자를 고정 ID로 설정 (홍길동)
    const currentUserId = '00000000-0000-0000-0000-000000000001';
    setCurrentUser({
      id: currentUserId,
      nickname: '홍길동',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    });
    localStorage.setItem('currentUserId', currentUserId);
  };

  const handleStartChat = () => {
    if (product && currentUser) {
      // 상품의 판매자 정보를 바탕으로 채팅 상대 설정
      const productSeller = {
        id: '00000000-0000-0000-0000-000000000002', // 임시 고정 ID (김철수)
        nickname: product.seller?.name || '판매자',
        avatar: product.seller?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };
      setSeller(productSeller);
      setIsChatModalOpen(true);
    } else {
      alert('잠시 후 다시 시도해주세요.');
    }
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setSeller(null);
  };

  const handleBack = () => {
    router.back();
  };



  if (!product) {
    return (
      <div className="notion-page flex items-center justify-center">
        <div className="notion-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">상품을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-4">요청하신 상품이 존재하지 않습니다.</p>
          <button 
            onClick={handleBack}
            className="notion-btn-primary"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-page">
      {/* 상태바 영역 */}
      <div className="safe-area-top bg-white"></div>
      
      {/* 헤더 */}
      <header className="notion-header">
        <div className="notion-container">
          <div className="flex items-center justify-between py-4">
            <button onClick={handleBack} className="notion-icon-btn">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* 미트볼 버튼 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="notion-icon-btn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* 내가 등록한 상품인 경우 */}
                  {isMyProduct ? (
                    <>
                      <button
                        onClick={editProduct}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-slate-700"
                      >
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm font-medium">수정하기</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={deleteProduct}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium">삭제하기</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={toggleWishlist}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-slate-700"
                      >
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">관심상품</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={reportProduct}
                        className="w-full px-4 py-3 text-left hover:bg-yellow-50 flex items-center gap-3 text-yellow-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm font-medium">신고하기</span>
                      </button>
                    </>
                  )}
                  
                  {/* 공통 기능 */}
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={shareProduct}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-slate-700"
                  >
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">공유하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 상품 이미지 */}
      <div className="relative bg-gray-100">
        <div className="aspect-square">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            1 / {product.images.length}
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 pb-24">
        <div className="notion-container py-6 space-y-4">
          {/* 판매자 정보 */}
          <div className="notion-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  {product.seller.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{product.seller.name}</div>
                  <div className="text-gray-600 text-sm">{product.seller.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-orange-500 font-bold text-lg">{product.seller.manner}</span>
                  <span className="text-lg">😊</span>
                </div>
                <div className="text-gray-500 text-xs">매너온도</div>
              </div>
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="notion-card p-5 space-y-4">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>
            
            <div>
              {product.price === '나눔' ? (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 text-3xl font-bold">나눔</span>
                  <span className="text-3xl">🧡</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-slate-900 text-3xl font-bold">
                    {formatPrice(product.price)}원
                  </span>
                  <span className="notion-badge-blue">가격 제안 불가</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{product.location}</span>
              <span>•</span>
              <span>{product.timeAgo}</span>
            </div>

            <div className="notion-divider"></div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {product.detailDesc}
              </p>
            </div>

            {/* 상품 통계 및 좋아요 */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm">{product.viewCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm">{comments.length}</span>
                </div>
              </div>
              
              <button 
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-semibold">{likes}</span>
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
      </div>

      {/* 하단 버튼들 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom backdrop-blur-md bg-white/90">
        <div className="notion-container">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLike}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
            </button>
            
            <button 
              onClick={handleStartChat}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>채팅하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 채팅 모달 */}
      {isChatModalOpen && product && currentUser && seller && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChatModal}
          product={product}
          currentUser={currentUser}
          otherUser={seller}
        />
      )}
    </div>
  );
}
