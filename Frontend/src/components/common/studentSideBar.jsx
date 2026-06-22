import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService.jsx";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  MessageSquareWarning,
  Bell,
  User,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

function StudentSideBar() {
  const navigate = useNavigate();

  const Logout = () => {
    logout();
    navigate("/");
  };

  const menu = [
  {
    title: "Tableau de bord",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mon Stage",
    path: "/student/internship",
    icon: BriefcaseBusiness,
  },
  {
    title: "Rapports",
    path: "/student/reports",
    icon: FileText,
  },
  {
    title: "Réunions",
    path: "/student/meetings",
    icon: CalendarDays,
  },
  {
    title: "Documents",
    path: "/student/documents",
    icon: FileText,
  },
  // {
  //   title: "Réclamations",
  //   path: "/student/complaints",
  //   icon: MessageSquareWarning,
  // },
  {
    title: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },
  // {
  //   title: "Mon Profil",
  //   path: "/student/profile",
  //   icon: User,
  // },
];

  const others = [
    {
      title: "Paramètres",
      path: "/student/settings",
      icon: Settings,
    },
    {
      title: "Aide",
      path: "/student/help",
      icon: CircleHelp,
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between">
      <div className="pt-10">
        <nav className="px-5 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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

        <div className="mx-5 my-7 border-t border-slate-200"></div>

        <nav className="px-5 space-y-2">
          {others.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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
      </div>

      <div className="p-5">
        <button
          onClick={Logout}
          className="w-full flex items-center justify-center gap-3 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl transition font-medium"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default StudentSideBar;
