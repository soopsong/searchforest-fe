import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { API_BASE_URL } from "../config/constants";

interface KeywordHistory {
  sessionId: string;
  rootMessage: string;
  subMessages: string[];
}

interface PaperHistory {
  id: string;
  searchedAt: string;
  title: string;
  url: string;
  userId: number;
}

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [keywordHistory, setKeywordHistory] = useState<KeywordHistory[]>([]);
  const [paperHistory, setPaperHistory] = useState<PaperHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const keywordResponse = await fetch(
          `${API_BASE_URL}/user/history/keyword`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // 논문 검색 히스토리 가져오기
        const paperResponse = await fetch(
          `${API_BASE_URL}/user/history/paper`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!keywordResponse.ok) {
          throw new Error("키워드 히스토리를 불러오는데 실패했습니다");
        }
        if (!paperResponse.ok) {
          throw new Error("논문 히스토리를 불러오는데 실패했습니다");
        }
        const keywordData = await keywordResponse.json();
        setKeywordHistory(keywordData);
        console.log("키워드 히스토리 데이터: ", keywordData);

        const paperData = await paperResponse.json();
        setPaperHistory(paperData);
        console.log("논문 히스토리 데이터: ", paperData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleHistoryItemClick = (subMessage: string, sessionId: string) => {
    try {
      setIsLoading(true);
      navigate(`/search?q=${encodeURIComponent(subMessage)}`, {
        state: { sessionId },
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "검색 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaperHistoryClick = (paperId: string) => {
    try {
      // navigate(`/paper/${paperId}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "논문 페이지로 이동 중 오류가 발생했습니다"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header
        variant="search"
        className="sticky top-0 z-50 bg-white"
        onSearch={(query) => {
          setSearchQuery(query);
          navigate(`/search?q=${encodeURIComponent(query)}`);
        }}
      />
      <main className="flex flex-1 px-10 gap-4">
        {/* 키워드 검색 히스토리 섹션 */}
        <section className="flex-1 flex flex-col">
          <div className="flex w-full bg-gray-100 rounded-md items-center justify-start py-2 px-4 font-montserrat font-normal text-xl">
            Keyword History
          </div>
          <div className="flex-1 overflow-y-auto mt-4">
            {isLoading && <div className="mt-4">로딩 중...</div>}
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {!isLoading && !error && (
              <div className="w-full">
                {keywordHistory.length === 0 ? (
                  <div className="text-center text-gray-500">
                    검색 기록이 없습니다
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {keywordHistory.map((item) => (
                      <li
                        key={item.sessionId}
                        className="p-4 bg-white rounded-md shadow hover:bg-gray-50"
                      >
                        <div className="font-medium mb-2 text-lg">
                          {item.rootMessage}
                        </div>
                        <ul className="space-y-1 pl-4">
                          {item.subMessages.map((subMessage, index) => (
                            <li
                              key={`${item.sessionId}-${index}`}
                              className="text-md text-gray-600 cursor-pointer hover:text-primary transition-colors hover:font-semibold"
                              onClick={() =>
                                handleHistoryItemClick(
                                  subMessage,
                                  item.sessionId
                                )
                              }
                            >
                              {subMessage}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
        {/* 논문 검색 히스토리 섹션 */}
        <section className="flex-1 flex flex-col">
          <div className="flex w-full bg-gray-100 rounded-md items-center justify-start py-2 px-4 font-montserrat font-normal text-xl">
            Paper History
          </div>
          <div className="flex-1 overflow-y-auto mt-4">
            {isLoading && <div className="mt-4">로딩 중...</div>}
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {!isLoading && !error && (
              <div className="w-full">
                {paperHistory.length === 0 ? (
                  <div className="text-center text-gray-500">
                    논문 검색 기록이 없습니다
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {paperHistory.map((item) => (
                      <li
                        key={item.id}
                        className="p-4 bg-white rounded-md shadow hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium mb-2 text-lg group-hover:text-primary transition-colors block"
                        >
                          {item.title}
                        </a>
                        <div className="text-sm text-gray-500">
                          {new Date(item.searchedAt).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
