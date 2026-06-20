import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import DashboardPage from "../pages/admin/dashBoard.jsx";
import UsersPage from "../pages/admin/usersPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage/>} />
    </Routes>
  );
}

export default AppRoutes;