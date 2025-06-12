import RadialTree from "../components/graphs/RadialTree";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch } from "../hooks/useSearch";
import Header from "../components/Header";
import { useSearchStore } from "../hooks/useStore";
import Layout from "../layout/Layout";
import { GraphStyle } from "../types/tree";
import SCitationTree from "../components/graphs/SCitationTree";
import Papers from "./Papers";

// const testCitationData = {
//   id: "language model",
//   value: 1.0,
//   citation: 30,
//   children: [
//     {
//       id: "transformer",
//       value: 1,
//       citation: 10,
//       children: [
//         { id: "self-attention", value: 0.6, citation: 5 },
//         { id: "multi-head attention", value: 0.5, citation: 3 },
//         { id: "positional encoding", value: 0.4, citation: 2 },
//       ],
//     },
//     {
//       id: "pretrained model",
//       value: 0.6,
//       citation: 15,
//       children: [
//         { id: "bert", value: 0.7, citation: 5 },
//         { id: "gpt", value: 0.6, citation: 3 },
//         { id: "electra", value: 0.4, citation: 2 },
//       ],
//     },
//     {
//       id: "masked language modeling",
//       value: 0.3,
//       citation: 30,
//       children: [
//         { id: "token masking", value: 0.6, citation: 5 },
//         { id: "mlm objective", value: 0.5, citation: 3 },
//         { id: "context prediction", value: 0.5, citation: 2 },
//       ],
//     },
//     {
//       id: "fine-tuning",
//       value: 0.85,
//       citation: 10,
//       children: [
//         { id: "task adaptation", value: 0.1, citation: 5 },
//         { id: "domain transfer", value: 0.9, citation: 10 },
//         { id: "parameter-efficient tuning", value: 0.5, citation: 2 },
//       ],
//     },
//     {
//       id: "causal language modeling",
//       value: 0.85,
//       citation: 10,
//       children: [
//         { id: "autoregressive model", value: 0.6, citation: 5 },
//         { id: "next token prediction", value: 0.5, citation: 3 },
//         { id: "gpt decoder", value: 0.7, citation: 27 },
//       ],
//     },
//   ],
// };

export default function Search() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const location = useLocation();
  const {
    treeData,
    isLoading,
    error,
    search,
    searchByNode,
    searchByHistory,
    hasMultipleResults,
    switchToNextResult,
    switchToPrevResult,
    isFirstResult,
    isLastResult,
  } = useSearch();
  const [graphStyle, setGraphStyle] = useState<GraphStyle>("radial");

  // URL 파라미터 변경 감지 - URL이 변경될 때만 검색 실행
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    const sessionId = location.state?.sessionId;
    const skipSearch = location.state?.skipSearch;

    if (!query) return;

    const decodedQuery = decodeURIComponent(query);
    setSearchQuery(decodedQuery); // Header의 검색창 텍스트 업데이트

    if (skipSearch) {
      // skipSearch를 null로 설정할 때도 navigate 사용
      navigate(location.pathname + location.search, {
        replace: true,
        state: { ...location.state, skipSearch: null },
      });
      return;
    }

    if (sessionId) {
      // 히스토리에서 온 경우
      searchByHistory(decodedQuery, sessionId);
      // sessionId를 null로 설정할 때 navigate 사용
      navigate(location.pathname + location.search, {
        replace: true,
        state: { ...location.state, sessionId: null },
      });
      return;
    }

    search(decodedQuery);
  }, [location.search]);

  const handleNodeClick = async (query: string) => {
    await searchByNode(query);
    // searchByNode(query);
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`, {
      replace: true,
      state: { skipSearch: true },
    });
  };

  // Header의 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full h-full">
        <Header
          variant="search"
          className="sticky top-0 z-50 bg-white"
          onSearch={handleSearch}
        />
        <main className="flex-1 flex flex-col items-center px-10 pb-4 overflow-hidden">
          <div className="flex flex-row items-start justify-between gap-6 w-full h-full">
            {/* 그래프 섹션 */}
            <div className="w-1/2 h-full flex flex-col">
              {isLoading ? (
                <div className="text-lg w-full text-center">검색 중...</div>
              ) : error ? (
                <div className="text-red-500 text-lg w-full text-center">
                  검색 중 오류가 발생했습니다
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-row justify-between pb-2">
                    <div className="flex flex-row gap-2 items-center text-sm">
                      <p>스타일</p>
                      <select
                        className="border px-2 py-1 rounded cursor-pointer"
                        value={graphStyle}
                        onChange={(e) =>
                          setGraphStyle(e.target.value as GraphStyle)
                        }
                      >
                        <option value="radial">기본</option>
                        <option value="citation">유사도 반영</option>
                      </select>
                    </div>

                    {hasMultipleResults && (
                      <div className="flex justify-end">
                        {!isFirstResult && (
                          <button
                            onClick={switchToPrevResult}
                            className="text-sm hover:text-primary px-3 py-1 border rounded hover:bg-gray-100 transition-colors"
                          >
                            이전 키워드 보기
                          </button>
                        )}
                        {!isLastResult && (
                          <button
                            onClick={switchToNextResult}
                            className="text-sm hover:text-primary px-3 py-1 rounded border hover:bg-gray-100 transition-colors"
                          >
                            다른 키워드 보기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {graphStyle === "radial" ? (
                    <RadialTree data={treeData} onNodeClick={handleNodeClick} />
                  ) : (
                    <>
                      {/* <CitationTree
                        data={testCitationData}
                        onNodeClick={handleNodeClick}
                      /> */}
                      <SCitationTree
                        data={treeData}
                        onNodeClick={handleNodeClick}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            {/* 결과 섹션 */}
            <div className="w-1/2 h-full">
              {searchQuery ? (
                <Papers searchQuery={searchQuery} />
              ) : (
                <div className="text-center text-lg mt-10">
                  검색어를 입력하거나 그래프에서 선택하세요.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
