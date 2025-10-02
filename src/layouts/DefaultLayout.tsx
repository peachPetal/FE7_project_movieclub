import type { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 전체 Header */}
      <Header />

      {/* Header 아래 영역: 좌측 Sidebar + 메인 콘텐츠 */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
