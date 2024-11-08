import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
    const checkAuth = () => {
      try {
        const cookieData = Cookies.get("user_data");
        if (cookieData) {
          const parsedData = JSON.parse(cookieData);
          const userRoleFromCookie = parsedData.role;

          if (
            userRoleFromCookie &&
            ["user", "admin", "provider"].includes(userRoleFromCookie)
          ) {
            setUser({ role: userRoleFromCookie } as AuthenticatedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        setError("Failed to parse user data");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, loading, error };
};
