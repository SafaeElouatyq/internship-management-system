function InternshipManagerNotificationsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Notifications
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez vos notifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucune notification
        </h3>

        <p className="text-slate-500 mt-2">
          Vos notifications apparaîtront ici.
        </p>
      </div>
    </>
  );
}

export default InternshipManagerNotificationsPage;
