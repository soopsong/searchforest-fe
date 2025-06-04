import RadialTree from "../components/RadialTree";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import Header from "../components/Header";
import { useSearchStore } from "../hooks/useStore";
import Layout from "../layout/Layout";
import Papers from "./Papers";

const radialTreeData = {
  id: "language model",
  value: 1.0,
  children: [
    {
      id: "transformer",
      value: 0.8,
      children: [
        { id: "self-attention", value: 0.6 },
        { id: "multi-head attention", value: 0.5 },
        { id: "positional encoding", value: 0.4 },
      ],
    },
    {
      id: "pretrained model",
      value: 0.9,
      children: [
        { id: "bert", value: 0.7 },
        { id: "gpt", value: 0.6 },
        { id: "electra", value: 0.4 },
      ],
    },
    {
      id: "masked language modeling",
      value: 0.85,
      children: [
        { id: "token masking", value: 0.6 },
        { id: "mlm objective", value: 0.5 },
        { id: "context prediction", value: 0.5 },
      ],
    },
    {
      id: "fine-tuning",
      value: 0.85,
      children: [
        { id: "task adaptation", value: 0.6 },
        { id: "domain transfer", value: 0.5 },
        { id: "parameter-efficient tuning", value: 0.5 },
      ],
    },
    {
      id: "causal language modeling",
      value: 0.85,
      children: [
        { id: "autoregressive model", value: 0.6 },
        { id: "next token prediction", value: 0.5 },
        { id: "gpt decoder", value: 0.7 },
      ],
    },
  ],
};

const secondData = {
  id: "self-attention",
  value: 1.0,
  children: [
    {
      id: "multi-head attention",
      value: 0.8,
      children: [
        { id: "projection layers", value: 0.5 },
        { id: "head concatenation", value: 0.4 },
        { id: "parallel attention heads", value: 0.6 },
      ],
    },
    {
      id: "scaled dot-product attention",
      value: 0.8,
      children: [
        { id: "query-key dot product", value: 0.6 },
        { id: "scaling factor", value: 0.5 },
        { id: "softmax weighting", value: 0.4 },
      ],
    },
    {
      id: "positional encoding",
      value: 0.8,
      children: [
        { id: "sine cosine embedding", value: 0.6 },
        { id: "sequence order injection", value: 0.5 },
        { id: "absolute position bias", value: 0.4 },
      ],
    },
    {
      id: "attention mechanism",
      value: 0.8,
      children: [
        { id: "alignment score", value: 0.6 },
        { id: "attention weights", value: 0.5 },
        { id: "context vector", value: 0.4 },
      ],
    },
    {
      id: "transformer architecture",
      value: 0.8,
      children: [
        { id: "encoder-decoder", value: 0.6 },
        { id: "layer normalization", value: 0.5 },
        { id: "residual connection", value: 0.4 },
      ],
    },
  ],
};

// type SearchType = "initial" | "node" | "history";

export default function Search() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const location = useLocation();
  const { treeData, isLoading, error, search, searchByNode, searchByHistory } =
    useSearch();

  // URL 파라미터 변경 감지 - URL이 변경될 때만 검색 실행
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    const sessionId = location.state?.sessionId;

    if (query) {
      const decodedQuery = decodeURIComponent(query);
      setSearchQuery(decodedQuery); // Header의 검색창 텍스트 업데이트

      if (sessionId) {
        // 히스토리에서 온 경우
        searchByHistory(decodedQuery, sessionId);
        location.state.sessionId = null;
      } else {
        search(decodedQuery);
      }
    }
  }, [location.search]);

  const handleNodeClick = (query: string) => {
    searchByNode(query);
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
        <main className="flex-1 flex flex-col items-center px-10 py-4">
          <div className="flex flex-row items-start justify-between gap-6 w-full h-full">
            {/* 그래프 섹션 */}
            <div className="w-1/2 h-full">
              {isLoading ? (
                <div className="text-lg w-full text-center">검색 중...</div>
              ) : error ? (
                <div className="text-red-500 text-lg w-full text-center">
                  검색 중 오류가 발생했습니다
                </div>
              ) : (
                <div className="w-full h-full">
                  <RadialTree data={treeData} onNodeClick={handleNodeClick} />
                </div>
              )}
            </div>
            {/* 결과 섹션 */}
            <div className="w-1/2 h-full overflow-y-auto">
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
