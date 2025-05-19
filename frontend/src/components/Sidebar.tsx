// frontend/src/components/Sidebar.tsx
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-[#D8D8D8] border-r border-gray-200 flex flex-col items-center py-4 z-50">
      <button onClick={() => navigate("/")} className="mb-4">
        <Home className="w-6 h-6 text-gray-700 hover:text-black" />
      </button>
      {/* Add more icons here in the future */}
      <div className="mt-auto mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
          M
        </div>
      </div>
    </div>
  );
}
