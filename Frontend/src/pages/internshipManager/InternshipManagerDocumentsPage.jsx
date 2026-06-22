import { useEffect, useState } from "react";
import ManagerDocumentTable from "../../components/documents/ManagerDocumentTable";
import { getDocuments } from "../../services/documentService.jsx";

function InternshipManagerDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDocuments()
      .then((data) => {
        if (active) setDocuments(data);
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
          Documents
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez et téléchargez les documents soumis par les étudiants.
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
        <ManagerDocumentTable documents={documents} />
      )}
    </>
  );
}

export default InternshipManagerDocumentsPage;
