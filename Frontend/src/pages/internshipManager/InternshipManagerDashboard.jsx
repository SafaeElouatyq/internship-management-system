import { useEffect, useState } from "react";
import { getInternships } from "../../services/internshipManagerService.jsx";

function InternshipManagerDashboard() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getInternships()
      .then((data) => {
        if (active) setInternships(data);
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

  const declarationsRecues = internships.length;
  const stagesEnAttente = internships.filter(
    (internship) =>
      ["DECLARED", "ADMIN_PENDING"].includes(internship.status) &&
      internship.administrativeStatus !== "REJECTED",
  ).length;
  const stagesValides = internships.filter(
    (internship) =>
      internship.status === "ADMIN_VALIDATED" &&
      internship.administrativeStatus !== "REJECTED",
  ).length;
  const stagesRefuses = internships.filter(
    (internship) => internship.administrativeStatus === "REJECTED",
  ).length;
  const stagesEnCours = internships.filter(
    (internship) => internship.status === "IN_PROGRESS",
  ).length;

  const cards = [
    {
      title: "Déclarations reçues",
      value: declarationsRecues,
    },
    {
      title: "Stages en attente",
      value: stagesEnAttente,
    },
    {
      title: "Stages validés",
      value: stagesValides,
    },
    {
      title: "Stages refusés",
      value: stagesRefuses,
    },
    {
      title: "Stages en cours",
      value: stagesEnCours,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Suivez les déclarations de stage et validez ou refusez les dossiers.
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

export default InternshipManagerDashboard;
