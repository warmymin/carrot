// components/NotificationModal.jsx
import { useState, useEffect } from 'react';
import { formatNotificationTime } from '@/utils/notifications';

export default function NotificationModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  // 알림 데이터 생성 및 로컬 스토리지 관리
  useEffect(() => {
    if (isOpen) {
      // 기본 알림 데이터
      const defaultNotifications = [
        {
          id: 1,
          type: 'like',
          title: '내 상품을 좋아해요',
          message: 'iPhone 14 Pro에 관심있어 하는 분이 계시네요!',
          time: '2분 전',
          isRead: false,
          avatar: '❤️'
        },
        {
          id: 2,
          type: 'comment',
          title: '댓글이 달렸어요',
          message: '익명님이 "MacBook Air M2"에 댓글을 남겼어요',
          time: '10분 전',
          isRead: false,
          avatar: '💬'
        },
        {
          id: 3,
          type: 'chat',
          title: '채팅 메시지',
          message: '상품 문의가 도착했어요. 빠른 답변으로 좋은 거래하세요!',
          time: '1시간 전',
          isRead: true,
          avatar: '💌'
        },
        {
          id: 4,
          type: 'system',
          title: '당근 알림',
          message: '응암동 근처에 새로운 상품이 등록되었어요',
          time: '3시간 전',
          isRead: true,
          avatar: '🥕'
        },
        {
          id: 5,
          type: 'wishlist',
          title: '관심상품 가격 변동',
          message: '관심 등록한 "건조대"의 가격이 내려갔어요!',
          time: '어제',
          isRead: true,
          avatar: '💰'
        }
      ];

      // 로컬 스토리지에서 알림 데이터 불러오기
      const savedNotifications = JSON.parse(localStorage.getItem('carrotNotifications') || JSON.stringify(defaultNotifications));
      setNotifications(savedNotifications);
    }
  }, [isOpen]);

  // 알림 읽음 처리
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('carrotNotifications', JSON.stringify(updatedNotifications));
  };

  // 알림 삭제
  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('carrotNotifications', JSON.stringify(updatedNotifications));
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('carrotNotifications', JSON.stringify(updatedNotifications));
  };

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">알림</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                모두 읽음
              </button>
            )}
            <button
              onClick={onClose}
              className="notion-icon-btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 10v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">알림이 없어요</h3>
              <p className="text-gray-600 text-center text-sm">
                새로운 알림이 오면 여기에 표시돼요
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* 아바타 */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                        {notification.avatar}
                      </div>
                    </div>

                    {/* 알림 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-semibold ${
                            !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            !notification.isRead ? 'text-slate-700' : 'text-slate-500'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {notification.createdAt ? formatNotificationTime(notification.createdAt) : notification.time}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 font-medium hover:text-blue-700"
                              >
                                읽음 처리
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* 읽지 않은 알림 표시 */}
                      {!notification.isRead && (
                        <div className="absolute left-2 top-6 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 notion-btn-secondary py-3"
            >
              닫기
            </button>
            <button
              onClick={() => {
                // 알림 설정 페이지로 이동하는 기능 추가 가능
                alert('알림 설정 기능은 추후 추가 예정입니다.');
              }}
              className="flex-1 notion-btn-primary py-3"
            >
              알림 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 