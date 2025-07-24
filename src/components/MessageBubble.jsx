export default function MessageBubble({ message, isOwn, showAvatar }) {
  const formatTime = (timestamp) => {
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
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (isOwn) {
    // 내가 보낸 메시지 (오른쪽)
    return (
      <div className="flex justify-end items-end space-x-2">
        <div className="flex flex-col items-end">
          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-orange-500 text-white rounded-2xl rounded-br-sm">
            <p className="text-sm">{message.message}</p>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {message.read_at && (
              <span className="text-xs text-orange-500">읽음</span>
            )}
            <span className="text-xs text-gray-400">
              {formatTime(message.created_at)}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    // 상대방이 보낸 메시지 (왼쪽)
    return (
      <div className="flex items-end space-x-2">
        {showAvatar && (
          <img
            src={message.sender?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
            alt={message.sender?.nickname || '사용자'}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        {!showAvatar && <div className="w-8" />}
        
        <div className="flex flex-col">
          {showAvatar && (
            <span className="text-xs text-gray-600 mb-1 ml-1">
              {message.sender?.nickname || '익명'}
            </span>
          )}
          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm">
            <p className="text-sm">{message.message}</p>
          </div>
          <span className="text-xs text-gray-400 mt-1 ml-1">
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    );
  }
} 