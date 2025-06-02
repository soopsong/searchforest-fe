import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import enter from "../../public/enter.png";
import LogoButton from "../components/LogoButton";
import { useAuth } from "../hooks/useAuth";

import Header from "../components/Header";
import { useSearchStore } from "../hooks/useStore";

export default function Home() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen w-full">
        <Header variant="home" />
        <main className="flex-1 flex flex-col items-center justify-center gap-8">
          <LogoButton />
          <div className="flex w-1/2 justify-center mb-32 border-3 border-primary rounded-full p-2">
            <div className="flex flex-row gap-2 w-full">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="flex-1 border-none rounded-md px-7 text-xl focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <img src={enter} alt="enter" className="w-7" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
