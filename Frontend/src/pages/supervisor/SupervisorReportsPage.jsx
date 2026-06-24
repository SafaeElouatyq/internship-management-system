import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReportDetailsModal from "../../components/reports/ReportDetailsModal";
import SupervisorReportTable from "../../components/reports/SupervisorReportTable";
import {
  getSupervisorReports,
  updateSupervisorReportComment,
} from "../../services/supervisorReportService.jsx";

function SupervisorReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [supervisorComment, setSupervisorComment] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingComment, setSavingComment] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return;
    }

    const report = reports.find((entry) => String(entry.id) === reportId);

    if (report) {
      setSelectedReport(report);
      setSupervisorComment("");
      setCommentError("");
      setError("");
      setSuccess("");
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("reportId");
    setSearchParams(nextParams, { replace: true });
  }, [loading, reports, searchParams, setSearchParams]);

  const loadReports = async () => {
    try {
      const data = await getSupervisorReports({
        student: searchStudent,
        status,
      });
      setReports(data.reports);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const Search = (event) => {
    event.preventDefault();
    setLoading(true);
    loadReports();
  };

  const OpenReport = (report) => {
    setSelectedReport(report);
    setSupervisorComment("");
    setCommentError("");
    setError("");
    setSuccess("");
  };

  const CloseReport = () => {
    setSelectedReport(null);
    setSupervisorComment("");
    setCommentError("");
  };

  const SubmitComment = async (event) => {
    event.preventDefault();
    setSavingComment(true);
    setCommentError("");
    setSuccess("");

    try {
      await updateSupervisorReportComment(
        selectedReport.id,
        supervisorComment,
      );

      setSupervisorComment("");
      setSelectedReport(null);
      setSuccess("Commentaire enregistré avec succès");
      await loadReports();
    } catch (error) {
      setCommentError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement du commentaire",
      );
    } finally {
      setSavingComment(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Rapports hebdomadaires
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez les rapports des étudiants que vous encadrez et ajoutez vos
          commentaires.
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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <input
            type="text"
            value={searchStudent}
            onChange={(event) => setSearchStudent(event.target.value)}
            placeholder="Rechercher par étudiant"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="SUBMITTED_ON_TIME">Soumis à temps</option>
            <option value="SUBMITTED_LATE">Soumis en retard</option>
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
        <SupervisorReportTable
          reports={reports}
          onView={OpenReport}
        />
      )}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={CloseReport}
          showSupervisorComment
          supervisorComment={supervisorComment}
          onCommentChange={(event) => setSupervisorComment(event.target.value)}
          onCommentSubmit={SubmitComment}
          savingComment={savingComment}
          commentError={commentError}
        />
      )}
    </>
  );
}

export default SupervisorReportsPage;
