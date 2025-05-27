import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";
// API 응답 타입 정의
export interface SearchResponse {
  sessionId: string;
  text: string;
  weight: number;
  sublist: Array<{
    text: string;
    weight: number;
    sublist: Array<{
      text: string;
      weight: number;
    }>;
  }>;
}

// RadialTree에 맞는 데이터 구조로 변환하는 타입
interface TreeData {
  id: string;
  value: number;
  children: Array<{
    id: string;
    value: number;
    children: Array<{
      id: string;
      value: number;
    }>;
  }>;
}

interface UseSearchReturn {
  treeData: TreeData;
  isLoading: boolean;
  error: Error | null;
  search: (keyword: string) => Promise<void>;
}

// API 응답을 RadialTree 데이터 구조로 변환하는 함수
const transformToTreeData = (data: SearchResponse): TreeData => {
  return {
    id: data.text,
    value: data.weight,
    children: data.sublist.map((item) => ({
      id: item.text,
      value: item.weight,
      children: item.sublist.map((subItem) => ({
        id: subItem.text,
        value: subItem.weight,
      })),
    })),
  };
};

export const useSearch = (): UseSearchReturn => {
  const [treeData, setTreeData] = useState<TreeData>({
    id: "language model",
    value: 1.0,
    children: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSearchKeyword, setLastSearchKeyword] = useState<string | null>(
    null
  );
  const search = async (keyword: string) => {
    if (isLoading || keyword === lastSearchKeyword) {
      return;
    }
    const token = getToken();
    if (!token) {
      setError(new Error("토큰이 없습니다"));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setLastSearchKeyword(keyword);

      const response = await axios.get<SearchResponse>(
        `${API_BASE_URL}/user/search/keyword?text=${encodeURIComponent(
          keyword
        )}`,
        // { withCredentials: true }
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("응답데이터: ", response.data);
      console.log("응답 구조: ", {
        sessionId: response.data.sessionId,
        text: response.data.text,
        weight: response.data.weight,
        sublist: response.data.sublist,
      });

      // API 응답을 RadialTree 데이터 구조로 변환
      const transformedData = transformToTreeData(response.data);
      setTreeData(transformedData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("검색 중 오류가 발생했습니다")
      );
      console.error("검색 중 오류가 발생했습니다:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    treeData,
    isLoading,
    error,
    search,
  };
};
