import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage.jsx";
import DashboardPage from "../pages/admin/dashBoard.jsx";
import UsersPage from "../pages/admin/usersPage.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import StudentInternshipPage from "../pages/student/StudentInternshipPage.jsx";
import StudentReportsPage from "../pages/student/StudentReportsPage.jsx";
import StudentMeetingsPage from "../pages/student/StudentMeetingsPage.jsx";
import StudentDocumentsPage from "../pages/student/StudentDocumentsPage.jsx";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard.jsx";
import SupervisorReportsPage from "../pages/supervisor/SupervisorReportsPage.jsx";
import SupervisorMeetingsPage from "../pages/supervisor/SupervisorMeetingsPage.jsx";
import SupervisorSettingsPage from "../pages/supervisor/SupervisorSettingsPage.jsx";
import InternshipManagerDashboard from "../pages/internshipManager/InternshipManagerDashboard.jsx";
import InternshipManagementPage from "../pages/internshipManager/InternshipManagementPage.jsx";
import InternshipDetailPage from "../pages/internshipManager/InternshipDetailPage.jsx";
import InternshipManagerDocumentsPage from "../pages/internshipManager/InternshipManagerDocumentsPage.jsx";
import DepartmentHeadDashboard from "../pages/departmentHead/DepartmentHeadDashboard.jsx";
import DepartmentHeadInternshipsPage from "../pages/departmentHead/DepartmentHeadInternshipsPage.jsx";
import DepartmentHeadSupervisorsPage from "../pages/departmentHead/DepartmentHeadSupervisorsPage.jsx";
import DepartmentHeadNotificationsPage from "../pages/departmentHead/DepartmentHeadNotificationsPage.jsx";
import DepartmentHeadSettingsPage from "../pages/departmentHead/DepartmentHeadSettingsPage.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import StudentLayout from "../components/layout/StudentLayout.jsx";
import InternshipManagerLayout from "../components/layout/InternshipManagerLayout.jsx";
import DepartmentHeadLayout from "../components/layout/DepartmentHeadLayout.jsx";
import SupervisorLayout from "../components/layout/SupervisorLayout.jsx";
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
        <Route path="reports" element={<StudentReportsPage />} />
        <Route path="meetings" element={<StudentMeetingsPage />} />
        <Route path="documents" element={<StudentDocumentsPage />} />
      </Route>

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute roles={["SUPERVISOR"]}>
            <SupervisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SupervisorDashboard />} />
        <Route path="reports" element={<SupervisorReportsPage />} />
        <Route path="meetings" element={<SupervisorMeetingsPage />} />
        <Route path="settings" element={<SupervisorSettingsPage />} />
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
        <Route path="documents" element={<InternshipManagerDocumentsPage />} />
      </Route>

      <Route
        path="/department-head"
        element={
          <ProtectedRoute roles={["DEPARTMENT_HEAD"]}>
            <DepartmentHeadLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DepartmentHeadDashboard />} />
        <Route path="internships" element={<DepartmentHeadInternshipsPage />} />
        <Route path="supervisors" element={<DepartmentHeadSupervisorsPage />} />
        <Route path="notifications" element={<DepartmentHeadNotificationsPage />} />
        <Route path="settings" element={<DepartmentHeadSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
