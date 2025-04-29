export async function fetchTopHeadlines() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data berita");
  }

  const data = await res.json();
  return data.articles;
}
