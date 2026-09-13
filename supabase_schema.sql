-- ====================================================================
-- LINKEEP (링킵) - Supabase Database & Storage Setup SQL
-- ====================================================================

-- 1. Create 'sites' Table
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('오늘의 수업', '국어', '수학', '사회', '과학', '기타')),
    image_url TEXT,
    image_type TEXT NOT NULL DEFAULT 'emoji' CHECK (image_type IN ('emoji', 'image')),
    emoji TEXT DEFAULT '🌐',
    status TEXT NOT NULL DEFAULT 'public' CHECK (status IN ('public', 'hidden', 'locked')),
    memo TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Indexes for fast filtering and ordering
CREATE INDEX IF NOT EXISTS idx_sites_category ON public.sites(category);
CREATE INDEX IF NOT EXISTS idx_sites_status ON public.sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_created_at ON public.sites(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select for all records (or customize as needed)
CREATE POLICY "Allow public read access" 
ON public.sites FOR SELECT 
USING (true);

-- Allow insert/update/delete (with anon key in simple classroom mode)
CREATE POLICY "Allow anon insert" 
ON public.sites FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anon update" 
ON public.sites FOR UPDATE 
USING (true);

CREATE POLICY "Allow anon delete" 
ON public.sites FOR DELETE 
USING (true);

-- 4. Enable Supabase Realtime for the 'sites' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sites;

-- 5. Create Storage Bucket for site images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Access site-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-images');

CREATE POLICY "Allow Upload to site-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow Delete from site-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'site-images');

-- 6. Initial Seed Data for Elementary Classrooms
INSERT INTO public.sites (name, url, category, image_type, emoji, status, memo, sort_order) VALUES
('디지털교과서', 'https://dt.edunet.net', '오늘의 수업', 'emoji', '🏫', 'public', '전 학년 디지털교과서 뷰어 및 멀티미디어 자료', 1),
('EBS 초등', 'https://primary.ebs.co.kr', '오늘의 수업', 'emoji', '⭐', 'public', 'EBS 만점왕 및 초등 교과 영상 시청', 2),
('엔트리 (Entry)', 'https://playentry.org', '오늘의 수업', 'emoji', '💻', 'public', '초등 블록 코딩 실습 사이트', 3),
('국립국어원 표준국어대사전', 'https://stdict.korean.go.kr', '국어', 'emoji', '📖', 'public', '낱말 뜻 찾기 및 맞춤법 검색용', 4),
('국립어린이청소년도서관', 'https://www.nlcy.go.kr', '국어', 'emoji', '📚', 'public', '전자책 및 어린이 추천도서 읽기', 5),
('똑똑! 수학탐험대', 'https://www.toctocmath.kr', '수학', 'emoji', '🔢', 'public', '교육부 초등 수학 인공지능 맞춤형 학습', 6),
('지오지브라 (GeoGebra)', 'https://www.geogebra.org', '수학', 'emoji', '📐', 'public', '도형 및 각도 조작 시각화 도구', 7),
('구글 어스 (Google Earth)', 'https://earth.google.com', '사회', 'emoji', '🗺️', 'public', '세계 여러 나라 지형 및 지구 3D 탐험', 8),
('국토정보플랫폼 지도', 'https://map.ngii.go.kr', '사회', 'emoji', '🧭', 'public', '우리 고장 및 우리나라 백지도와 지리 정보', 9),
('사이언스올 (ScienceAll)', 'https://www.scienceall.com', '과학', 'emoji', '🔬', 'public', '과학문화 포털 및 멀티미디어 실험 자료', 10),
('기상청 날씨누리', 'https://www.weather.go.kr', '과학', 'emoji', '🌤️', 'public', '기온, 강수량, 위성 레이더 영상 관찰', 11),
('캔바 (Canva) 디자인', 'https://www.canva.com', '기타', 'emoji', '🎨', 'public', '수업 결과물 포스터 및 카드뉴스 제작', 12),
('패들렛 (Padlet)', 'https://padlet.com', '기타', 'emoji', '📌', 'public', '학생 의견 모으기 및 토론 게시판', 13),
('띵커벨 (ThinkerBell)', 'https://www.tkbell.co.kr', '기타', 'emoji', '🎯', 'public', '수업 퀴즈 및 형성평가 활동', 14)
ON CONFLICT DO NOTHING;
