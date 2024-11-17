import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const useApproveNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const changeNews = async (itemId: string, status: string) => {
    setLoading(true);
    setError(null);

    const token = Cookies.get("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/news/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsId: itemId,
          status: status,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to approve the news");
      }

      if (status === "approved") {
        sessionStorage.setItem("alertMessage", "Approval successful");
        router.replace("/news/approved");
      } else {
        sessionStorage.setItem("alertMessage", "Cancel successful");
        router.replace("/dashboard");
      }
    } catch (err: any) {
      console.error("Error approving the news:", err);
      setError("Terjadi kesalahan saat menyetujui berita.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, changeNews };
};

export default useApproveNews;
