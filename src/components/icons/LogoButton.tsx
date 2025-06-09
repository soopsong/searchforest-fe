import { useNavigate } from "react-router-dom";
import logo from "../../../public/reSearchForest.png";
import { useSearchStore } from "../../hooks/useStore";

interface LogoButtonProps {
  className?: string;
}

export default function LogoButton({ className = "w-1/5" }: LogoButtonProps) {
  const navigate = useNavigate();
  const { clearSearchQuery } = useSearchStore();

  return (
    <button
      onClick={() => {
        clearSearchQuery();
        navigate("/");
      }}
      className={`cursor-pointer ${className}`}
    >
      <img src={logo} alt="logo" className="w-full" />
    </button>
  );
}
