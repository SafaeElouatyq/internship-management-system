import { useEffect, useState } from "react";
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

  const resetForm = () => {
    setFormData(initialForm);
    setSelectedInternship(null);
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

      resetForm();
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Mon stage
        </h1>

        <p className="text-slate-500 mt-2">
          Créez et gérez votre déclaration de stage.
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


      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-6 py-4">Titre</th>
                <th className="text-left px-6 py-4">Entreprise</th>
                <th className="text-left px-6 py-4">Période</th>
                <th className="text-left px-6 py-4">Statut</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {internships.map((internship) => (
                <tr
                  key={internship.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {internship.title}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {internship.company?.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {internship.startDate?.slice(0, 10)} -{" "}
                    {internship.endDate?.slice(0, 10)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {internship.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => Edit(internship)}
                      className="text-blue-600 hover:text-blue-700 font-medium mr-4"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => Delete(internship)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {!internships.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Aucune déclaration de stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <form
        onSubmit={Submit}
        className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Titre du stage
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nom de l'entreprise
            </label>

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date de début
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date de fin
            </label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Adresse entreprise
            </label>

            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email entreprise
            </label>

            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Téléphone entreprise
            </label>

            <input
              type="text"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={Change}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={Change}
              rows="4"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {selectedInternship && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            {saving
              ? "Enregistrement..."
              : selectedInternship
                ? "Modifier"
                : "Créer la déclaration"}
          </button>
        </div>
      </form>

     
    </>
  );
}

export default StudentInternshipPage;
