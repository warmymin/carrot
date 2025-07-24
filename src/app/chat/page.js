'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getChatRooms } from '@/lib/services/chat';
import { getProduct } from '@/lib/services/products';
import ChatRoomItem from '@/components/ChatRoomItem';

export default function ChatPage() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 현재 사용자 설정 (홍길동)
    const user = {
      id: '00000000-0000-0000-0000-000000000001',
      nickname: '홍길동',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    setCurrentUser(user);
    
    loadChatRooms(user.id);
  }, []);

  const loadChatRooms = async (userId) => {
    try {
      console.log('📱 Loading chat rooms for user:', userId);
      setIsLoading(true);
      
      const rooms = await getChatRooms(userId);
      console.log('💬 Chat rooms loaded:', rooms);
      
      if (rooms && rooms.length > 0) {
        // 각 채팅방에 상품 정보 추가 (안전한 방식)
        const roomsWithProducts = await Promise.all(
          rooms.map(async (room) => {
            try {
              const product = await getProduct(room.product_id);
              return {
                ...room,
                product: product || {
                  title: '상품 정보 없음',
                  image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face'
                }
              };
            } catch (error) {
              console.error('상품 로드 실패:', error);
              return {
                ...room,
                product: {
                  title: '상품 로드 실패',
                  image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face'
                }
              };
            }
          })
        );
        
        setChatRooms(roomsWithProducts);
      } else {
        setChatRooms([]);
      }
      
    } catch (error) {
      console.error('💥 Error loading chat rooms:', error);
      setChatRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatRoomClick = (room) => {
    // 상품 상세 페이지로 이동하여 채팅 모달 열기
    router.push(`/products/${room.product_id}?openChat=true`);
  };

  const handleBack = () => {
    router.push('/');
  };

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
            <h1 className="text-lg font-semibold text-slate-900">채팅</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="notion-container py-4">
          {isLoading ? (
            // 로딩 상태
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">채팅방을 불러오는 중...</p>
            </div>
          ) : chatRooms.length === 0 ? (
            // 채팅방이 없는 경우
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 채팅방이 없어요</h3>
              <p className="text-gray-500 text-center mb-6">
                관심있는 상품에서 채팅하기 버튼을<br />
                눌러서 대화를 시작해보세요!
              </p>
              <button 
                onClick={() => router.push('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                상품 둘러보기
              </button>
            </div>
          ) : (
            // 채팅방 목록
            <div className="space-y-2">
              {chatRooms.map((room, index) => (
                <ChatRoomItem
                  key={`${room.product_id}-${room.sender_id}-${room.receiver_id}-${index}`}
                  room={room}
                  currentUser={currentUser}
                  onClick={() => handleChatRoomClick(room)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 