import { useEffect, useState } from "react";
import InternshipDocumentTable from "./InternshipDocumentTable";
import InternshipDocumentUploadForm from "./InternshipDocumentUploadForm";
import {
  deleteDocument,
  getInternshipDocuments,
  uploadDocument,
} from "../../services/internshipDocumentService.jsx";

function InternshipDocumentsPanel({
  internshipId,
  canUpload = false,
  title = "Documents de stage",
  description = "Convention, attestation et autres documents administratifs.",
}) {
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (internshipId) {
      loadDocuments();
    }
  }, [internshipId]);

  const loadDocuments = async () => {
    try {
      const data = await getInternshipDocuments(internshipId);
      setDocuments(data.documents);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenForm = () => {
    setType("");
    setFile(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const CloseForm = () => {
    setType("");
    setFile(null);
    setOpenForm(false);
  };

  const Submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await uploadDocument(internshipId, type, file);
      setSuccess("Document téléversé avec succès");
      CloseForm();
      loadDocuments();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du téléversement");
    } finally {
      setSaving(false);
    }
  };

  const Delete = async (document) => {
    const confirmDelete = window.confirm("Supprimer ce document ?");

    if (!confirmDelete) return;

    try {
      await deleteDocument(document.id);
      setSuccess("Document supprimé avec succès");
      loadDocuments();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  if (!internshipId) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>

        {canUpload && !openForm && (
          <button
            type="button"
            onClick={OpenForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shrink-0"
          >
            Ajouter
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {openForm && (
        <InternshipDocumentUploadForm
          type={type}
          file={file}
          onTypeChange={(event) => setType(event.target.value)}
          onFileChange={(event) => setFile(event.target.files[0] || null)}
          onSubmit={Submit}
          onCancel={CloseForm}
          saving={saving}
        />
      )}

      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <InternshipDocumentTable
          documents={documents}
          onDelete={Delete}
          canDelete={canUpload}
        />
      )}
    </section>
  );
}

export default InternshipDocumentsPanel;
