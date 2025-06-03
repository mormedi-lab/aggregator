interface ResearchSpaceCardProps {
    space: {
      id: string;
      query: string;
      search_type: string;
      created_at: string;
    };
    onClick: (id: string) => void;
  }
  
  export default function ResearchSpaceCard({ space, onClick }: ResearchSpaceCardProps) {
    return (
      <div
        onClick={() => onClick(space.id)}
        className="cursor-pointer rounded-md p-4 border border-[#E0D8CF] bg-[#FAF9F5] hover:bg-white transition-shadow hover:shadow-sm"
      >
        <div className="font-normal text-[#2D2114] text-base line-clamp-1">
          {space.query || "[Untitled Research Space]"}
        </div>
        <div className="text-xs text-[#827F7F] mt-1">{space.search_type}</div>
      </div>
    );
  }
  