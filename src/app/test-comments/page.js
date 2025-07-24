'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getComments, createComment } from '@/lib/services/comments';
import { supabase } from '@/lib/supabase';

export default function TestCommentsPage() {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // 테스트용 상품 ID (실제 존재하는 상품 ID 사용)
  const testProductId = 1;

  useEffect(() => {
    addLog('페이지 로드됨');
    addLog(`인증 상태: ${isAuthenticated}`);
    addLog(`사용자: ${user?.id || '없음'}`);
    loadComments();
  }, []);

  const loadComments = async () => {
    addLog('댓글 로드 시작...');
    setIsLoading(true);
    try {
      const commentsData = await getComments(testProductId);
      setComments(commentsData);
      addLog(`댓글 ${commentsData.length}개 로드됨`);
    } catch (error) {
      addLog(`댓글 로드 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addLog('로그인이 필요함');
      return;
    }

    if (!newComment.trim()) {
      addLog('댓글 내용이 비어있음');
      return;
    }

    addLog('댓글 작성 시작...');
    setIsLoading(true);

    try {
      const result = await createComment(testProductId, newComment, user);
      
      if (result.success) {
        setNewComment('');
        addLog('댓글 작성 성공!');
        loadComments(); // 댓글 목록 새로고침
      } else {
        addLog(`댓글 작성 실패: ${result.error}`);
      }
    } catch (error) {
      addLog(`댓글 작성 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    addLog('Supabase 연결 테스트 시작...');
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('count')
        .limit(1);
      
      if (error) {
        addLog(`Supabase 연결 실패: ${error.message}`);
      } else {
        addLog('Supabase 연결 성공!');
      }
    } catch (error) {
      addLog(`Supabase 연결 오류: ${error.message}`);
    }
  };

  return (
    <div className="notion-page p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">댓글 시스템 테스트</h1>
      
      {/* 상태 정보 */}
      <div className="notion-card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">상태 정보</h2>
        <div className="space-y-2 text-sm">
          <p>인증 상태: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? '로그인됨' : '로그인 안됨'}</span></p>
          <p>사용자 ID: <span className="font-mono">{user?.id || '없음'}</span></p>
          <p>사용자 이메일: <span className="font-mono">{user?.email || '없음'}</span></p>
          <p>테스트 상품 ID: <span className="font-mono">{testProductId}</span></p>
        </div>
      </div>

      {/* Supabase 연결 테스트 */}
      <div className="notion-card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Supabase 연결 테스트</h2>
        <button 
          onClick={testSupabaseConnection}
          className="notion-btn-primary"
        >
          연결 테스트
        </button>
      </div>

      {/* 댓글 작성 */}
      <div className="notion-card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">댓글 작성</h2>
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="notion-input w-full"
            disabled={!isAuthenticated || isLoading}
          />
          <button
            type="submit"
            disabled={!isAuthenticated || isLoading || !newComment.trim()}
            className="notion-btn-primary"
          >
            {isLoading ? '작성 중...' : '댓글 작성'}
          </button>
        </form>
      </div>

      {/* 댓글 목록 */}
      <div className="notion-card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">댓글 목록 ({comments.length}개)</h2>
          <button 
            onClick={loadComments}
            className="notion-btn-secondary text-sm"
            disabled={isLoading}
          >
            새로고침
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-slate-600 mt-2">로딩 중...</p>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-slate-500 text-center py-4">댓글이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{comment.user_nickname || '익명'}</span>
                  <span className="text-sm text-slate-500">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 로그 */}
      <div className="notion-card p-4">
        <h2 className="text-lg font-semibold mb-3">디버그 로그</h2>
        <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-slate-500">로그가 없습니다.</p>
          ) : (
            <div className="space-y-1 text-sm font-mono">
              {logs.map((log, index) => (
                <div key={index} className="text-slate-700">{log}</div>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={() => setLogs([])}
          className="notion-btn-secondary text-sm mt-2"
        >
          로그 지우기
        </button>
      </div>
    </div>
  );
} 