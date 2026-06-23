export const getHomePath = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin/users";

    case "STUDENT":
      return "/student/internship";

    case "SUPERVISOR":
      return "/supervisor/students";

    case "INTERNSHIP_MANAGER":
      return "/manager/internships";

    case "DEPARTMENT_HEAD":
      return "/department-head/dashboard";

    default:
      return "/";
  }
};

export const getDashboardPath = getHomePath;

export const redirectByRole = (role, navigate) => {
  navigate(getHomePath(role));
};
