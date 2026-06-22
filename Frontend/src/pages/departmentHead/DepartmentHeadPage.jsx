import { useEffect, useState } from "react";
import AssignSupervisorModal from "../../components/departmentHead/AssignSupervisorModal";
import InternshipTable from "../../components/departmentHead/InternshipTable";
import InternshipDetailsModal from "../../components/internshipManager/InternshipDetailsModal";
import {
  assignSupervisor,
  getInternships,
  getSupervisors,
} from "../../services/departmentHeadService.jsx";

function DepartmentHeadPage() {
  const [internships, setInternships] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [detailsInternship, setDetailsInternship] = useState(null);
  const [supervisorId, setSupervisorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInternships();
    loadSupervisors();
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

  const loadSupervisors = async () => {
    try {
      const data = await getSupervisors();
      setSupervisors(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    }
  };

  const View = (internship) => {
    setDetailsInternship(internship);
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
      loadInternships();
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
          Tableau de bord chef de département
        </h1>

        <p className="text-slate-500 mt-2">
          Affectez les encadrants aux stages validés par l'administration.
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
        <InternshipTable
          internships={internships}
          onView={View}
          onAssign={OpenAssign}
        />
      )}

      {detailsInternship && (
        <InternshipDetailsModal
          internship={detailsInternship}
          onClose={() => setDetailsInternship(null)}
        />
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

export default DepartmentHeadPage;
