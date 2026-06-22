import { Outlet } from "react-router-dom";
import InternshipManagerSideBar from "../common/internshipManagerSideBar.jsx";

function InternshipManagerLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <InternshipManagerSideBar />

      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default InternshipManagerLayout;
