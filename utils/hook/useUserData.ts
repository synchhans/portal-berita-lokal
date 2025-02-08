"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  role: string;
  image: string;
}

const useUserData = () => {
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to get data user");
        }
        const data = await response.json();
        setUserData(data.user);
        setRole(data.user.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return { role, userData, isLoading };
};

export default useUserData;
