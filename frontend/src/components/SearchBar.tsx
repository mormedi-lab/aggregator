import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666565]" />
      <input
        type="text"
        placeholder="Search projects..."
        className="w-full pl-10 pr-4 py-[10px] border border-[#E0D8CF] rounded-lg text-sm leading-[1.2rem] bg-white placeholder-[#666565] focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
      />
    </div>
  );
}
