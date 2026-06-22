import { useEffect, useState } from "react";
import {
  createComplaint,
  getMyComplaints,
} from "../../services/complaintService.jsx";

const initialForm = {
  subject: "",
  description: "",
};

function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data.complaints);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const Change = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const Submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createComplaint(formData);
      setSuccess("Réclamation envoyée avec succès");
      setFormData(initialForm);
      setOpenForm(false);
      loadComplaints();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'envoi de la réclamation",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Réclamations</h1>
          <p className="text-slate-500 mt-2">
            Déposez une réclamation concernant votre stage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          Nouvelle réclamation
        </button>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={Submit}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Nouvelle réclamation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={Change}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={Change}
                  required
                  rows={5}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium disabled:opacity-60"
              >
                {saving ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          Chargement...
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Aucune réclamation
          </h3>
          <p className="text-slate-500 mt-2">
            Vous n&apos;avez pas encore déposé de réclamation.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                  Sujet
                </th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                  Statut
                </th>
                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {complaint.subject}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {complaint.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700">
                      {complaint.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(complaint.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default StudentComplaintsPage;
