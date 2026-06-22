import { useEffect, useState } from "react";
import AdministrativeStatusForm from "../../components/internshipManager/AdministrativeStatusForm";
import AssignSupervisorForm from "../../components/internshipManager/AssignSupervisorForm";
import InternshipDetailsModal from "../../components/internshipManager/InternshipDetailsModal";
import InternshipTable from "../../components/internshipManager/InternshipTable";
import {
  assignSupervisor,
  getInternships,
  getSupervisors,
  updateAdministrativeStatus,
} from "../../services/internshipManagerService.jsx";

function InternshipManagementPage() {
  const [internships, setInternships] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [detailsInternship, setDetailsInternship] = useState(null);
  const [administrativeInternship, setAdministrativeInternship] = useState(null);
  const [supervisorId, setSupervisorId] = useState("");
  const [administrativeStatus, setAdministrativeStatus] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [status, setStatus] = useState("");
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
      const data = await getInternships({
        student: searchStudent,
        company: searchCompany,
        status,
      });

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

  const Search = (e) => {
    e.preventDefault();
    setLoading(true);
    loadInternships();
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

  const OpenAdministrativeStatus = (internship) => {
    setAdministrativeInternship(internship);
    setAdministrativeStatus(internship.administrativeStatus || "");
    setError("");
    setSuccess("");
  };

  const CloseAdministrativeStatus = () => {
    setAdministrativeInternship(null);
    setAdministrativeStatus("");
  };

  const ChangeAdministrativeStatus = (e) => {
    setAdministrativeStatus(e.target.value);
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

  const SubmitAdministrativeStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateAdministrativeStatus(
        administrativeInternship.id,
        administrativeStatus,
      );
      setSuccess("Dossier administratif mis à jour avec succès");
      CloseAdministrativeStatus();
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la vérification");
    } finally {
      setSaving(false);
    }
  };

  const View = (internship) => {
    setDetailsInternship(internship);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Déclarations de stage
        </h1>

        <p className="text-slate-500 mt-2">
          Gérez les déclarations et l'affectation des encadrants.
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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4">
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Rechercher par étudiant"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            placeholder="Rechercher par entreprise"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="DECLARED">Déclaré</option>
            <option value="ADMIN_PENDING">En attente admin</option>
            <option value="ADMIN_VALIDATED">Validé par admin</option>
            <option value="SUPERVISOR_ASSIGNED">Encadrant affecté</option>
            <option value="SUBJECT_PENDING">Sujet en attente</option>
            <option value="SUBJECT_VALIDATED">Sujet validé</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="CLOSED">Clôturé</option>
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
        <InternshipTable
          internships={internships}
          onView={View}
          onAssign={OpenAssign}
          onEditStatus={OpenAdministrativeStatus}
        />
      )}

      {detailsInternship && (
        <InternshipDetailsModal
          internship={detailsInternship}
          onClose={() => setDetailsInternship(null)}
        />
      )}

      {selectedInternship && (
        <AssignSupervisorForm
          supervisors={supervisors}
          supervisorId={supervisorId}
          onChange={ChangeSupervisor}
          onSubmit={SubmitAssign}
          onCancel={CloseAssign}
          saving={saving}
          internship={selectedInternship}
        />
      )}

      {administrativeInternship && (
        <AdministrativeStatusForm
          internship={administrativeInternship}
          administrativeStatus={administrativeStatus}
          onChange={ChangeAdministrativeStatus}
          onSubmit={SubmitAdministrativeStatus}
          onCancel={CloseAdministrativeStatus}
          saving={saving}
        />
      )}
    </>
  );
}

export default InternshipManagementPage;
