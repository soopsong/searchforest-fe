// import TreeGraph from "../components/TreeGraph";
import BubbleChart from "../components/BubbleChart";
import logo from "../../public/reSearchForest.png";
import RadialTree from "../components/RadialTree";
import { useNavigate, useLocation } from "react-router-dom";
import { Children, useEffect, useState } from "react";
import enter from "../../public/enter.png";
import results from "../../public/results.png";
import results2 from "../../public/results2.png";

const mockBubbleData = [
  { name: "A", value: 10, group: 1 },
  { name: "B", value: 30, group: 2 },
  { name: "C", value: 30, group: 2 },
  { name: "D", value: 25, group: 2 },
  { name: "E", value: 50, group: 3 },
  { name: "F", value: 15, group: 3 },
  { name: "G", value: 19, group: 3 },
];
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

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex flex-row items-center justify-center pt-10 pb-5 w-full gap-5">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="cursor-pointer"
        >
          <img src={logo} alt="logo" className="w-72" />
        </button>
        <div className="flex w-1/2 justify-center border-3 border-primary rounded-full p-2">
          <div className="flex flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="flex-1 border-none rounded-md px-7 text-xl focus:outline-none focus:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
            <button
              className="flex-none cursor-pointer px-3 py-1 mr-2"
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              }}
            >
              <img src={enter} alt="enter" className="w-8" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <RadialTree
          data={searchQuery === "self-attention" ? secondData : radialTreeData}
        />
        <img
          src={searchQuery === "self-attention" ? results2 : results}
          alt="results"
          className="w-[50%]"
        />
      </main>
    </div>
  );
}
