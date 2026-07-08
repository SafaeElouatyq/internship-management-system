import SupervisorSideBar from "../common/supervisorSideBar.jsx";
import AppShell from "./AppShell.jsx";

function SupervisorLayout() {
  return <AppShell sidebar={<SupervisorSideBar />} constrainContent />;
}

export default SupervisorLayout;
