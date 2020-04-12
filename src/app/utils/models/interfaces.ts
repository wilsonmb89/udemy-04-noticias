interface ResponseNewsApi {
  status: string;
  totalResults: number;
  articles: Article[];
}

interface Article {
  source: Source;
  author?: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  isFavorite?: boolean;
}

interface Source {
  id?: string;
  name: string;
}
