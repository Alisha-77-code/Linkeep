export type SiteCategory =
  | '전체'
  | '오늘의 수업'
  | '국어'
  | '수학'
  | '사회'
  | '과학'
  | '기타';

export type SiteStatus = 'public' | 'hidden' | 'locked';

export type ImageType = 'emoji' | 'image';

export interface Site {
  id: string;
  name: string;
  url: string;
  category: Exclude<SiteCategory, '전체'>;
  image_url: string | null;
  image_type: ImageType;
  emoji: string;
  status: SiteStatus;
  memo: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SiteInput = Omit<Site, 'id' | 'created_at' | 'updated_at'>;

export interface SiteFilterOptions {
  search: string;
  category: SiteCategory;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
