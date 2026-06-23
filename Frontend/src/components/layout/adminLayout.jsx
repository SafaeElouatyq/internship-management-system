import { Outlet } from "react-router-dom";
import Sidebar from "../common/sideBar.jsx";
import { NotificationProvider } from "../../context/NotificationContext.jsx";

function AdminLayout() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-100 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </NotificationProvider>
  );
}

export default AdminLayout;
