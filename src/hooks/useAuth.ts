import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/constants";

interface User {
  username: string;
  email: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user`, {
      credentials: "include", // 쿠키를 포함하여 요청
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        console.log("User API response:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // 로그아웃 API 호출
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include", // 쿠키를 포함하여 요청
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
}
