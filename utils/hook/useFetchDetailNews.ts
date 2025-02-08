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
        const response = await fetch(
          `/api/authors?title=${encodeURIComponent(
            title
          )}&authorNewsLimit=${authorNewsLimit}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news detail");
        }
        const data = await response.json();

        if (!data.newsDetail || !data.author) {
          throw new Error("Invalid response data");
        }

        setNewsDetail(data.newsDetail);
        setAuthor(data.author);
        setMoreNewsByAuthor(data.moreNewsByAuthor || []);
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
