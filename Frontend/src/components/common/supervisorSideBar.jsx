import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService.jsx";
import SidebarNotificationLink from "../notifications/SidebarNotificationLink.jsx";
import AppSidebar from "../layout/AppSidebar.jsx";
import {
  FileText,
  CalendarDays,
  Users,
  BookOpen,
  Settings,
  CircleHelp,
  LogOut,
  Gavel,
} from "lucide-react";

function SupervisorSideBar() {
  const navigate = useNavigate();

  const Logout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    {
      title: "Mes étudiants",
      path: "/supervisor/students",
      icon: Users,
    },
    {
      title: "Rapports",
      path: "/supervisor/reports",
      icon: FileText,
    },
    {
      title: "Mes réunions",
      path: "/supervisor/meetings",
      icon: CalendarDays,
    },
    {
      title: "Rapports PFE",
      path: "/supervisor/pfe-documents",
      icon: BookOpen,
    },
    {
      title: "Décisions finales",
      path: "/supervisor/final-decisions",
      icon: Gavel,
    },
  ];

  const others = [
    {
      title: "Paramètres",
      path: "/supervisor/settings",
      icon: Settings,
    },
    {
      title: "Aide",
      path: "/supervisor/help",
      icon: CircleHelp,
    },
  ];

  return (
    <AppSidebar
      footer={
        <button
          onClick={Logout}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 py-3 font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      }
    >
      <nav className="space-y-2 px-5">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}

        <SidebarNotificationLink path="/supervisor/notifications" />
      </nav>

      <div className="mx-5 my-7 border-t border-slate-200"></div>

      <nav className="space-y-2 px-5">
        {others.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </AppSidebar>
  );
}

export default SupervisorSideBar;
