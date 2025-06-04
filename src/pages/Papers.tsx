import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";

interface Paper {
  paperId: string;
  title: string;
  abstractText: string;
  pdfUrl: string;
  citationCount: number;
  authors: string[];
  year: number;
  simScore: number;
}

interface PapersProps {
  searchQuery: string;
}

export default function Papers({ searchQuery }: PapersProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-3">
      <div className="flex w-full bg-gray-100 rounded-md items-center justify-start py-1 px-4 font-normal text-lg">
        "{searchQuery}" 검색 결과
      </div>
      {papers.map((paper) => (
        <a
          key={paper.paperId}
          href={paper.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handlePaperClick(paper)}
          className="block bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold flex-1">
              <span className="text-gray-900 group-hover:text-primary transition-colors">
                {paper.title}
              </span>
            </h3>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500">
                인용수: {paper.citationCount}
              </span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-500">{paper.year}년</span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-primary">
                유사도: {paper.simScore.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mb-1">{paper.authors.join(", ")}</p>
          <p className="text-gray-700 line-clamp-3">{paper.abstractText}</p>
        </a>
      ))}
    </div>
  );
}
