import { useEffect, useState } from "react";
import InternshipForm from "../../components/internships/InternshipForm";
import InternshipTable from "../../components/internships/InternshipTable";
import {
  createInternship,
  deleteInternship,
  getInternships,
  updateInternship,
} from "../../services/internshipService.jsx";

const initialForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  companyName: "",
  companyAddress: "",
  companyEmail: "",
  companyPhone: "",
};

function StudentInternshipPage() {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const data = await getInternships();
      setInternships(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const Change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const OpenForm = () => {
    setFormData(initialForm);
    setSelectedInternship(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const CloseForm = () => {
    setFormData(initialForm);
    setSelectedInternship(null);
    setOpenForm(false);
  };

  const Edit = (internship) => {
    setSelectedInternship(internship);
    setFormData({
      title: internship.title || "",
      description: internship.description || "",
      startDate: internship.startDate?.slice(0, 10) || "",
      endDate: internship.endDate?.slice(0, 10) || "",
      companyName: internship.company?.name || "",
      companyAddress: internship.company?.address || "",
      companyEmail: internship.company?.email || "",
      companyPhone: internship.company?.phone || "",
    });
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const Delete = async (internship) => {
    const confirmDelete = window.confirm("Supprimer cette déclaration ?");

    if (!confirmDelete) return;

    try {
      await deleteInternship(internship.id);
      setSuccess("Déclaration supprimée avec succès");
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const Submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (selectedInternship) {
        await updateInternship(selectedInternship.id, formData);
        setSuccess("Déclaration modifiée avec succès");
      } else {
        await createInternship(formData);
        setSuccess("Déclaration créée avec succès");
      }

      CloseForm();
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Mon stage
          </h1>

          <p className="text-slate-500 mt-2">
            Créez et gérez votre déclaration de stage.
          </p>
        </div>

        {!openForm && (
          <button
            onClick={OpenForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Déclarer un stage
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
        <InternshipForm
          formData={formData}
          onChange={Change}
          onSubmit={Submit}
          onCancel={CloseForm}
          saving={saving}
          selectedInternship={selectedInternship}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <InternshipTable
          internships={internships}
          onEdit={Edit}
          onDelete={Delete}
        />
      )}
    </>
  );
}

export default StudentInternshipPage;
