import { Outlet } from "react-router-dom";
import { NotificationProvider } from "../../context/NotificationContext.jsx";

function AppShell({ sidebar, constrainContent = false }) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-100 overflow-x-hidden">
        {sidebar}

        <main className="ml-72 min-h-screen min-w-0 overflow-x-hidden p-8">
          {constrainContent ? (
            <div className="mx-auto max-w-6xl min-w-0">
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </NotificationProvider>
  );
}

export default AppShell;
