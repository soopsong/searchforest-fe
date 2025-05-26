import RadialTree from "../components/RadialTree";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import enter from "../../public/enter.png";
import results from "../../public/results.png";
import results2 from "../../public/results2.png";
import deleteIcon from "../../public/delete.png";
import LogoButton from "../components/LogoButton";
import history from "../../public/history.svg";
import { useSearch } from "../hooks/useSearch";
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
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { treeData, isLoading, error, search } = useSearch();

  // 검색 핸들러
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const encodedQuery = encodeURIComponent(searchQuery);
      navigate(`/search?q=${encodedQuery}`);
      search(searchQuery);
    }
  };

  // URL 파라미터 변경 감지
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      const decodedQuery = decodeURIComponent(query);
      setSearchQuery(decodedQuery);
      search(decodedQuery);
    }
  }, [location.search, search]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex flex-row items-center justify-between py-5 px-10 w-full gap-10">
        <div className="flex flex-row gap-5 flex-1">
          <LogoButton className="w-52" />
          <div className="flex flex-1 justify-start border-2 border-primary rounded-full p-2">
            <div className="flex flex-row gap-2 w-full">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="flex-1 border-none rounded-md px-7 text-lg focus:outline-none focus:ring-0 bg-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleSearch();
                  }
                }}
              />
              <button className="flex-none cursor-pointer py-1 px-3 border-r-2 border-primary">
                <img src={deleteIcon} alt="delete" className="w-4" />
              </button>
              {/* <span className="flex items-center text-primary text-xl">|</span> */}
              <button
                className="flex-none cursor-pointer px-1 py-1 mr-5"
                onClick={handleSearch}
              >
                <img src={enter} alt="enter" className="w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center w-[20%] justify-end">
          {/* <button
            className="cursor-pointer rounded-xl text-white bg-primary px-8 py-2"
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인
          </button> */}
          <div>사용자 님</div>
          <button
            className="flex flex-row gap-1 items-center"
            onClick={() => {
              navigate("/history");
            }}
          >
            <img src={history} alt="history" className="w-7" />
            <p className="text-primary font-montserrat font-normal text-xl">
              history
            </p>
          </button>
        </div>
      </header>

      <main className="grid grid-cols-5 items-center justify-center px-10">
        <div className="col-span-2 flex flex-col items-center justify-center gap-4 overflow-y-auto p-4">
          {isLoading ? (
            <div>검색 중...</div>
          ) : error ? (
            <div className="text-red-500">검색 중 오류가 발생했습니다</div>
          ) : (
            <RadialTree data={treeData} />
          )}
        </div>
        <div className="col-span-3 flex flex-col items-center justify-center gap-4 overflow-y-auto">
          <img
            src={searchQuery === "self-attention" ? results2 : results}
            alt="results"
            className="w-full"
          />
        </div>
      </main>
    </div>
  );
}
