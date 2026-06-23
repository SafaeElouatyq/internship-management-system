import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PfeDocumentDetailsModal from "../../components/pfeDocuments/PfeDocumentDetailsModal";
import PfeDocumentTable from "../../components/pfeDocuments/PfeDocumentTable";
import {
  getSupervisorPfeDocuments,
  validatePfeDocument,
} from "../../services/pfeDocumentService.jsx";
import {
  PFE_CATEGORY_OPTIONS,
  PFE_VALIDATION_LABELS,
} from "../../utils/pfeDocumentUtils.jsx";

function SupervisorPfeDocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [validationStatus, setValidationStatus] = useState("");
  const [supervisorComment, setSupervisorComment] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [category, setCategory] = useState("");
  const [validationFilter, setValidationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return;
    }

    const document = documents.find((entry) => String(entry.id) === documentId);

    if (document) {
      setSelectedDocument(document);
      setValidationStatus(
        document.validationStatus === "PENDING" ? "" : document.validationStatus,
      );
      setSupervisorComment(document.supervisorComment || "");
      setError("");
      setSuccess("");
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("documentId");
    setSearchParams(nextParams, { replace: true });
  }, [loading, documents, searchParams, setSearchParams]);

  const loadDocuments = async () => {
    try {
      const data = await getSupervisorPfeDocuments({
        student: searchStudent,
        category,
        validationStatus: validationFilter,
      });
      setDocuments(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const Search = (event) => {
    event.preventDefault();
    setLoading(true);
    loadDocuments();
  };

  const OpenDocument = (document) => {
    setSelectedDocument(document);
    setValidationStatus(document.validationStatus === "PENDING" ? "" : document.validationStatus);
    setSupervisorComment(document.supervisorComment || "");
    setError("");
    setSuccess("");
  };

  const CloseDocument = () => {
    setSelectedDocument(null);
    setValidationStatus("");
    setSupervisorComment("");
  };

  const SubmitValidation = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await validatePfeDocument(
        selectedDocument.id,
        validationStatus,
        supervisorComment,
      );

      setSelectedDocument(response.document);
      setSuccess("Validation enregistrée avec succès");
      loadDocuments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la validation",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Rapports PFE
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez, commentez et validez les documents PFE de vos étudiants.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl">
          {success}
        </div>
      )}

      <form
        onSubmit={Search}
        className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4">
          <input
            type="text"
            value={searchStudent}
            onChange={(event) => setSearchStudent(event.target.value)}
            placeholder="Rechercher par étudiant"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les documents</option>
            {PFE_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={validationFilter}
            onChange={(event) => setValidationFilter(event.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(PFE_VALIDATION_LABELS)
              .filter(([key]) => key !== "MISSING")
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Rechercher
          </button>
        </div>
      </form>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <PfeDocumentTable
          documents={documents}
          onView={OpenDocument}
          showStudent
        />
      )}

      {selectedDocument && (
        <PfeDocumentDetailsModal
          document={selectedDocument}
          onClose={CloseDocument}
          showValidation
          validationStatus={validationStatus}
          supervisorComment={supervisorComment}
          onValidationStatusChange={(event) =>
            setValidationStatus(event.target.value)
          }
          onCommentChange={(event) => setSupervisorComment(event.target.value)}
          onValidate={SubmitValidation}
          saving={saving}
        />
      )}
    </>
  );
}

export default SupervisorPfeDocumentsPage;
