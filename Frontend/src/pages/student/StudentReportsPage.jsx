import { useEffect, useState } from "react";
import ReportForm from "../../components/reports/ReportForm";
import ReportTable from "../../components/reports/ReportTable";
import { createReport, getMyReports } from "../../services/reportService.jsx";

const initialForm = {
  completedWork: "",
  difficulties: "",
  nextWeekPlan: "",
  progress: "",
};

function StudentReportsPage() {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getMyReports();
      setReports(data);
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
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const CloseForm = () => {
    setFormData(initialForm);
    setOpenForm(false);
  };

  const Submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createReport(formData);
      setSuccess("Rapport soumis avec succès");
      CloseForm();
      loadReports();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Rapports hebdomadaires
          </h1>

          <p className="text-slate-500 mt-2">
            Soumettez vos rapports d'avancement chaque semaine.
          </p>
        </div>

        {!openForm && (
          <button
            onClick={OpenForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Nouveau rapport
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
        <ReportForm
          formData={formData}
          onChange={Change}
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
        <ReportTable reports={reports} />
      )}
    </>
  );
}

export default StudentReportsPage;
