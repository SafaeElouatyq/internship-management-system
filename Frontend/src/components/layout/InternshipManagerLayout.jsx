import InternshipManagerSideBar from "../common/internshipManagerSideBar.jsx";
import AppShell from "./AppShell.jsx";

function InternshipManagerLayout() {
  return <AppShell sidebar={<InternshipManagerSideBar />} constrainContent />;
}

export default InternshipManagerLayout;
