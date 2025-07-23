// components/CommentSection.jsx
import { useState } from 'react';

export default function CommentSection({ 
  productId, 
  comments, 
  onAddComment, 
  onRemoveComment 
}) {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (!comment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }
    
    const newComment = {
      id: Date.now(),
      text: comment.trim(),
      author: '익명',
      createdAt: new Date().toLocaleString('ko-KR'),
      avatar: '😊'
    };
    
    onAddComment(newComment);
    setComment('');
  };

  return (
    <div className="notion-card p-5">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">댓글 {comments.length}개</h3>
      
      {/* 댓글 입력 */}
      <div className="flex gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm">
          😊
        </div>
        <div className="flex-1 flex gap-2">
          <input 
            value={comment} 
            onChange={e => setComment(e.target.value)} 
            placeholder="댓글을 입력하세요..."
            className="flex-1 notion-input py-2"
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button 
            onClick={handleAddComment}
            className="notion-btn-primary px-4 py-2"
          >
            등록
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">아직 댓글이 없어요</p>
            <p className="text-xs text-gray-400 mt-1">첫 번째 댓글을 남겨보세요!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                {c.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 text-sm">{c.author}</span>
                  <span className="text-xs text-gray-500">{c.createdAt}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{c.text}</p>
              </div>
              <button 
                onClick={() => onRemoveComment(c.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 