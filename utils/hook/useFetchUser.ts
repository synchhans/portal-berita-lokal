import { useEffect, useState } from "react";
import { User } from "../../types/User";

export type UserFetchResponse = {
  userData: User | null;
  isLoading: boolean;
};

const useFetchUser = (userId: string | undefined): UserFetchResponse => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      setIsLoading(false);
      return; // Exit early if userId is not provided
    }

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/authors?id=${userId}`);

        if (!response.ok) {
          throw new Error(`Error fetching user: ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserData(null); // Handle error by setting userData to null
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { userData, isLoading };
};

export default useFetchUser;
