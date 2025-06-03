// frontend/src/components/Sidebar.tsx
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-[#EFEDE7] border-r border-[#E0D8CF] flex flex-col items-center py-4 z-50">
      <button onClick={() => navigate("/")} className="mb-4">
        <img
          src="/src/assets/icons/menu.png"
          alt="Menu"
          className="w-6 h-6 transition"
        />
      </button>
      <div className="mt-auto mb-2">
        <div className="w-8 h-8 rounded-full bg-[#E0D8CF] flex items-center justify-center text-[#2D2114] text-[10px] font-medium tracking-wide">
          M
        </div>
      </div>
    </div>
  );
}
