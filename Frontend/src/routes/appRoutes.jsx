import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage.jsx";
import DashboardPage from "../pages/admin/dashBoard.jsx";
import UsersPage from "../pages/admin/usersPage.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute publicOnly>
            <LoginPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowChangePassword>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
