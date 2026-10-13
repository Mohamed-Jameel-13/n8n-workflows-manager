import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar.jsx";
import { TopBar } from "./TopBar.jsx";

export function Layout() {
  return (
    <div className="landing-bg flex h-screen overflow-hidden text-white" style={{ backgroundColor: 'transparent' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'transparent' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
