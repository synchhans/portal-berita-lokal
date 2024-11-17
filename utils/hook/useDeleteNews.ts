import { useState } from "react";
import Cookies from "js-cookie";

const useDeleteNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNews = async (newsId: string) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to delete the news");
      }

      sessionStorage.setItem("alertMessage", "News deleted successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Error deleting the news:", err);
      setError("Terjadi kesalahan saat menghapus berita.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteNews };
};

export default useDeleteNews;
