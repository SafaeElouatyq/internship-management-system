import Sidebar from "../common/sideBar.jsx";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;