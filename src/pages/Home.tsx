import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* <header className="flex flex-col items-center justify-center p-10 w-full gap-4">
        <h1 className="text-4xl font-bold">reSearchForest</h1>
        <div className="flex gap-4 w-full justify-center">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="border-2 border-green-600 rounded-md p-2 w-1/2"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">
            Enter
          </button>
        </div>
      </header> */}

      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">reSearchForest</h1>
        <div className="flex gap-4 w-full justify-center pb-32">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="border-2 border-green-600 rounded-md p-2 w-[40%] text-xl"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">
            Enter
          </button>
        </div>
      </main>
    </div>
  );
}
