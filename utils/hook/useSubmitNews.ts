import { useState } from "react";
// import Cookies from "js-cookie";

interface Location {
  lat: number;
  long: number;
  district: string;
  regency: string;
  country: string;
}

interface FormData {
  title: string;
  content: string;
  image: string;
  location: Location;
  category: string;
  tags: string[];
}

interface FormDataUpdate {
  title: string;
  content: string;
  image: string;
  category: string;
}

const useSubmitNews = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const submitNews = async (formData: FormData) => {
    setLoading(true);

    try {
      // const token = Cookies.get("token");

      // if (!token) {
      //   throw new Error("Authorization token is missing.");
      // }

      const response = await fetch("/api/news/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("alertMessage", "News created successfully!");
        return result;
      } else {
        sessionStorage.setItem(
          "alertMessage",
          result.error || "An error occurred"
        );
        throw new Error(result.error || "An error occurred");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting news:", error);
        sessionStorage.setItem("alertMessage", error.message || "");
      } else {
        console.error("Unknown error submitting news:", error);
        sessionStorage.setItem("alertMessage", "An unknown error occurred.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (formData: FormDataUpdate) => {
    setLoading(true);

    try {
      // const token = Cookies.get("token");

      // if (!token) {
      //   throw new Error("Authorization token is missing.");
      // }

      const response = await fetch("/api/news/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("alertMessage", "News created successfully!");
        return result;
      } else {
        sessionStorage.setItem(
          "alertMessage",
          result.error || "An error occurred"
        );
        throw new Error(result.error || "An error occurred");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting news:", error);
        sessionStorage.setItem("alertMessage", error.message || "");
      } else {
        console.error("Unknown error submitting news:", error);
        sessionStorage.setItem("alertMessage", "An unknown error occurred.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitNews,
    loading,
  };
};

export default useSubmitNews;
