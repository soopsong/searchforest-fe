import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";
import { Paper } from "../types/paper";

interface UsePapersResult {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  fetchPapers: () => Promise<void>;
}

export function usePapers(searchQuery: string): UsePapersResult {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error("토큰이 없습니다");

      const response = await axios.get(
        `${API_BASE_URL}/user/search/paper?text=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPapers(response.data);
      console.log("논문 데이터:", response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "논문을 불러오는데 실패했습니다"
      );
      console.error("논문 데이터 로딩 중 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchPapers();
    }
  }, [searchQuery]);

  return { papers, isLoading, error, fetchPapers };
}
