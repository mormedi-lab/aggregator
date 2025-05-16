import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function AppLayoutWithTopNav({ children }: { children: ReactNode }) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16 ">
          <div className="sticky top-0 z-40 ">
            <TopNav />
          </div>
          <main>{children}</main>
        </div>
      </div>
    );
  }