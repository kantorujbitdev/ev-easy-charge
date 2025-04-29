interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
  }
  
  export default function NewsList({ articles }: { articles: Article[] }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <div key={index} className="border rounded shadow p-4 bg-white">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-lg font-bold mt-2">{article.title}</h2>
            <p className="text-sm text-gray-600">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm"
            >
              Baca Selengkapnya →
            </a>
          </div>
        ))}
      </div>
    );
  }
  