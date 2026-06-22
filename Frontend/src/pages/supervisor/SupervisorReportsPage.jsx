import { useEffect, useState } from "react";
import ReportDetailsModal from "../../components/reports/ReportDetailsModal";
import SupervisorReportTable from "../../components/reports/SupervisorReportTable";
import { getSupervisorReports } from "../../services/supervisorReportService.jsx";

function SupervisorReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getSupervisorReports();
      setReports(data.reports);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Rapports hebdomadaires
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez les rapports des étudiants que vous encadrez.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <SupervisorReportTable
          reports={reports}
          onView={setSelectedReport}
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

export default SupervisorReportsPage;
