import { useEffect, useState } from "react";
import PfeDocumentDetailsModal from "../../components/pfeDocuments/PfeDocumentDetailsModal";
import PfeDocumentTable from "../../components/pfeDocuments/PfeDocumentTable";
import PfeDocumentUploadForm from "../../components/pfeDocuments/PfeDocumentUploadForm";
import {
  deletePfeDocument,
  getMyPfeDocuments,
  uploadPfeDocument,
} from "../../services/pfeDocumentService.jsx";

function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [missingCategories, setMissingCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getMyPfeDocuments();
      setDocuments(data.documents);
      setMissingCategories(data.missingCategories);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenForm = () => {
    setCategory("");
    setFile(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const CloseForm = () => {
    setCategory("");
    setFile(null);
    setOpenForm(false);
  };

  const ChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const ChangeFile = (event) => {
    setFile(event.target.files[0] || null);
  };

  const Submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await uploadPfeDocument(category, file);
      setSuccess("Document PFE téléversé avec succès");
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
      await deletePfeDocument(document.id);
      setSuccess("Document supprimé avec succès");
      loadDocuments();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Rapport PFE
          </h1>

          <p className="text-slate-500 mt-2">
            Téléversez la version initiale, corrigée, finale et la présentation
            de votre rapport PFE.
          </p>
        </div>

        {!openForm && (
          <button
            onClick={OpenForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Téléverser un document
          </button>
        )}
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

      {openForm && (
        <PfeDocumentUploadForm
          category={category}
          file={file}
          onCategoryChange={ChangeCategory}
          onFileChange={ChangeFile}
          onSubmit={Submit}
          onCancel={CloseForm}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <PfeDocumentTable
          documents={documents}
          missingCategories={missingCategories}
          onView={setSelectedDocument}
          onDelete={Delete}
        />
      )}

      {selectedDocument && (
        <PfeDocumentDetailsModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
}

export default StudentDocumentsPage;
