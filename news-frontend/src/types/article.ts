export interface Article {
  id: number;
  source_id: number;
  category_id: number | null;
  author_id: number | null;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  source: Source;
  category: Category | null;
  author: Author | null;
}

export interface Source {
  id: number;
  name: string;
  api_identifier: string;
  website_url: string | null;
  description: string | null;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  source_id: number | null;
}

export interface PaginatedArticles {
  data: Article[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ArticleFilters {
  source_id?: number;
  category_id?: number;
  from_date?: string;
  to_date?: string;
  keyword?: string;
}
