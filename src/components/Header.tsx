import { useNavigate, useLocation } from "react-router-dom";
import history from "../../public/history.svg";
import logoutIcon from "../../public/logout.svg";
import LogoButton from "./LogoButton";
import { useSearchStore } from "../hooks/useStore";
import { useAuthStore } from "../hooks/useStore";
import { useAuth } from "../hooks/useAuth";
import enter from "../../public/enter.png";

interface HeaderProps {
  variant?: "home" | "search";
  className?: string;
  onSearch?: (query: string) => void;
}

export default function Header({
  variant = "home",
  className = "",
  onSearch,
}: HeaderProps) {
  const navigate = useNavigate();
  // const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { isAuthenticated, user, logout } = useAuth();
  // const isHistoryPage = location.pathname === "/history";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchQuery(searchQuery); // 검색어 상태 업데이트
      onSearch?.(searchQuery); // 부모 컴포넌트의 검색 핸들러 호출
    }
  };

  const renderAuthSection = () => (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-xl">{user?.username} 님</div>
      <button
        className="flex flex-row gap-1 items-center"
        onClick={() => navigate("/history")}
      >
        <img src={history} alt="history" className="w-7" />
        <p className="text-primary font-montserrat font-normal text-xl">
          history
        </p>
      </button>
      <button className="cursor-pointer" onClick={logout}>
        <img src={logoutIcon} alt="logout" className="w-6" />
      </button>
    </div>
  );

  const renderLoginButton = () => (
    <button
      className="cursor-pointer rounded-xl text-white bg-primary px-8 py-2"
      onClick={() => navigate("/login")}
    >
      로그인
    </button>
  );

  if (variant === "search") {
    return (
      <header
        className={`flex flex-row items-center justify-between py-5 px-10 w-full gap-10 ${className}`}
      >
        <div className="flex flex-row gap-5 flex-1">
          <LogoButton className="w-52" />

          <div className="flex flex-1 justify-start border-2 border-primary rounded-full p-2">
            <div className="flex flex-row gap-2 w-full">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="flex-1 border-none rounded-md px-7 text-lg focus:outline-none focus:ring-0 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleSearch();
                  }
                }}
              />
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
          {isAuthenticated ? renderAuthSection() : renderLoginButton()}
        </div>
      </header>
    );
  }

  return (
    <header
      className={`flex flex-row justify-end items-center mt-6 mr-8 ${className}`}
    >
      {isAuthenticated ? renderAuthSection() : renderLoginButton()}
    </header>
  );
}
