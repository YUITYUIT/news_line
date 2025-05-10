// GNews APIから「AI」に関する日本語ニュースを5件取得する関数

import { NewsArticle } from './types';

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
}

interface GNewsResponse {
  articles: GNewsArticle[];
}

export async function fetchNews(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=ja&max=5&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json() as GNewsResponse;

    if (!response.ok) {
      throw new Error('ニュースの取得に失敗しました');
    }

    return data.articles.map((article: GNewsArticle) => ({
      title: article.title,
      content: article.content || article.description,
      url: article.url,
      imageUrl: article.image,
    }));
  } catch (error) {
    console.error('ニュース取得エラー:', error);
    return [];
  }
}
  