"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
      const userDataCookie = Cookies.get("user_data");

      if (!userDataCookie) {
        const res = await fetch("/dashboard", { method: "GET" });
        if (res.ok) {
          const refreshedUserData = Cookies.get("user_data");
          if (refreshedUserData) {
            const parsedData = JSON.parse(refreshedUserData) as UserData;
            setUserData(parsedData);
            setRole(parsedData.role);
          } else {
            Cookies.remove("secure_token");
            Cookies.remove("token");
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } else {
        const parsedData = JSON.parse(userDataCookie) as UserData;
        setUserData(parsedData);
        setRole(parsedData.role);
      }

      setIsLoading(false);
    };

    fetchUserData();
  }, [router]);

  return { role, userData, isLoading };
};

export default useUserData;
