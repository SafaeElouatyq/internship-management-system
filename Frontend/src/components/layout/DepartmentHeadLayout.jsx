import DepartmentHeadSideBar from "../common/departmentHeadSideBar.jsx";
import AppShell from "./AppShell.jsx";

function DepartmentHeadLayout() {
  return <AppShell sidebar={<DepartmentHeadSideBar />} constrainContent />;
}

export default DepartmentHeadLayout;
