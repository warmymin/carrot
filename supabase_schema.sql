-- 상품 테이블 생성
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price INTEGER DEFAULT 0, -- 나눔인 경우 0
  status TEXT,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  distance TEXT DEFAULT '',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  chat_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(product_id BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_location ON products(location);
CREATE INDEX idx_products_price ON products(price);

-- 샘플 데이터 삽입
INSERT INTO products (title, description, category, price, image, images, location, distance, view_count, like_count, chat_count) VALUES
('파세코 창문형 인버터 에어컨 PWA-3250W (연장)', '거의 새것, 케이스 포함. 보호필름 부착상태입니다.', '가전제품', 340000, 'https://images.unsplash.com/photo-1596984559333-71b0c7c9e7a0?w=400&auto=format', '["https://images.unsplash.com/photo-1596984559333-71b0c7c9e7a0?w=400&auto=format"]', '망원제1동', '400m', 45, 6, 0),
('캐리어 벽걸이 에어컨', '18평형, 설치비 별도. 리모컨 포함', '가전제품', 0, 'https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=400&auto=format', '["https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=400&auto=format"]', '양평동4가', '1.8km', 89, 0, 1),
('m1 맥북 a급 급처', '액정 깨짐 없음, 배터리 상태 양호', '디지털기기', 700000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format"]', '양평제2동', '', 67, 1, 1),
('나눔 샤오미 미에어 공기청정기', '정품, 박스 및 충전기 포함', '가전제품', 0, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format"]', '성산동', '900m', 134, 0, 8);
