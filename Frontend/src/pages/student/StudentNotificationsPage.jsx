import NotificationsList from "../../components/notifications/NotificationsList.jsx";

function StudentNotificationsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
        <p className="text-slate-500 mt-2">Consultez vos notifications.</p>
      </div>

      <NotificationsList />
    </>
  );
}

export default StudentNotificationsPage;
