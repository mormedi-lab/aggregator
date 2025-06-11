import {IndustryPillProps } from "../types"; 

export default function IndustryPill({ label }: IndustryPillProps) {
  return (
    <span className="text-xs px-2 py-1 rounded-full border border-[#E0D8CF] bg-[#FAF9F5] text-[#666565] font-medium uppercase">
      {label}
    </span>
  );
}
