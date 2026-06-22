import { Outlet } from "react-router-dom";
import SupervisorSideBar from "../common/supervisorSideBar.jsx";

function SupervisorLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SupervisorSideBar />

      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SupervisorLayout;
