import { useEffect, useState } from "react";
import { getSupervisorReports } from "../../services/supervisorReportService.jsx";

function SupervisorDashboard() {
  const [stats, setStats] = useState({ submittedCount: 0, lateCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getSupervisorReports()
      .then((data) => {
        if (active) setStats(data.stats);
      })
      .catch((error) => {
        if (active) {
          setError(error.response?.data?.message || "Erreur lors du chargement");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      title: "Rapports soumis",
      value: stats.submittedCount,
    },
    {
      title: "Rapports en retard",
      value: stats.lateCount,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Suivez les rapports hebdomadaires de vos étudiants.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
            >
              <h3 className="text-slate-500 text-sm">
                {card.title}
              </h3>

              <p className="text-3xl font-bold text-slate-800 mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SupervisorDashboard;
