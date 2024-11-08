import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { News } from "../../types/News";
import { User } from "../../types/User";

interface UseFetchDetailNewsResult {
  newsDetail: News | null;
  moreNewsByAuthor: News[];
  author: User | null;
  isLoading: boolean;
}

export const useFetchDetailNews = (
  title: string,
  authorNewsLimit: number
): UseFetchDetailNewsResult => {
  const [newsDetail, setNewsDetail] = useState<News | null>(null);
  const [moreNewsByAuthor, setMoreNewsByAuthor] = useState<News[]>([]);
  const [author, setAuthor] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`/api/news?title=${title}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const newsItem = data[0];
          setNewsDetail(newsItem);

          const authorResponse = await fetch(
            `/api/authors?id=${newsItem.author}`
          );
          const authorData = await authorResponse.json();
          setAuthor(authorData);

          const moreNewsResponse = await fetch(
            `/api/news?authorId=${newsItem.author}&limit=${authorNewsLimit}`
          );
          const authorNewsData = await moreNewsResponse.json();

          if (authorNewsData && authorNewsData.length > 0) {
            setMoreNewsByAuthor(authorNewsData);
          } else {
            setMoreNewsByAuthor([]);
          }
        } else {
          router.push("/not-found");
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        router.push("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [title, authorNewsLimit, router]);

  return { newsDetail, moreNewsByAuthor, author, isLoading };
};
