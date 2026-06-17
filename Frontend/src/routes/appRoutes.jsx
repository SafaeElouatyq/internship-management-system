import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import DashboardPage from "../pages/admin/dashBoard.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default AppRoutes;