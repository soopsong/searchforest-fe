import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoButton from "../components/icons/LogoButton";
import { API_BASE_URL } from "../config/constants";

export default function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          // userEmail,
          email: userId,
          password,
        }),
      });

      if (response.ok) {
        alert("회원가입에 성공했습니다.");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("회원가입 중 오류가 발생했습니다:", error);
      alert("회원가입 중 오류가 발생했습니다.");
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
            placeholder="이름"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
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
            onChange={(e) => {
              setPassword(e.target.value);
              // setPasswordMatch(e.target.value === confirmPassword);
            }}
            required
          />
          <input
            className={`w-full border-2 border-primary-300 rounded-full text-lg px-6 py-2 focus:outline-none focus:border-primary-500`}
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMatch(password === e.target.value);
            }}
            required
          />
          {!passwordMatch && confirmPassword && (
            <p className="text-red-500 text-sm w-full text-left ml-10">
              비밀번호가 일치하지 않습니다.
            </p>
          )}

          <div className="flex flex-row items-center justify-center gap-2 w-full mt-5">
            {/* <button
              className="w-full border-2 border-primary rounded-full text-primary text-lg px-2 py-2"
              type="button"
              onClick={() => {
                navigate("/signup");
              }}
            >
              회원가입
            </button> */}
            <button
              className="w-full border-2 bg-primary border-primary text-sand rounded-full text-lg px-2 py-2"
              type="submit"
            >
              회원가입
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}
