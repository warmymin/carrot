// utils/notifications.js

// 알림 타입 정의
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  CHAT: 'chat',
  SYSTEM: 'system',
  WISHLIST: 'wishlist'
};

// 알림 생성
export const createNotification = (type, data) => {
  const notification = {
    id: Date.now() + Math.random(),
    type,
    isRead: false,
    time: '방금 전',
    createdAt: new Date().toISOString(),
    ...getNotificationContent(type, data)
  };

  // 기존 알림 가져오기
  const existingNotifications = JSON.parse(localStorage.getItem('carrotNotifications') || '[]');
  
  // 새 알림을 맨 앞에 추가
  const updatedNotifications = [notification, ...existingNotifications].slice(0, 50); // 최대 50개
  
  // 로컬 스토리지에 저장
  localStorage.setItem('carrotNotifications', JSON.stringify(updatedNotifications));
  
  return notification;
};

// 알림 내용 생성
const getNotificationContent = (type, data) => {
  switch (type) {
    case NOTIFICATION_TYPES.LIKE:
      return {
        title: '내 상품을 좋아해요',
        message: `"${data.productTitle}"에 관심있어 하는 분이 계시네요!`,
        avatar: '❤️'
      };
    
    case NOTIFICATION_TYPES.COMMENT:
      return {
        title: '댓글이 달렸어요',
        message: `${data.author}님이 "${data.productTitle}"에 댓글을 남겼어요`,
        avatar: '💬'
      };
    
    case NOTIFICATION_TYPES.CHAT:
      return {
        title: '채팅 메시지',
        message: `"${data.productTitle}"에 대한 문의가 도착했어요. 빠른 답변으로 좋은 거래하세요!`,
        avatar: '💌'
      };
    
    case NOTIFICATION_TYPES.SYSTEM:
      return {
        title: '당근 알림',
        message: data.message || '새로운 소식이 있어요',
        avatar: '🥕'
      };
    
    case NOTIFICATION_TYPES.WISHLIST:
      return {
        title: '관심상품 가격 변동',
        message: `관심 등록한 "${data.productTitle}"의 가격이 ${data.changeType === 'down' ? '내려갔어요!' : '변경되었어요!'}`,
        avatar: '💰'
      };
    
    default:
      return {
        title: '알림',
        message: data.message || '새로운 알림이 있어요',
        avatar: '🔔'
      };
  }
};

// 좋아요 알림 생성
export const createLikeNotification = (productTitle) => {
  return createNotification(NOTIFICATION_TYPES.LIKE, { productTitle });
};

// 댓글 알림 생성
export const createCommentNotification = (productTitle, author = '익명') => {
  return createNotification(NOTIFICATION_TYPES.COMMENT, { productTitle, author });
};

// 채팅 알림 생성
export const createChatNotification = (productTitle) => {
  return createNotification(NOTIFICATION_TYPES.CHAT, { productTitle });
};

// 시스템 알림 생성
export const createSystemNotification = (message) => {
  return createNotification(NOTIFICATION_TYPES.SYSTEM, { message });
};

// 관심상품 알림 생성
export const createWishlistNotification = (productTitle, changeType = 'down') => {
  return createNotification(NOTIFICATION_TYPES.WISHLIST, { productTitle, changeType });
};

// 읽지 않은 알림 개수 가져오기
export const getUnreadNotificationCount = () => {
  const notifications = JSON.parse(localStorage.getItem('carrotNotifications') || '[]');
  return notifications.filter(n => !n.isRead).length;
};

// 시간 포맷팅
export const formatNotificationTime = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;
  
  return created.toLocaleDateString('ko-KR');
}; 