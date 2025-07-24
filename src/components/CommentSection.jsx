'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getComments, createComment, updateComment, deleteComment, subscribeToComments, unsubscribeFromComments } from '@/lib/services/comments';

export default function CommentSection({ productId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 댓글 로드
  useEffect(() => {
    const loadComments = async () => {
      console.log('🔄 Loading comments for product:', productId);
      setIsLoading(true);
      try {
        const commentsData = await getComments(productId);
        console.log('📋 Loaded comments:', commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error('❌ Failed to load comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadComments();
    }
  }, [productId]);

  // 실시간 댓글 구독
  useEffect(() => {
    if (!productId) return;

    const subscription = subscribeToComments(productId, (payload) => {
      console.log('🔄 Real-time comment update:', payload);
      
      if (payload.eventType === 'INSERT') {
        setComments(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setComments(prev => prev.map(comment => 
          comment.id === payload.new.id ? payload.new : comment
        ));
      } else if (payload.eventType === 'DELETE') {
        setComments(prev => prev.filter(comment => comment.id !== payload.old.id));
      }
    });

    return () => {
      unsubscribeFromComments(subscription);
    };
  }, [productId]);

  // 댓글 작성
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting comment submission...')
    console.log('🔐 Auth status:', { isAuthenticated, user: user?.id })
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    console.log('📝 Submitting comment:', { productId, content: newComment, user: user?.id })

    setIsSubmitting(true);

    try {
      const result = await createComment(productId, newComment, user);
      
      console.log('📊 Comment submission result:', result)
      
      if (result.success) {
        setNewComment('');
        console.log('✅ Comment submitted successfully');
        // 성공 메시지 표시
        alert('댓글이 성공적으로 작성되었습니다!');
      } else {
        console.error('❌ Comment submission failed:', result.error);
        alert('댓글 작성에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('💥 Comment submission error:', error);
      alert('댓글 작성 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // 댓글 수정 제출
  const handleSubmitEdit = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateComment(commentId, editContent, user);
      
      if (result.success) {
        setEditingComment(null);
        setEditContent('');
        console.log('✅ Comment updated successfully');
      } else {
        alert('댓글 수정에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('Comment update error:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await deleteComment(commentId, user);
      
      if (result.success) {
        console.log('✅ Comment deleted successfully');
      } else {
        alert('댓글 삭제에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('Comment deletion error:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="notion-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">댓글</h3>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-slate-600 mt-2">댓글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-card p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        댓글 ({comments.length})
      </h3>

      {/* 댓글 작성 폼 */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 notion-input"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="notion-btn-primary px-6"
            >
              {isSubmitting ? '작성 중...' : '작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-slate-600 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="notion-btn-primary text-sm"
          >
            로그인하기
          </button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>아직 댓글이 없습니다.</p>
            <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {comment.user_nickname?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">
                        {comment.user_nickname || '익명'}
                      </span>
                      <span className="text-sm text-slate-500 ml-2">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="ml-10">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full notion-input mb-2"
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitEdit(comment.id)}
                          disabled={isSubmitting}
                          className="notion-btn-primary text-sm px-3 py-1"
                        >
                          {isSubmitting ? '수정 중...' : '저장'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                          className="notion-btn-secondary text-sm px-3 py-1"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-10">
                      <p className="text-slate-700">{comment.content}</p>
                      
                      {/* 본인 댓글인 경우 수정/삭제 버튼 */}
                      {isAuthenticated && user?.id === comment.user_id && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 