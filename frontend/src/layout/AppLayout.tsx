// frontend/src/components/AppLayout.tsx
import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white pl-16">{children}</main>
    </div>
  );
}
