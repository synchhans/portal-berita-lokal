import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../types/User";

interface UseAuthReturn {
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  validateInput: (
    field: keyof User | "confirmPassword",
    value: string,
    password?: string
  ) => string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateInput = (
    field: keyof User | "confirmPassword",
    value: string,
    password?: string
  ): string | null => {
    switch (field) {
      case "name":
        if (value.length < 4) return "name must be at least 4 characters";
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return "Invalid email format";
        }
        break;
      case "password":
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (password) {
          if (value !== password) return "Passwords do not match";
        } else {
          return "Password must be provided to confirm.";
        }
        break;
      case "profession":
        if (value && !/^[a-zA-Z\s]+$/.test(value))
          return "Profession should contain only letters and spaces";
        break;
      default:
        break;
    }
    return null;
  };

  const clearError = () => {
    setError(null);
  };

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || "Failed to login");
      }

      router.push("/dashboard?message=login_successful");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || "Failed to register");
      }

      router.push("/login?message=register_successful");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to logout");
      }

      router.push("/login?message=logout_successful");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    validateInput,
    clearError,
  };
};
