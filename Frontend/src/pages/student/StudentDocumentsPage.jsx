import { useEffect, useState } from "react";
import DocumentTable from "../../components/documents/DocumentTable";
import DocumentUploadForm from "../../components/documents/DocumentUploadForm";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../../services/documentService.jsx";

function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
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
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenForm = () => {
    setName("");
    setFile(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const CloseForm = () => {
    setName("");
    setFile(null);
    setOpenForm(false);
  };

  const ChangeName = (e) => {
    setName(e.target.value);
  };

  const ChangeFile = (e) => {
    setFile(e.target.files[0] || null);
  };

  const Submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await uploadDocument(name, file);
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

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Documents
          </h1>

          <p className="text-slate-500 mt-2">
            Téléversez les documents liés à votre stage.
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
        <DocumentUploadForm
          name={name}
          file={file}
          onNameChange={ChangeName}
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
        <DocumentTable documents={documents} onDelete={Delete} />
      )}
    </>
  );
}

export default StudentDocumentsPage;
