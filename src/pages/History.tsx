import LogoButton from "../components/LogoButton";
import deleteIcon from "../../public/delete.png";
import enter from "../../public/enter.png";
import history from "../../public/history.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              <button className="flex-none cursor-pointer py-1 px-3 border-r-2 border-primary">
                <img src={deleteIcon} alt="delete" className="w-4" />
              </button>
              {/* <span className="flex items-center text-primary text-xl">|</span> */}
              <button
                className="flex-none cursor-pointer px-1 py-1 mr-5"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }}
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
      <main className="flex flex-col items-center justify-center px-10">
        <div className="flex w-full bg-gray-100 rounded-md items-center justify-start py-2 px-4 font-montserrat font-normal text-xl">
          History
        </div>
      </main>
    </div>
  );
}
