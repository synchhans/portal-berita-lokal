import { useEffect, useState } from "react";

interface AuthStatus {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStatus = (): AuthStatus => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to authenticate");
        }

        const data = await response.json();
        const userData = data.user;

        if (
          userData.role &&
          ["user", "admin", "provider"].includes(userData.role)
        ) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid user role");
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, loading, error };
};
