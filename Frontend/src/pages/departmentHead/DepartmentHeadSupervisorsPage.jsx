import { useEffect, useState } from "react";
import { getSupervisors } from "../../services/departmentHeadService.jsx";

function DepartmentHeadSupervisorsPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getSupervisors()
      .then((data) => {
        if (active) setSupervisors(data);
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Encadrants
        </h1>

        <p className="text-slate-500 mt-2">
          Liste des encadrants académiques disponibles pour l'affectation.
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
      ) : !supervisors.length ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Aucun encadrant trouvé
          </h3>
          <p className="text-slate-500 mt-2">
            Les encadrants académiques apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-4 py-4">Nom</th>
                  <th className="text-left px-4 py-4">Email</th>
                  <th className="text-left px-4 py-4">Département</th>
                  <th className="text-left px-4 py-4">Spécialité</th>
                </tr>
              </thead>

              <tbody>
                {supervisors.map((supervisor) => (
                  <tr
                    key={supervisor.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {supervisor.user?.firstName} {supervisor.user?.lastName}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supervisor.user?.email}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supervisor.department?.name || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supervisor.speciality || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default DepartmentHeadSupervisorsPage;
