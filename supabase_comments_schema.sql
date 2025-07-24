-- 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_email TEXT,
  user_nickname TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블에 RLS 정책 설정
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 댓글을 읽을 수 있음
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- 인증된 사용자만 댓글을 작성할 수 있음
CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 댓글 작성자만 수정/삭제할 수 있음
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 댓글 수를 자동으로 업데이트하는 함수
CREATE OR REPLACE FUNCTION update_product_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products 
    SET comment_count = comment_count - 1 
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 추가/삭제 시 상품 댓글 수 자동 업데이트 트리거
CREATE TRIGGER update_product_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_product_comment_count();

-- 샘플 댓글 데이터 (선택사항)
INSERT INTO comments (product_id, user_id, user_email, user_nickname, content) VALUES
  (1, '00000000-0000-0000-0000-000000000001', 'hong@example.com', '홍길동', '정말 좋은 상품이네요! 가격도 합리적입니다.'),
  (1, '00000000-0000-0000-0000-000000000002', 'kim@example.com', '김철수', '배송은 언제 가능한가요?'),
  (2, '00000000-0000-0000-0000-000000000001', 'hong@example.com', '홍길동', '사진과 실제 상품이 동일한가요?'),
  (3, '00000000-0000-0000-0000-000000000003', 'lee@example.com', '이영희', '직거래 가능한 지역이 어디인가요?');

-- 댓글 테이블에 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id); 