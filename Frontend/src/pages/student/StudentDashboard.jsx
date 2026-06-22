function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord étudiant
        </h1>

        <p className="text-slate-500 mt-2">
          Bienvenue {user.firstName} {user.lastName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Nom
          </h3>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Rôle
          </h3>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {user.role}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Stages
          </h3>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Documents
          </h3>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            0
          </p>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
