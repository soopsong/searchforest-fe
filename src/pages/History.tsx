import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header
        variant="search"
        className="sticky top-0 z-50 bg-white"
        onSearch={(query) => {
          setSearchQuery(query); // 검색어 상태 업데이트
          navigate(`/search?q=${encodeURIComponent(query)}`); // URL 변경
        }}
      />
      <main className="flex flex-col items-center justify-center px-10">
        <div className="flex w-full bg-gray-100 rounded-md items-center justify-start py-2 px-4 font-montserrat font-normal text-xl">
          History
        </div>
      </main>
    </div>
  );
}
