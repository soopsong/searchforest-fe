import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoButton from "../components/icons/LogoButton";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import { setToken } from "../utils/token";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // 쿠키를 포함하여 요청
        body: JSON.stringify({ email: userId, password }),
      });

      const data = await response.json();
      console.log("로그인 응답:", data);

      if (response.ok) {
        setToken(data.token);
        // 로그인 성공 시 사용자 정보를 가져옵니다
        const userResponse = await fetch(`${API_BASE_URL}/api/user`, {
          // credentials: "include", // 쿠키를 포함하여 요청
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("사용자 정보:", userData);
          login(userData); // 사용자 정보로 상태 업데이트
          navigate("/");
        } else {
          console.error("사용자 정보 조회 실패");
          alert("로그인은 성공했으나 사용자 정보를 가져오는데 실패했습니다.");
        }
      } else {
        console.error("로그인 실패:", data);
        alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col items-center justify-center gap-6">
        <LogoButton className="w-1/5 mb-2" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-2 w-1/5"
        >
          <input
            className="w-full border-2 border-primary-300 rounded-full text-lg px-6 py-2 focus:outline-none focus:border-primary-500"
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <input
            className="w-full border-2 border-primary-300 rounded-full text-lg px-6 py-2 focus:outline-none focus:border-primary-500"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex flex-row items-center justify-center gap-2 w-full mt-5">
            <button
              className="w-full border-2 border-primary rounded-full text-primary text-lg px-2 py-2"
              type="button"
              onClick={() => {
                navigate("/signup");
              }}
            >
              회원가입
            </button>
            <button
              className="w-full border-2 bg-primary border-primary text-sand rounded-full text-lg px-2 py-2"
              type="submit"
            >
              로그인
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}
