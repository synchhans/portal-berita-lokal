import { useState } from "react";
import { News } from "../../types/News";
import { useRouter } from "next/navigation";
import { formatForUrl } from "../format/url.format";

interface UseUpdateNewsReturn {
  news: News | null;
  loading: boolean;
  error: string | null;
  fetchNewsById: (id: string) => Promise<void>;
  updateNews: (updatedNews: Partial<News>) => Promise<void>;
}

export default function useUpdateNews(): UseUpdateNewsReturn {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchNewsById = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      const data: News[] = await response.json();
      setNews(data[0]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (updatedNews: Partial<News>): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!updatedNews.title) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    const title_seo = formatForUrl(updatedNews.title);


    const newNews = {
      ...updatedNews,
      title_seo: title_seo,
    };

    try {
      const response = await fetch("/api/news", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNews),
      });

      if (!response.ok) {
        throw new Error(`Failed to update news: ${response.statusText}`);
      }

      const data: News[] = await response.json();
      setNews(data[0]);
      sessionStorage.setItem("alertMessage", "Update successful");
      router.replace("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, fetchNewsById, updateNews };
}
