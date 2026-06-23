import { useEffect, useState } from "react";
import { getAssignedInternships } from "../../services/supervisorInternshipService.jsx";
import { getSupervisorReports } from "../../services/supervisorReportService.jsx";

function SupervisorDashboard() {
  const [stats, setStats] = useState({
    assignedCount: 0,
    pendingSubjectCount: 0,
    validatedSubjectCount: 0,
    submittedCount: 0,
    lateCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getAssignedInternships(), getSupervisorReports()])
      .then(([internshipsData, reportsData]) => {
        if (active) {
          setStats({
            ...internshipsData.stats,
            submittedCount: reportsData.stats.submittedCount,
            missingCount: reportsData.stats.missingCount,
          });
        }
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
      title: "Étudiants assignés",
      value: stats.assignedCount,
    },
    {
      title: "Sujets en attente",
      value: stats.pendingSubjectCount,
    },
    {
      title: "Sujets validés",
      value: stats.validatedSubjectCount,
    },
    {
      title: "Rapports soumis",
      value: stats.submittedCount,
    },
    {
      title: "Rapports manquants",
      value: stats.missingCount ?? 0,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Suivez vos étudiants, la validation des sujets et les rapports
          hebdomadaires.
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
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
