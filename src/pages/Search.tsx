import RadialTree from "../components/RadialTree";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// import enter from "../../public/enter.png";
// import results from "../../public/results.png";
// import results2 from "../../public/results2.png";
// import deleteIcon from "../../public/delete.png";
// import LogoButton from "../components/LogoButton";
// import history from "../../public/history.svg";
import { useSearch } from "../hooks/useSearch";
// import { useAuth } from "../hooks/useAuth";
// import logoutIcon from "../../public/logout.svg";
import Header from "../components/Header";
import { useSearchStore } from "../hooks/useStore";
import Layout from "../layout/Layout";
// import History from "./History";

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

export default function Search() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const location = useLocation();
  const { treeData, isLoading, error, search } = useSearch();
  // const { isAuthenticated, user, logout } = useAuth();

  // URL 파라미터 변경 감지 - URL이 변경될 때만 검색 실행
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      const decodedQuery = decodeURIComponent(query);
      search(decodedQuery); // API 호출
    }
  }, [location.search]); // location.search가 변경될 때만 실행

  return (
    <Layout>
      <div className="flex flex-col w-full h-full">
        <Header
          variant="search"
          className="sticky top-0 z-50 bg-white"
          onSearch={(query) => {
            setSearchQuery(query); // 검색어 상태 업데이트
            navigate(`/search?q=${encodeURIComponent(query)}`); // URL 변경
          }}
        />
        <main className="flex-1 flex flex-col items-center justify-center px-10 py-4">
          <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
            {isLoading ? (
              <div className="text-lg">검색 중...</div>
            ) : error ? (
              <div className="text-red-500 text-lg">
                검색 중 오류가 발생했습니다
              </div>
            ) : (
              <div className="w-full h-[calc(100vh-200px)]">
                <RadialTree data={treeData} />
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
