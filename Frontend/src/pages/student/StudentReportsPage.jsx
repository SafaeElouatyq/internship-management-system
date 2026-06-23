import { useEffect, useState } from "react";
import ReportDetailsModal from "../../components/reports/ReportDetailsModal";
import ReportForm from "../../components/reports/ReportForm";
import ReportTable from "../../components/reports/ReportTable";
import {
  createReport,
  deleteReport,
  getMyReports,
  updateReport,
} from "../../services/reportService.jsx";

const initialForm = {
  completedWork: "",
  difficulties: "",
  nextWeekPlan: "",
  progress: "",
};

function StudentReportsPage() {
  const [reports, setReports] = useState([]);
  const [missingWeeks, setMissingWeeks] = useState([]);
  const [submissionContext, setSubmissionContext] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
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
      setReports(data.reports);
      setMissingWeeks(data.missingWeeks);
      setSubmissionContext(data.submissionContext);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const ResetForm = () => {
    setFormData(initialForm);
    setSelectedFiles([]);
    setRemovedAttachmentIds([]);
    setEditingReport(null);
    setOpenForm(false);
  };

  const Change = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const FileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const RemoveExistingAttachment = (attachmentId) => {
    setRemovedAttachmentIds((current) =>
      current.includes(attachmentId)
        ? current.filter((id) => id !== attachmentId)
        : [...current, attachmentId],
    );
  };

  const OpenCreateForm = () => {
    setFormData(initialForm);
    setSelectedFiles([]);
    setRemovedAttachmentIds([]);
    setEditingReport(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const OpenEditForm = (report) => {
    setEditingReport(report);
    setFormData({
      completedWork: report.completedWork,
      difficulties: report.difficulties || "",
      nextWeekPlan: report.nextWeekPlan || "",
      progress: String(report.progress),
    });
    setSelectedFiles([]);
    setRemovedAttachmentIds([]);
    setOpenForm(true);
    setSelectedReport(null);
    setError("");
    setSuccess("");
  };

  const Submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        ...(removedAttachmentIds.length && {
          removedAttachmentIds: removedAttachmentIds.join(","),
        }),
      };

      if (editingReport) {
        await updateReport(editingReport.id, payload, selectedFiles);
        setSuccess("Rapport modifié avec succès");
      } else {
        await createReport(payload, selectedFiles);
        setSuccess("Rapport soumis avec succès");
      }

      ResetForm();
      loadReports();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const Delete = async (report) => {
    const confirmDelete = window.confirm("Supprimer ce rapport ?");

    if (!confirmDelete) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deleteReport(report.id);
      setSuccess("Rapport supprimé avec succès");
      loadReports();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 gap-4">
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
            onClick={OpenCreateForm}
            disabled={!submissionContext?.canCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50"
          >
            Nouveau rapport
          </button>
        )}
      </div>

      {submissionContext && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-5 py-4 rounded-2xl">
          <p className="font-medium">
            Semaine en cours : {submissionContext.weekLabel}
          </p>
          <p className="text-sm mt-1">{submissionContext.message}</p>
        </div>
      )}

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
          existingAttachments={editingReport?.attachments || []}
          removedAttachmentIds={removedAttachmentIds}
          selectedFiles={selectedFiles}
          onChange={Change}
          onFileChange={FileChange}
          onRemoveExistingAttachment={RemoveExistingAttachment}
          onSubmit={Submit}
          onCancel={ResetForm}
          saving={saving}
          isEdit={Boolean(editingReport)}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <ReportTable
          reports={reports}
          missingWeeks={missingWeeks}
          onView={setSelectedReport}
          onEdit={OpenEditForm}
          onDelete={Delete}
        />
      )}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
}

export default StudentReportsPage;
