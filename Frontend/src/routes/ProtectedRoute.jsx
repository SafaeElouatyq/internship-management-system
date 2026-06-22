import { Navigate } from "react-router-dom";
import { getDashboardPath } from "../utils/redirectByRole.jsx";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
};

function ProtectedRoute({
  children,
  roles = [],
  publicOnly = false,
  allowChangePassword = false,
}) {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (publicOnly) {
    if (!token || !user) {
      return children;
    }

    if (user.mustChangePassword === true) {
      return <Navigate to="/change-password" replace />;
    }

    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.mustChangePassword === true && !allowChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
