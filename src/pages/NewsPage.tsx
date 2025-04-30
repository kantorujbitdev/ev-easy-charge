// src/pages/NewsPage.tsx
import { useEffect, useState } from "react";
import { fetchTopHeadlines } from "@/lib/news";
import NewsList from "@/components/NewsList";

export default function NewsPage() {
  console.log("NewsPage rendered");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  console.log("Memuat data berita...");

  const getNews = async () => {
    try {
      const data = await fetchTopHeadlines();
      setArticles(data);
    } catch (err: any) {
      console.error("Terjadi error:", err); // ← log ini bantu debug
      setError("Gagal memuat berita.");
    } finally {
      console.log("Set loading = false");
      setLoading(false);
    }
  };
  console.log("NewsPage component is mounted");
  getNews();
}, []);

  return (
    <main>
            <h1 className="text-2xl font-bold mb-4">Top Headlines</h1>
      <NewsList articles={articles} />

      {loading && (
        <p className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-2">
          Memuat berita...
        </p>
      )}
      {error && (
        <p className="bg-red-100 border border-red-400 text-red-700 p-2">
          {error}
        </p>
      )}

    </main>
  );
}

