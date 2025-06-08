import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";
import UpIcon from "../components/icons/UpIcon";
import DownIcon from "../components/icons/DownIcon";
import { useMemo } from "react";

interface Paper {
  paperId: string;
  title: string;
  summary: string;
  abstractText: string;
  pdfUrl: string;
  citationCount: number;
  authors: string[];
  year: number;
  simScore: number;
  field: string;
}

interface PapersProps {
  searchQuery: string;
}

export default function Papers({ searchQuery }: PapersProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(
    new Set()
  );
  const [sortKey, setSortKey] = useState<"simScore" | "citationCount" | "year">(
    "simScore"
  );
  const allYears = papers.map((p) => p.year);
  const minAvailableYear = Math.min(...allYears);
  const maxAvailableYear = Math.max(...allYears);

  const [yearRange, setYearRange] = useState<[number, number]>([
    minAvailableYear,
    maxAvailableYear,
  ]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        if (!token) {
          throw new Error("토큰이 없습니다");
        }

        const response = await axios.get(
          `${API_BASE_URL}/user/search/paper?text=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

    if (searchQuery) {
      fetchPapers();
    }
  }, [searchQuery]);

  const sortedPapers = useMemo(() => {
    return [...papers].sort((a, b) => {
      switch (sortKey) {
        case "citationCount":
          return b.citationCount - a.citationCount;
        case "year":
          return b.year - a.year;
        case "simScore":
        default:
          return b.simScore - a.simScore;
      }
    });
  }, [papers, sortKey]);

  const filteredPapers = useMemo(() => {
    return sortedPapers.filter(
      (p) => p.year >= yearRange[0] && p.year <= yearRange[1]
    );
  }, [sortedPapers, yearRange]);

  const handlePaperClick = async (paper: Paper) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("토큰이 없습니다");
      }

      // API 호출을 백그라운드에서 실행
      axios
        .post(
          `${API_BASE_URL}/user/paper?paperId=${paper.paperId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => {
          console.error("논문 접근 기록 중 오류:", err);
        });
      console.log("논문 접근 기록 완료");
    } catch (err) {
      console.error("논문 접근 중 오류:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">논문을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (papers.length === 0) {
    return <div className="text-center py-4">검색된 논문이 없습니다</div>;
  }

  const toggleAbstract = (paperId: string) => {
    setExpandedAbstracts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) {
        newSet.delete(paperId);
      } else {
        newSet.add(paperId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex w-full bg-gray-100 rounded-md items-center justify-between py-1 px-4 font-normal text-lg mb-3">
        <div>"{searchQuery}" 검색 결과</div>
        <div>
          <span className="text-sm">정렬 기준</span>
          <select
            className="text-sm bg-white border border-gray-300 rounded px-2 py-0.5 ml-2"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
          >
            <option value="simScore">유사도</option>
            <option value="citationCount">인용수</option>
            <option value="year">연도</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <span>{yearRange[0]}</span>
        <input
          type="range"
          min={minAvailableYear}
          max={maxAvailableYear}
          value={yearRange[0]}
          onChange={(e) => setYearRange([+e.target.value, yearRange[1]])}
        />
        <input
          type="range"
          min={minAvailableYear}
          max={maxAvailableYear}
          value={yearRange[1]}
          onChange={(e) => setYearRange([yearRange[0], +e.target.value])}
        />
        <span>{yearRange[1]}</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {filteredPapers.map((paper) => (
          <div
            key={paper.paperId}
            className="block bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePaperClick(paper)}
                className="flex-1"
              >
                <h3 className="text-lg font-medium">
                  <span className="text-gray-900 hover:text-primary hover:underline transition-colors duration-100">
                    {paper.title}
                  </span>
                </h3>
              </a>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-500">
                  인용수: {paper.citationCount}
                </span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-500">{paper.field}</span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-500">{paper.year}년</span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-primary">
                  유사도: {paper.simScore.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-1">{paper.authors.join(", ")}</p>
            <div>
              <p className="text-gray-700">{paper.summary}</p>
              {paper.abstractText && (
                <>
                  {expandedAbstracts.has(paper.paperId) && (
                    <p className="text-gray-700 mt-2 text-sm">
                      {paper.abstractText}
                    </p>
                  )}
                  <button
                    onClick={() => toggleAbstract(paper.paperId)}
                    className="text-sm text-primary-500 hover:font-medium flex items-center gap-1 mt-1"
                  >
                    {expandedAbstracts.has(paper.paperId)
                      ? "초록 접기"
                      : "초록 보기"}
                    {expandedAbstracts.has(paper.paperId) ? (
                      <UpIcon className="w-3 h-3 text-primary-500" />
                    ) : (
                      <DownIcon className="w-3 h-3 text-primary-500" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
