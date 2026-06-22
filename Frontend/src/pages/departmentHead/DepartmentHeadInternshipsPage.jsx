import { useEffect, useState } from "react";
import AssignSupervisorModal from "../../components/departmentHead/AssignSupervisorModal";
import InternshipTable from "../../components/departmentHead/InternshipTable";
import {
  assignSupervisor,
  getInternships,
  getSupervisors,
} from "../../services/departmentHeadService.jsx";

function DepartmentHeadInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [supervisorId, setSupervisorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [internshipsData, supervisorsData] = await Promise.all([
        getInternships(),
        getSupervisors(),
      ]);

      setInternships(internshipsData);
      setSupervisors(supervisorsData);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenAssign = (internship) => {
    setSelectedInternship(internship);
    setSupervisorId(internship.supervisorId || "");
    setError("");
    setSuccess("");
  };

  const CloseAssign = () => {
    setSelectedInternship(null);
    setSupervisorId("");
  };

  const ChangeSupervisor = (e) => {
    setSupervisorId(e.target.value);
  };

  const SubmitAssign = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await assignSupervisor(selectedInternship.id, supervisorId);
      setSuccess("Encadrant affecté avec succès");
      CloseAssign();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'affectation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Stages validés
        </h1>

        <p className="text-slate-500 mt-2">
          Affectez un encadrant académique aux stages validés par le gestionnaire.
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
        <InternshipTable internships={internships} onAssign={OpenAssign} />
      )}

      {selectedInternship && (
        <AssignSupervisorModal
          internship={selectedInternship}
          supervisors={supervisors}
          supervisorId={supervisorId}
          onChange={ChangeSupervisor}
          onSubmit={SubmitAssign}
          onCancel={CloseAssign}
          saving={saving}
        />
      )}
    </>
  );
}

export default DepartmentHeadInternshipsPage;
