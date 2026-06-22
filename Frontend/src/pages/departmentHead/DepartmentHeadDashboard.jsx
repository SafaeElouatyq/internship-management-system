import { useEffect, useState } from "react";
import {
  getInternships,
  getSupervisors,
} from "../../services/departmentHeadService.jsx";

function DepartmentHeadDashboard() {
  const [internships, setInternships] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getInternships(), getSupervisors()])
      .then(([internshipsData, supervisorsData]) => {
        if (active) {
          setInternships(internshipsData);
          setSupervisors(supervisorsData);
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

  const stagesValides = internships.length;
  const encadrantsDisponibles = supervisors.length;
  const encadrantsAffectes = internships.filter(
    (internship) => internship.supervisorId,
  ).length;
  const affectationsEnAttente = internships.filter(
    (internship) =>
      internship.status === "ADMIN_VALIDATED" && !internship.supervisorId,
  ).length;

  const cards = [
    {
      title: "Stages validés",
      value: stagesValides,
    },
    {
      title: "Encadrants disponibles",
      value: encadrantsDisponibles,
    },
    {
      title: "Encadrants affectés",
      value: encadrantsAffectes,
    },
    {
      title: "Affectations en attente",
      value: affectationsEnAttente,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord
        </h1>

        <p className="text-slate-500 mt-2">
          Suivez les stages validés et les affectations d'encadrants académiques.
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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

export default DepartmentHeadDashboard;
