import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext.jsx";

function SidebarNotificationLink({ path, title = "Notifications" }) {
  const { unreadCount } = useNotifications();

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-500 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <span className="relative inline-flex">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>

      <span className="font-medium">{title}</span>
    </NavLink>
  );
}

export default SidebarNotificationLink;
