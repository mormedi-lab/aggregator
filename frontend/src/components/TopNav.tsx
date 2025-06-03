import { Link, useLocation, useParams } from "react-router-dom";

const TopNav = () => {
  const location = useLocation();
  const { id: projectId } = useParams();

  const isActive = (path: string) =>
    location.pathname.endsWith(path)
      ? "border-b-[3px] border-[#FF5400] text-[#0F1122] font-semibold"
      : "text-gray-500 hover:text-[#FF5400]";

  return (
    <div className="sticky top-0 z-50 bg-gray-100">
      <div className="flex space-x-8 px-6 py-3 text-sm">
        <Link to={`/project/${projectId}/sources`} className={`${isActive("sources")} pb-1`}>
          Curation
        </Link>
        <Link to={`/project/${projectId}/library`} className={`${isActive("library")} pb-1`}>
          Library
        </Link>
      </div>
    </div>
  );
};

export default TopNav;
