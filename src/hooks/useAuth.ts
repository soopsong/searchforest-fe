import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/constants";
import { getToken, removeToken } from "../utils/token";
import { useAuthStore } from "../hooks/useStore";
import { useSearchStore } from "../hooks/useStore";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
}

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const { clearSearchQuery } = useSearchStore();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/user`, {
      // credentials: "include", // 쿠키를 포함하여 요청
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
          removeToken();
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
        setUser(null);
        removeToken();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    clearAuth();
    clearSearchQuery();
    navigate("/login");
  };

  // 로그인 상태가 변경될 때마다 store 업데이트
  useEffect(() => {
    setAuth(isAuthenticated, user);
  }, [isAuthenticated, user, setAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
}
