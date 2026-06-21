export const redirectByRole = (role, navigate) => {
  switch (role) {
    case "ADMIN":
      navigate("/admin/dashboard");
      break;

    case "STUDENT":
      navigate("/student/dashboard");
      break;

    case "SUPERVISOR":
      navigate("/supervisor/dashboard");
      break;

    case "INTERNSHIP_MANAGER":
      navigate("/manager/dashboard");
      break;

    case "DEPARTMENT_HEAD":
      navigate("/head/dashboard");
      break;

    default:
      navigate("/");
  }
};