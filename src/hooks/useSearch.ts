import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";
// API 응답 타입 정의
export interface SearchResponse {
  sessionId: string;
  text: string;
  weight: number;
  totalCitation: number;
  sublist: Array<{
    text: string;
    weight: number;
    totalCitation: number;
    sublist: Array<{
      text: string;
      weight: number;
      totalCitation: number;
    }>;
  }>;
}

// RadialTree에 맞는 데이터 구조로 변환하는 타입
interface TreeData {
  id: string;
  value: number;
  citation: number;
  children: Array<{
    id: string;
    value: number;
    citation: number;
    children: Array<{
      id: string;
      value: number;
      citation: number;
    }>;
  }>;
}

interface UseSearchReturn {
  treeData: TreeData;
  isLoading: boolean;
  error: Error | null;
  search: (keyword: string) => Promise<void>;
  searchByNode: (text: string) => Promise<void>;
  searchByHistory: (text: string, sessionId: string) => Promise<void>;
  currentResultIndex: number;
  hasMultipleResults: boolean;
  switchToNextResult: () => void;
  switchToPrevResult: () => void;
  isFirstResult: boolean;
  isLastResult: boolean;
}

// API 응답을 RadialTree 데이터 구조로 변환하는 함수
const transformToTreeData = (data: SearchResponse): TreeData => {
  return {
    id: data.text,
    value: data.weight,
    citation: data.totalCitation,
    children: data.sublist.map((item) => ({
      id: item.text,
      value: item.weight,
      citation: item.totalCitation,
      children: item.sublist.map((subItem) => ({
        id: subItem.text,
        value: subItem.weight,
        citation: subItem.totalCitation,
      })),
    })),
  };
};

export const useSearch = (): UseSearchReturn => {
  const [treeData, setTreeData] = useState<TreeData>({
    id: "language model",
    value: 1.0,
    citation: 10,
    children: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSearchKeyword, setLastSearchKeyword] = useState<string | null>(
    null
  );
  const [rootSessionId, setRootSessionId] = useState<string | null>(null);
  const [searchGraph, setSearchGraph] = useState<SearchResponse[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

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

      const response = await axios.get<SearchResponse[]>(
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
      if (!response.data || response.data.length === 0) {
        setError(new Error("검색 결과가 없습니다"));
        return;
      }
      setLastSearchKeyword(keyword);
      setCurrentResultIndex(0);
      setSearchGraph(response.data);
      setRootSessionId(response.data[0].sessionId);

      const transformedData = transformToTreeData(response.data[0]);

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

      const response = await axios.get<SearchResponse[]>(
        `${API_BASE_URL}/user/search/keyword/${rootSessionId}?text=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentResultIndex(0);
      setSearchGraph(response.data);

      const transformedData = transformToTreeData(response.data[0]);
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

  // 히스토리 검색
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

      const response = await axios.get<SearchResponse[]>(
        `${API_BASE_URL}/user/search/keyword/${sessionId}?text=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentResultIndex(0);
      setSearchGraph(response.data);
      setRootSessionId(sessionId);

      const transformedData = transformToTreeData(response.data[0]);
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

  // 다음 결과로 전환하는 함수
  const switchToNextResult = () => {
    if (searchGraph.length <= 1) return;

    const nextIndex = currentResultIndex + 1;
    if (nextIndex >= searchGraph.length) return;

    setCurrentResultIndex(nextIndex);
    const nextResult = searchGraph[nextIndex];
    setRootSessionId(nextResult.sessionId);
    const transformedData = transformToTreeData(nextResult);
    setTreeData(transformedData);
  };

  // 이전 결과로 전환하는 함수
  const switchToPrevResult = () => {
    if (searchGraph.length <= 1) return;

    const prevIndex = currentResultIndex - 1;
    if (prevIndex < 0) return;

    setCurrentResultIndex(prevIndex);
    const prevResult = searchGraph[prevIndex];
    setRootSessionId(prevResult.sessionId);
    const transformedData = transformToTreeData(prevResult);
    setTreeData(transformedData);
  };

  return {
    treeData,
    isLoading,
    error,
    search,
    searchByNode,
    searchByHistory,
    currentResultIndex,
    hasMultipleResults: searchGraph.length > 1,
    switchToNextResult,
    switchToPrevResult,
    isFirstResult: currentResultIndex === 0,
    isLastResult: currentResultIndex === searchGraph.length - 1,
  };
};
