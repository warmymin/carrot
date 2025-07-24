export default function ChatRoomItem({ room, currentUser, onClick }) {
  // 채팅 상대방 정보 결정
  const getOtherUser = () => {
    if (room.sender_id === currentUser?.id) {
      return {
        id: room.receiver_id,
        nickname: '김철수', // 임시 고정값
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };
    } else {
      return {
        id: room.sender_id,
        nickname: '김철수', // 임시 고정값
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };
    }
  };

  const otherUser = getOtherUser();

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // 오늘인지 확인
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      // 며칠 전인지 계산
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return '어제';
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-center space-x-3">
        {/* 상품 이미지 */}
        <div className="relative flex-shrink-0">
          <img
            src={room.product?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face'}
            alt={room.product?.title || '상품 이미지'}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
        </div>

        {/* 채팅 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              {/* 상대방 아바타 */}
              <img
                src={otherUser.avatar}
                alt={otherUser.nickname}
                className="w-5 h-5 rounded-full object-cover"
              />
              {/* 상대방 닉네임 */}
              <span className="font-medium text-gray-900 text-sm">
                {otherUser.nickname}
              </span>
            </div>
            {/* 시간 */}
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTime(room.last_message_time)}
            </span>
          </div>
          
          {/* 상품명 */}
          <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">
            {room.product?.title || '상품 정보 없음'}
          </h4>
          
          {/* 마지막 메시지 */}
          <p className="text-gray-600 text-sm truncate">
            {room.last_message || '메시지가 없습니다'}
          </p>
        </div>

        {/* 알림 배지 (읽지 않은 메시지) */}
        {room.unread_count > 0 && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {room.unread_count > 99 ? '99+' : room.unread_count}
            </span>
          </div>
        )}

        {/* 화살표 아이콘 */}
        <div className="flex-shrink-0 ml-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
} 