import { fetchNews } from "@/lib/fetchNews";
import { summarize } from "@/lib/summarize";
import { NewsArticle } from "@/lib/types";

export default async function Home() {
  const news = await fetchNews("AI");
  const newsWithSummaries = await Promise.all(
    news.map(async (article: NewsArticle) => ({
      ...article,
      summary: await summarize(article.content, 100),
    }))
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">AI関連ニュース</h1>
        
        {newsWithSummaries.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            ニュースが見つかりませんでした。
          </div>
        ) : (
          <div className="space-y-6">
            {newsWithSummaries.map((article: NewsArticle, index: number) => (
              <article 
                key={index} 
                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    {article.title}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <div className="text-sm text-gray-500">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-600 inline-flex items-center"
                  >
                    続きを読む
                    <svg 
                      className="w-4 h-4 ml-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
