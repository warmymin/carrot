'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, getProduct } from '@/lib/services/products';

export default function DebugOwnershipPage() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('페이지 로드됨');
    addLog(`인증 상태: ${isAuthenticated}`);
    addLog(`사용자 ID: ${user?.id || '없음'}`);
    addLog(`사용자 이메일: ${user?.email || '없음'}`);
    loadProducts();
  }, [user, isAuthenticated]);

  const loadProducts = async () => {
    addLog('상품 목록 로드 시작...');
    try {
      const productsData = await getProducts();
      setProducts(productsData);
      addLog(`상품 ${productsData.length}개 로드됨`);
      
      // 각 상품의 소유권 정보 출력
      productsData.forEach(product => {
        addLog(`상품 ${product.id}: user_id=${product.user_id}, title=${product.title}`);
      });
    } catch (error) {
      addLog(`상품 로드 실패: ${error.message}`);
    }
  };

  const checkProductOwnership = async (productId) => {
    addLog(`상품 ${productId} 소유권 확인 시작...`);
    try {
      const product = await getProduct(productId);
      if (product) {
        setSelectedProduct(product);
        
        const isMyProduct = isAuthenticated && user && product.user_id === user.id;
        
        addLog(`=== 상품 ${productId} 소유권 분석 ===`);
        addLog(`상품 제목: ${product.title}`);
        addLog(`상품 user_id: ${product.user_id}`);
        addLog(`현재 사용자 ID: ${user?.id || '없음'}`);
        addLog(`인증 상태: ${isAuthenticated}`);
        addLog(`소유권 일치: ${isMyProduct}`);
        addLog(`=== 분석 완료 ===`);
      } else {
        addLog(`상품 ${productId}를 찾을 수 없음`);
      }
    } catch (error) {
      addLog(`상품 확인 실패: ${error.message}`);
    }
  };

  const testOwnershipLogic = () => {
    addLog('=== 소유권 로직 테스트 ===');
    addLog(`isAuthenticated: ${isAuthenticated}`);
    addLog(`user?.id: ${user?.id || 'undefined'}`);
    
    products.forEach(product => {
      const isMyProduct = isAuthenticated && user && product.user_id === user.id;
      addLog(`상품 ${product.id}: ${isMyProduct ? '내 상품' : '다른 사람 상품'}`);
    });
    addLog('=== 테스트 완료 ===');
  };

  return (
    <div className="notion-page p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">상품 소유권 디버깅</h1>
      
      {/* 사용자 정보 */}
      <div className="notion-card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">사용자 정보</h2>
        <div className="space-y-2 text-sm">
          <p>인증 상태: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? '로그인됨' : '로그인 안됨'}</span></p>
          <p>사용자 ID: <span className="font-mono">{user?.id || '없음'}</span></p>
          <p>사용자 이메일: <span className="font-mono">{user?.email || '없음'}</span></p>
          <p>사용자 닉네임: <span className="font-mono">{user?.user_metadata?.nickname || '없음'}</span></p>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="notion-card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">상품 목록 ({products.length}개)</h2>
          <div className="space-x-2">
            <button 
              onClick={loadProducts}
              className="notion-btn-secondary text-sm"
            >
              새로고침
            </button>
            <button 
              onClick={testOwnershipLogic}
              className="notion-btn-primary text-sm"
            >
              소유권 테스트
            </button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {products.map((product) => {
            const isMyProduct = isAuthenticated && user && product.user_id === user.id;
            return (
              <div 
                key={product.id} 
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  isMyProduct ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
                onClick={() => checkProductOwnership(product.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-600">ID: {product.id}</p>
                    <p className="text-sm text-gray-600">user_id: {product.user_id || 'null'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      isMyProduct ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isMyProduct ? '내 상품' : '다른 사람 상품'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 상품 상세 정보 */}
      {selectedProduct && (
        <div className="notion-card p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">선택된 상품 상세</h2>
          <div className="space-y-2 text-sm">
            <p>ID: <span className="font-mono">{selectedProduct.id}</span></p>
            <p>제목: <span className="font-mono">{selectedProduct.title}</span></p>
            <p>user_id: <span className="font-mono">{selectedProduct.user_id || 'null'}</span></p>
            <p>user_email: <span className="font-mono">{selectedProduct.user_email || 'null'}</span></p>
            <p>user_nickname: <span className="font-mono">{selectedProduct.user_nickname || 'null'}</span></p>
            <p>생성일: <span className="font-mono">{selectedProduct.created_at}</span></p>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div className="notion-card p-4">
        <h2 className="text-lg font-semibold mb-3">디버그 로그</h2>
        <div className="bg-gray-50 p-3 rounded-lg max-h-80 overflow-y-auto">
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