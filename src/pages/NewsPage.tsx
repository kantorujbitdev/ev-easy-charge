// src/pages/NewsPage.tsx
import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "@/lib/news";
import NewsList from "@/components/NewsList";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchTopHeadlines();
        setArticles(data);
      } catch (error) {
        console.error(error);
      }
    };
    getNews();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Headlines</h1>
      <NewsList articles={articles} />
    </main>
  );
}
