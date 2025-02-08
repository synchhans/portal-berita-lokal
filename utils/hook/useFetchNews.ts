"use client";
import { useQuery } from "@tanstack/react-query";
import { News } from "../../types/News";

interface Location {
  district: string;
  regency: string;
}

const fetchNews = async ({
  limit,
  status,
  category,
  role,
  id,
  sortBy,
}: {
  limit?: number;
  status?: string;
  category?: string;
  role?: string;
  id?: string;
  sortBy?: string;
}): Promise<News[]> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit.toString());
  if (status) queryParams.append("status", status);
  if (category) queryParams.append("category", category);
  if (role) queryParams.append("type", role);
  if (id) queryParams.append("authorId", id);
  if (sortBy) queryParams.append("sortBy", sortBy);

  const response = await fetch(`/api/news?${queryParams}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Error fetching news: ${response.statusText}`);
  }
  const news: News[] = await response.json();
  if (!Array.isArray(news)) throw new Error("Failed to fetch news data");
  return news;
};

const useFetchNews = (
  limit?: number,
  status?: string,
  category?: string,
  role?: string,
  id?: string,
  fetchLocation?: boolean,
  sortBy?: string
) => {
  const {
    data: newsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["news", limit, status, category, role, id, sortBy],
    queryFn: () => fetchNews({ limit, status, category, role, id, sortBy }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { newsData: newsData || [], error, isLoading };
};

export default useFetchNews;
