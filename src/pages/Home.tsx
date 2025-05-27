import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import enter from "../../public/enter.png";
import LogoButton from "../components/LogoButton";
import { useAuth } from "../hooks/useAuth";
// import history from "../../public/history.svg";
// import logoutIcon from "../../public/logout.svg";
import Header from "../components/Header";
import { useSearchStore } from "../hooks/useStore";

export default function Home() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchStore();
  // const { isAuthenticated, user, logout } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen w-full">
        {/* <header className="flex flex-row justify-end items-center mt-6 mr-8">
          {isAuthenticated ? (
            <div className="flex flex-row gap-4 items-center">
              <div className="text-xl">{user?.username} 님</div>
              <button className="flex flex-row gap-1 items-center">
                <img src={history} alt="history" className="w-7" />
                <p className="text-primary font-montserrat font-normal text-xl">
                  history
                </p>
              </button>
              <button className="cursor-pointer" onClick={logout}>
                <img src={logoutIcon} alt="logout" className="w-6" />
              </button>
            </div>
          ) : (
            <button
              className="cursor-pointer rounded-xl text-white bg-primary px-8 py-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </button>
          )}
        </header> */}
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
