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
    const userDataCookie = Cookies.get("user_data");

    if (userDataCookie) {
      const parsedUserData = JSON.parse(userDataCookie) as UserData;
      const roleFromCookie = parsedUserData.role;

      if (
        roleFromCookie === "admin" ||
        roleFromCookie === "provider" ||
        roleFromCookie === "user"
      ) {
        setRole(roleFromCookie);
        setUserData(parsedUserData);
      } else {
        Cookies.remove("secure_token");
        Cookies.remove("user_data");
        router.push("/login");
        return;
      }
    } else {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  return { role, userData, isLoading };
};

export default useUserData;
