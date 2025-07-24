-- products 테이블에 사용자 정보 컬럼 추가
DO $$ 
BEGIN
  -- user_id 컬럼 추가 (없는 경우에만)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'products' AND column_name = 'user_id') THEN
    ALTER TABLE products ADD COLUMN user_id TEXT;
  END IF;
  
  -- user_email 컬럼 추가 (없는 경우에만)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'products' AND column_name = 'user_email') THEN
    ALTER TABLE products ADD COLUMN user_email TEXT;
  END IF;
  
  -- user_nickname 컬럼 추가 (없는 경우에만)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'products' AND column_name = 'user_nickname') THEN
    ALTER TABLE products ADD COLUMN user_nickname TEXT;
  END IF;
  
  -- comment_count 컬럼 추가 (없는 경우에만)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'products' AND column_name = 'comment_count') THEN
    ALTER TABLE products ADD COLUMN comment_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 기존 상품들에 기본 사용자 정보 설정 (선택사항)
UPDATE products 
SET 
  user_id = '00000000-0000-0000-0000-000000000001',
  user_email = 'default@example.com',
  user_nickname = '기본사용자'
WHERE user_id IS NULL;

-- products 테이블에 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- RLS 정책 업데이트 (사용자별 접근 권한)
CREATE POLICY "Users can view all products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid()::text = user_id::text); 