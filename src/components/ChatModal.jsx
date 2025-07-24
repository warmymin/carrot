import { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendMessage, subscribeToChatMessages, unsubscribeFromChat } from '@/lib/services/chat';
import MessageBubble from './MessageBubble';

export default function ChatModal({ 
  isOpen, 
  onClose, 
  product, 
  currentUser, 
  otherUser 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  // 메시지 목록 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 로드
  useEffect(() => {
    if (isOpen && product && currentUser && otherUser) {
      console.log('🔄 Setting up chat for:', { productId: product.id, currentUserId: currentUser.id, otherUserId: otherUser.id });
      
      loadMessages();
      setupRealtimeSubscription();
    }

    return () => {
      console.log('🧹 Cleaning up chat subscription');
      if (subscriptionRef.current) {
        unsubscribeFromChat(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [isOpen, product?.id, currentUser?.id, otherUser?.id]);

  // 새 메시지가 추가될 때 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const chatMessages = await getChatMessages(
        product.id, 
        currentUser.id, 
        otherUser.id
      );
      setMessages(chatMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (subscriptionRef.current) {
      unsubscribeFromChat(subscriptionRef.current);
    }

    subscriptionRef.current = subscribeToChatMessages(
      product.id,
      currentUser.id,
      otherUser.id,
      (newMessage) => {
        console.log('📨 Received realtime message:', newMessage);
        setMessages(prev => {
          // ID로 중복 체크
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) {
            console.log('⚠️ Duplicate message ignored:', newMessage.id);
            return prev;
          }
          console.log('✅ Adding new message:', newMessage.id);
          return [...prev, newMessage];
        });
      }
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageToSend = newMessage.trim();
    setNewMessage(''); // 즉시 입력창 비우기
    
    try {
      const messageData = {
        message: messageToSend,
        sender_id: currentUser.id,
        receiver_id: otherUser.id,
        product_id: product.id
      };

      await sendMessage(messageData);
      // 수동 추가 제거: 실시간 구독에서 자동으로 추가됨
      
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('메시지 전송에 실패했습니다.');
      // 오류 시 입력창에 메시지 복원
      setNewMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center">
      <div className="w-full max-w-md h-[80vh] bg-white rounded-t-3xl flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={otherUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
              alt={otherUser.nickname}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.nickname}</h3>
              <p className="text-sm text-gray-500 truncate max-w-40">{product.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 상품 정보 */}
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <img 
              src={product.image || product.images?.[0]} 
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{product.title}</h4>
              <p className="text-orange-600 font-semibold text-sm">
                {product.price === 0 || product.price === '나눔' ? '나눔' : `${product.price?.toLocaleString()}원`}
              </p>
            </div>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">첫 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={`${message.id}-${index}`}
                message={message}
                isOwn={message.sender_id === currentUser.id}
                showAvatar={
                  index === 0 || 
                  messages[index - 1].sender_id !== message.sender_id
                }
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력 */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                disabled={isSending}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 