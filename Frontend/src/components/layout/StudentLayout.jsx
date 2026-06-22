import { Outlet } from "react-router-dom";
import StudentSideBar from "../common/studentSideBar.jsx";

function StudentLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <StudentSideBar />

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
