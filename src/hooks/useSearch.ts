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
  searchByNode: (text: string) => Promise<void>;
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

export const useSearch = (): UseSearchReturn & {
  searchByHistory: (text: string, sessionId: string) => Promise<void>;
} => {
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
  // 루트 검색어와 세션 ID 매핑을 위한 상태
  const [rootSessionId, setRootSessionId] = useState<string | null>(null);

  // 초기 검색 (루트 검색어로 검색)
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("응답데이터: ", response.data);

      // 루트 검색어의 세션 ID 저장
      setRootSessionId(response.data.sessionId);

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

  // 노드 선택 시 검색
  const searchByNode = async (text: string) => {
    if (isLoading) return;

    const token = getToken();
    if (!token) {
      setError(new Error("토큰이 없습니다"));
      return;
    }

    if (!rootSessionId) {
      setError(new Error("루트 검색 세션이 없습니다"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<SearchResponse>(
        `${API_BASE_URL}/user/search/keyword/${rootSessionId}?text=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transformedData = transformToTreeData(response.data);
      setTreeData(transformedData);
      console.log("노드 검색 응답데이터: ", response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("노드 검색 중 오류가 발생했습니다")
      );
      console.error("노드 검색 중 오류가 발생했습니다:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 히스토리 검색을 위한 새로운 함수
  const searchByHistory = async (text: string, sessionId: string) => {
    if (isLoading) return;

    const token = getToken();
    if (!token) {
      setError(new Error("토큰이 없습니다"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // 히스토리의 sessionId를 rootSessionId로 설정
      setRootSessionId(sessionId);

      const response = await axios.get<SearchResponse>(
        `${API_BASE_URL}/user/search/keyword/${sessionId}?text=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("히스토리 검색 응답데이터: ", response.data);
      const transformedData = transformToTreeData(response.data);
      setTreeData(transformedData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("히스토리 검색 중 오류가 발생했습니다")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    treeData,
    isLoading,
    error,
    search,
    searchByNode,
    searchByHistory, // 새로운 함수 추가
  };
};
