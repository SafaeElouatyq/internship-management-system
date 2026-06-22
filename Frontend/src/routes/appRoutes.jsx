import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage.jsx";
import DashboardPage from "../pages/admin/dashBoard.jsx";
import UsersPage from "../pages/admin/usersPage.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import StudentInternshipPage from "../pages/student/StudentInternshipPage.jsx";
import InternshipManagerDashboard from "../pages/internshipManager/InternshipManagerDashboard.jsx";
import InternshipManagementPage from "../pages/internshipManager/InternshipManagementPage.jsx";
import InternshipDetailPage from "../pages/internshipManager/InternshipDetailPage.jsx";
import DepartmentHeadPage from "../pages/departmentHead/DepartmentHeadPage.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import StudentLayout from "../components/layout/StudentLayout.jsx";
import InternshipManagerLayout from "../components/layout/InternshipManagerLayout.jsx";
import DepartmentHeadLayout from "../components/layout/DepartmentHeadLayout.jsx";
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

      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="internship" element={<StudentInternshipPage />} />
      </Route>

      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["INTERNSHIP_MANAGER"]}>
            <InternshipManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InternshipManagerDashboard />} />
        <Route path="internships" element={<InternshipManagementPage />} />
        <Route path="internships/:id" element={<InternshipDetailPage />} />
      </Route>

      <Route
        path="/head"
        element={
          <ProtectedRoute roles={["DEPARTMENT_HEAD"]}>
            <DepartmentHeadLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DepartmentHeadPage />} />
        <Route path="assign-supervisors" element={<DepartmentHeadPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
