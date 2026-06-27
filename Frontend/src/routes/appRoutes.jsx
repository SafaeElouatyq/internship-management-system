import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage.jsx";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage.jsx";
import UsersPage from "../pages/admin/usersPage.jsx";
import StudentInternshipPage from "../pages/student/StudentInternshipPage.jsx";
import StudentReportsPage from "../pages/student/StudentReportsPage.jsx";
import StudentMeetingsPage from "../pages/student/StudentMeetingsPage.jsx";
import StudentDocumentsPage from "../pages/student/StudentDocumentsPage.jsx";
import StudentNotificationsPage from "../pages/student/StudentNotificationsPage.jsx";
import StudentComplaintsPage from "../pages/student/StudentComplaintsPage.jsx";
import StudentSettingsPage from "../pages/student/StudentSettingsPage.jsx";
import StudentHelpPage from "../pages/student/StudentHelpPage.jsx";
import SupervisorStudentsPage from "../pages/supervisor/SupervisorStudentsPage.jsx";
import SupervisorInternshipDetailPage from "../pages/supervisor/SupervisorInternshipDetailPage.jsx";
import SupervisorReportsPage from "../pages/supervisor/SupervisorReportsPage.jsx";
import SupervisorMeetingsPage from "../pages/supervisor/SupervisorMeetingsPage.jsx";
import SupervisorPfeDocumentsPage from "../pages/supervisor/SupervisorPfeDocumentsPage.jsx";
import SupervisorFinalDecisionsPage from "../pages/supervisor/SupervisorFinalDecisionsPage.jsx";
import SupervisorSettingsPage from "../pages/supervisor/SupervisorSettingsPage.jsx";
import SupervisorNotificationsPage from "../pages/supervisor/SupervisorNotificationsPage.jsx";
import SupervisorHelpPage from "../pages/supervisor/SupervisorHelpPage.jsx";
import InternshipManagementPage from "../pages/internshipManager/InternshipManagementPage.jsx";
import InternshipDetailPage from "../pages/internshipManager/InternshipDetailPage.jsx";
import InternshipManagerDocumentsPage from "../pages/internshipManager/InternshipManagerDocumentsPage.jsx";
import InternshipManagerFinalDecisionsPage from "../pages/internshipManager/InternshipManagerFinalDecisionsPage.jsx";
import InternshipManagerNotificationsPage from "../pages/internshipManager/InternshipManagerNotificationsPage.jsx";
import InternshipManagerSettingsPage from "../pages/internshipManager/InternshipManagerSettingsPage.jsx";
import InternshipManagerHelpPage from "../pages/internshipManager/InternshipManagerHelpPage.jsx";
import DepartmentHeadDashboard from "../pages/departmentHead/DepartmentHeadDashboard.jsx";
import DepartmentHeadInternshipsPage from "../pages/departmentHead/DepartmentHeadInternshipsPage.jsx";
import DepartmentHeadSupervisorsPage from "../pages/departmentHead/DepartmentHeadSupervisorsPage.jsx";
import DepartmentHeadNotificationsPage from "../pages/departmentHead/DepartmentHeadNotificationsPage.jsx";
import DepartmentHeadSettingsPage from "../pages/departmentHead/DepartmentHeadSettingsPage.jsx";
import DepartmentHeadFinalDecisionsPage from "../pages/departmentHead/DepartmentHeadFinalDecisionsPage.jsx";
import DepartmentHeadHelpPage from "../pages/departmentHead/DepartmentHeadHelpPage.jsx";
import AdminHelpPage from "../pages/admin/AdminHelpPage.jsx";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage.jsx";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage.jsx";
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
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="help" element={<AdminHelpPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="internship" replace />} />
        <Route path="internship" element={<StudentInternshipPage />} />
        <Route path="reports" element={<StudentReportsPage />} />
        <Route path="meetings" element={<StudentMeetingsPage />} />
        <Route path="documents" element={<StudentDocumentsPage />} />
        <Route path="complaints" element={<StudentComplaintsPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
        <Route path="help" element={<StudentHelpPage />} />
      </Route>

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute roles={["SUPERVISOR"]}>
            <SupervisorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="students" replace />} />
        <Route path="students" element={<SupervisorStudentsPage />} />
        <Route path="internships/:id" element={<SupervisorInternshipDetailPage />} />
        <Route path="reports" element={<SupervisorReportsPage />} />
        <Route path="meetings" element={<SupervisorMeetingsPage />} />
        <Route path="pfe-documents" element={<SupervisorPfeDocumentsPage />} />
        <Route path="final-decisions" element={<SupervisorFinalDecisionsPage />} />
        <Route path="settings" element={<SupervisorSettingsPage />} />
        <Route path="help" element={<SupervisorHelpPage />} />
        <Route path="notifications" element={<SupervisorNotificationsPage />} />
      </Route>

      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["INTERNSHIP_MANAGER"]}>
            <InternshipManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="internships" replace />} />
        <Route path="internships" element={<InternshipManagementPage />} />
        <Route path="internships/:id" element={<InternshipDetailPage />} />
        <Route path="documents" element={<InternshipManagerDocumentsPage />} />
        <Route path="final-decisions" element={<InternshipManagerFinalDecisionsPage />} />
        <Route path="notifications" element={<InternshipManagerNotificationsPage />} />
        <Route path="settings" element={<InternshipManagerSettingsPage />} />
        <Route path="help" element={<InternshipManagerHelpPage />} />
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
        <Route path="final-decisions" element={<DepartmentHeadFinalDecisionsPage />} />
        <Route path="notifications" element={<DepartmentHeadNotificationsPage />} />
        <Route path="settings" element={<DepartmentHeadSettingsPage />} />
        <Route path="help" element={<DepartmentHeadHelpPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
