import Sidebar from "../common/sideBar.jsx";
import AppShell from "./AppShell.jsx";

function AdminLayout() {
  return <AppShell sidebar={<Sidebar />} />;
}

export default AdminLayout;
