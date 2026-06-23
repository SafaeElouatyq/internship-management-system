export const getDashboardPath = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "STUDENT":
      return "/student/dashboard";

    case "SUPERVISOR":
      return "/supervisor/dashboard";

    case "INTERNSHIP_MANAGER":
      return "/manager/dashboard";

    case "DEPARTMENT_HEAD":
      return "/department-head/dashboard";

    default:
      return "/";
  }
};

export const redirectByRole = (role, navigate) => {
  navigate(getDashboardPath(role));
};