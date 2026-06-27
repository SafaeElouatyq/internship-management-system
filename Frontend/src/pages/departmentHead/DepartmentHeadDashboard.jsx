import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/departmentHeadService.jsx";

function DepartmentHeadDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDashboardStats()
      .then((data) => {
        if (active) {
          setDashboard(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError.response?.data?.message || "Erreur lors du chargement",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats;

  const cards = stats
    ? [
        {
          title: "Total étudiants",
          value: stats.totalStudents,
        },
        {
          title: "Étudiants avec stage déclaré",
          value: stats.declaredStudentCount,
        },
        {
          title: "Étudiants sans stage",
          value: stats.studentsWithoutInternship,
        },
        {
          title: "Étudiants sans encadrant",
          value: stats.studentsWithoutSupervisor,
        },
        {
          title: "Dossiers validés administrativement",
          value: stats.administrativelyValidatedCount,
        },
        {
          title: "Sujets validés",
          value: stats.subjectValidatedCount,
        },
        {
          title: "Rapports hebdomadaires déposés",
          value: stats.weeklyReportsSubmitted,
        },
        {
          title: "Rapports hebdomadaires en retard",
          value: stats.weeklyReportsLate,
        },
        {
          title: "Rencontres incomplètes",
          value: stats.incompleteMeetingsCount,
        },
        {
          title: "Autorisés à soutenir",
          value: stats.authorizedCount,
        },
      ]
    : [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Vue d&apos;ensemble du suivi des stages
          {dashboard?.department?.name
            ? ` — ${dashboard.department.name}`
            : ""}
          .
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
              >
                <h3 className="text-slate-500 text-sm">{card.title}</h3>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Répartition des étudiants par encadrant
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Nombre d&apos;étudiants affectés à chaque encadrant académique.
              </p>
            </div>

            {!dashboard?.supervisorDistribution?.length ? (
              <div className="p-10 text-center text-slate-500">
                Aucune affectation enregistrée pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Encadrant
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Étudiants affectés
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.supervisorDistribution.map((entry) => (
                      <tr
                        key={entry.supervisorId}
                        className="border-t border-slate-100"
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {entry.supervisorName}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {entry.studentCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default DepartmentHeadDashboard;
