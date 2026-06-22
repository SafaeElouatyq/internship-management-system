import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { redirectByRole } from "../utils/redirectByRole.jsx";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUser();

  useEffect(() => {
    if (!token || !user) return;

    if (publicOnly && user.mustChangePassword !== true) {
      redirectByRole(user.role, navigate);
    }

    if (
      !publicOnly &&
      roles.length > 0 &&
      !roles.includes(user.role) &&
      user.mustChangePassword !== true
    ) {
      redirectByRole(user.role, navigate);
    }
  }, [token, user, publicOnly, roles, navigate]);

  if (publicOnly) {
    if (!token || !user) {
      return children;
    }

    if (user.mustChangePassword === true) {
      return <Navigate to="/change-password" replace />;
    }

    return null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.mustChangePassword === true && !allowChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
