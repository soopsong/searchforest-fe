import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { getToken } from "../utils/token";
import { Paper } from "../types/paper";

export function usePaperClick() {
  const handlePaperClick = async (paper: Paper) => {
    try {
      const token = getToken();
      if (!token) throw new Error("토큰이 없습니다");

      await axios.post(
        `${API_BASE_URL}/user/paper?paperId=${paper.paperId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("논문 접근 기록 완료");
    } catch (err) {
      console.error("논문 접근 중 오류:", err);
    }
  };

  return { handlePaperClick };
}
