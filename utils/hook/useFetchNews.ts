"use client";
import { useState, useEffect } from "react";
import { News } from "../../types/News";

interface Location {
  district: string;
  regency: string;
}

const useFetchNews = (
  limit?: number,
  status?: string,
  category?: string,
  role?: string,
  id?: string,
  fetchLocation?: boolean
) => {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const location: Location | null = fetchLocation
        //   ? JSON.parse(localStorage.getItem("lokasi") || "null")
        //   : null;

        const baseUrl = `/api/news`;
        const statusQuery = status ? `status=${status}` : "";
        const roleQuery = role ? `type=${role}` : "";
        const idQuery = id ? `authorId=${id}` : "";

        const queryParams = [statusQuery, roleQuery, idQuery]
          .filter(Boolean)
          .join("&");

        const fetchNewsWithDeduplication = async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`Error fetching news: ${response.statusText}`);
          }
          const news: News[] = await response.json();
          if (!Array.isArray(news))
            throw new Error("Failed to fetch news data");
          return news;
        };

        let combinedNews: News[] = [];

        // if (location) {
        //   const districtUrl = `${baseUrl}?${queryParams}&district=${
        //     location.district
        //   }${
        //     location.regency ? `&regency=${location.regency}` : ""
        //   }&limit=1000&skip=0`;
        //   const districtNews = await fetchNewsWithDeduplication(districtUrl);
        //   combinedNews = combinedNews.concat(districtNews);
        // }

        // if (combinedNews.length === 0 && location?.regency) {
        //   const regencyUrl = `${baseUrl}?${queryParams}&regency=${location.regency}&limit=1000&skip=0`;
        //   const regencyNews = await fetchNewsWithDeduplication(regencyUrl);
        //   combinedNews = combinedNews.concat(regencyNews);
        // }

        if (combinedNews.length === 0) {
          const otherUrl = `${baseUrl}?${queryParams}&limit=${
            limit || 1000
          }&skip=0`;
          const otherNews = await fetchNewsWithDeduplication(otherUrl);
          combinedNews = combinedNews.concat(otherNews);
        }

        const uniqueCombinedNews = Array.from(
          new Set(combinedNews.map((news) => news._id))
        ).map((id) => combinedNews.find((news) => news._id === id)!);

        if (category) {
          const categoryUrl = `${baseUrl}?${queryParams}&category=${category}`;
          const categoryNews = await fetchNewsWithDeduplication(categoryUrl);
          setNewsData(categoryNews);
        } else {
          if (uniqueCombinedNews.length === 0) {
            const latestNewsUrl = `${baseUrl}?${queryParams}&limit=${
              limit || 1000
            }`;
            const latestNews = await fetchNewsWithDeduplication(latestNewsUrl);
            setNewsData(latestNews.slice(0, limit || latestNews.length));
          } else {
            setNewsData(
              uniqueCombinedNews.slice(0, limit || uniqueCombinedNews.length)
            );
          }
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [limit, status, category, role, id]);

  return { newsData, error, isLoading };
};

export default useFetchNews;
