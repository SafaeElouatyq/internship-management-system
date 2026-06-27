import { useEffect, useState } from "react";
import CompletedInternshipTable from "../../components/finalDecisions/CompletedInternshipTable";
import FinalDecisionViewModal from "../../components/finalDecisions/FinalDecisionViewModal";
import { getFinalDecisions } from "../../services/finalDecisionService.jsx";

function InternshipManagerFinalDecisionsPage() {
  const [internships, setInternships] = useState([]);
  const [viewInternship, setViewInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getFinalDecisions();
      setInternships(data.internships);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message || "Erreur lors du chargement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Décisions finales
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez les décisions de soutenance prises par les encadrants
          académiques.
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
        <CompletedInternshipTable
          internships={internships}
          readOnly
          onView={setViewInternship}
        />
      )}

      {viewInternship && (
        <FinalDecisionViewModal
          internship={viewInternship}
          onClose={() => setViewInternship(null)}
        />
      )}
    </>
  );
}

export default InternshipManagerFinalDecisionsPage;
