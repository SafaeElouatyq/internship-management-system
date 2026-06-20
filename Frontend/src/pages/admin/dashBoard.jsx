import AdminLayout from "../../components/layout/AdminLayout";

function DashboardPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Bienvenue dans votre espace d'administration.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Utilisateurs
          </h3>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-slate-500 text-sm">
            Étudiants
          </h3>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            0
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
            Entreprises
          </h3>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            0
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;