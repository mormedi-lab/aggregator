export default function SortBy() {
    return (
      <div className="flex justify-end items-center mb-6">
        <span className="text-sm text-[#666565] mr-2">Sort by</span>
        <select
          className="border border-[#E0D8CF] bg-white px-3 py-[8px] rounded-md text-sm leading-tight text-[#666565] focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
        >
          <option value="activity">Activity</option>
          <option value="name">Name</option>
        </select>
      </div>
    );
  }
  