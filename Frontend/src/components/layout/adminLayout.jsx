import { Outlet } from "react-router-dom";
import Sidebar from "../common/sideBar.jsx";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;