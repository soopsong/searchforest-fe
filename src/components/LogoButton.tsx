import { useNavigate } from "react-router-dom";
import logo from "../../public/reSearchForest.png";

interface LogoButtonProps {
  className?: string;
}

export default function LogoButton({ className = "w-1/5" }: LogoButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate("/");
      }}
      className={`cursor-pointer ${className}`}
    >
      <img src={logo} alt="logo" className="w-full" />
    </button>
  );
}
