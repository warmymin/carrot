-- Supabase에서 수동으로 실행하세요!

-- 1. products 테이블에 사용자 정보 컬럼 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_nickname TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- 2. 기존 상품들에 기본 사용자 정보 설정
UPDATE products 
SET 
  user_id = '00000000-0000-0000-0000-000000000001',
  user_email = 'default@example.com',
  user_nickname = '기본사용자'
WHERE user_id IS NULL;

-- 3. 컬럼이 제대로 추가되었는지 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position; 