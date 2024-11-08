import { useState } from "react";

interface News {
  _id: string;
  title: string;
  title_seo: string;
  image: string;
  updatedAt: string;
  category: string;
  location: {
    district: string;
    regency: string;
  };
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (event: any) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    fetchSearchResults(query);
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  };

  const fetchSearchResults = async (query: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/news/search?title=${query.replace(/\s+/g, "+")}`
      );
      if (!response.ok) {
        throw new Error("Error fetching search results");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    handleSearchChange,
    handleSearchSubmit,
    searchResults,
    isLoading,
  };
};
