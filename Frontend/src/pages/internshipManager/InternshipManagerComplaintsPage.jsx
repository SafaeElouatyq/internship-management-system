import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";
import ComplaintManageModal from "../../components/complaints/ComplaintManageModal";
import ManagerComplaintTable from "../../components/complaints/ManagerComplaintTable";
import { COMPLAINT_STATUS_OPTIONS } from "../../utils/complaintUtils.jsx";
import {
  getManagerComplaints,
  updateManagerComplaint,
} from "../../services/complaintService.jsx";

function InternshipManagerComplaintsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    student: "",
    search: "",
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [manageComplaint, setManageComplaint] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    if (loading || !complaints.length) {
      return;
    }

    const complaintId = searchParams.get("complaintId");

    if (!complaintId) {
      return;
    }

    const complaint = complaints.find(
      (entry) => String(entry.id) === complaintId,
    );

    if (complaint) {
      setSelectedComplaint(complaint);
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("complaintId");
    setSearchParams(nextParams, { replace: true });
  }, [loading, complaints, searchParams, setSearchParams]);

  const loadComplaints = async (nextFilters = filters) => {
    try {
      setLoading(true);
      const data = await getManagerComplaints(nextFilters);
      setComplaints(data.complaints);
      setError("");
    } catch (loadError) {
      setError(
        loadError.response?.data?.message || "Erreur lors du chargement",
      );
    } finally {
      setLoading(false);
    }
  };

  const FilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const ApplyFilters = (event) => {
    event.preventDefault();
    loadComplaints(filters);
  };

  const ResetFilters = () => {
    const resetFilters = {
      status: "",
      student: "",
      search: "",
    };
    setFilters(resetFilters);
    loadComplaints(resetFilters);
  };

  const OpenManageModal = (complaint) => {
    setManageComplaint(complaint);
    setStatus(complaint.status || "PENDING");
    setResponse(complaint.response || "");
    setError("");
  };

  const CloseManageModal = () => {
    setManageComplaint(null);
    setStatus("PENDING");
    setResponse("");
    setError("");
  };

  const SubmitManage = async (event) => {
    event.preventDefault();

    if (!response.trim()) {
      setError("La réponse est obligatoire");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateManagerComplaint(manageComplaint.id, {
        status,
        response,
      });
      setSuccess("Réclamation mise à jour avec succès");
      CloseManageModal();
      loadComplaints();
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Erreur lors de la mise à jour",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Réclamations</h1>
        <p className="text-slate-500 mt-2">
          Consultez et traitez les réclamations déposées par les étudiants.
        </p>
      </div>

      <form
        onSubmit={ApplyFilters}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Statut
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={FilterChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMPLAINT_STATUS_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Étudiant
          </label>
          <input
            type="text"
            name="student"
            value={filters.student}
            onChange={FilterChange}
            placeholder="Nom ou email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Recherche
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={FilterChange}
            placeholder="Sujet ou description"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Filtrer
          </button>
          <button
            type="button"
            onClick={ResetFilters}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {error && !manageComplaint && (
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          Chargement...
        </div>
      ) : (
        <ManagerComplaintTable
          complaints={complaints}
          onView={setSelectedComplaint}
          onManage={OpenManageModal}
        />
      )}

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          showStudentInfo
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {manageComplaint && (
        <ComplaintManageModal
          complaint={manageComplaint}
          status={status}
          response={response}
          onStatusChange={(event) => setStatus(event.target.value)}
          onResponseChange={(event) => setResponse(event.target.value)}
          onSubmit={SubmitManage}
          onCancel={CloseManageModal}
          saving={saving}
          error={error}
        />
      )}
    </>
  );
}

export default InternshipManagerComplaintsPage;
