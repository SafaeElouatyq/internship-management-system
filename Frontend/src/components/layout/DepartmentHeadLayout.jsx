import { Outlet } from "react-router-dom";
import DepartmentHeadSideBar from "../common/departmentHeadSideBar.jsx";
import { NotificationProvider } from "../../context/NotificationContext.jsx";

function DepartmentHeadLayout() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-100 flex">
        <DepartmentHeadSideBar />
        <main className="flex-1 p-8 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}

export default DepartmentHeadLayout;
