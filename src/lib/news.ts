export async function fetchTopHeadlines() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) throw new Error("API key tidak tersedia");

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
    );

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Gagal mengambil data: ${res.status} - ${message}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.articles)) {
      throw new Error("Data tidak sesuai format yang diharapkan");
    }

    return data.articles;
  } catch (err) {
    console.error("Error saat fetch berita:", err);
    throw err; // lempar lagi agar bisa ditangkap di komponen
  }
}
