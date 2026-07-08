import StudentSideBar from "../common/studentSideBar.jsx";
import AppShell from "./AppShell.jsx";

function StudentLayout() {
  return <AppShell sidebar={<StudentSideBar />} />;
}

export default StudentLayout;
