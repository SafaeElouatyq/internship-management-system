import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdministrativeStatusForm from "../../components/internshipManager/AdministrativeStatusForm";
import InternshipTable from "../../components/internshipManager/InternshipTable";
import {
  getInternships,
  rejectInternship,
  updateAdministrativeStatus,
  validateInternship,
} from "../../services/internshipManagerService.jsx";
import { internshipStatusOptions } from "../../utils/internshipUtils.jsx";

function InternshipManagementPage() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [status, setStatus] = useState("");
  const [administrativeStatus, setAdministrativeStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedAdministrativeStatus, setSelectedAdministrativeStatus] =
    useState("");

  async function loadInternships() {
    try {
      const data = await getInternships({
        student: searchStudent,
        company: searchCompany,
        status,
        administrativeStatus,
      });

      setInternships(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getInternships()
      .then((data) => {
        if (active) setInternships(data);
      })
      .catch((error) => {
        if (active) {
          setError(error.response?.data?.message || "Erreur lors du chargement");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const Search = (e) => {
    e.preventDefault();
    setLoading(true);
    loadInternships();
  };

  const View = (internship) => {
    navigate(`/manager/internships/${internship.id}`);
  };

  const OpenVerify = (internship) => {
    setSelectedInternship(internship);
    setSelectedAdministrativeStatus(internship.administrativeStatus || "");
    setError("");
    setSuccess("");
  };

  const CloseVerify = () => {
    setSelectedInternship(null);
    setSelectedAdministrativeStatus("");
  };

  const HandleAdministrativeChange = (event) => {
    setSelectedAdministrativeStatus(event.target.value);
  };

  const SubmitAdministrativeStatus = async (event) => {
    event.preventDefault();

    if (!selectedInternship || !selectedAdministrativeStatus) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateAdministrativeStatus(
        selectedInternship.id,
        selectedAdministrativeStatus,
      );
      setSuccess("Dossier administratif mis à jour avec succès");
      CloseVerify();
      loadInternships();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la vérification administrative",
      );
    } finally {
      setSaving(false);
    }
  };

  const Validate = async (internship) => {
    const confirmValidate = window.confirm("Valider ce stage ?");

    if (!confirmValidate) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await validateInternship(internship.id);
      setSuccess("Stage validé avec succès");
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la validation");
    } finally {
      setSaving(false);
    }
  };

  const Reject = async (internship) => {
    const confirmReject = window.confirm("Refuser ce stage ?");

    if (!confirmReject) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await rejectInternship(internship.id);
      setSuccess("Stage refusé avec succès");
      loadInternships();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du refus");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Déclarations de stage
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez les déclarations, vérifiez les dossiers administratifs et
          validez ou refusez les stages proposés.
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4">
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
            {internshipStatusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={administrativeStatus}
            onChange={(e) => setAdministrativeStatus(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les dossiers admin.</option>
            <option value="COMPLETE">Complet</option>
            <option value="INCOMPLETE">Incomplet</option>
            <option value="PENDING_DOCUMENTS">Documents en attente</option>
            <option value="REJECTED">Rejeté</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-60"
            disabled={saving}
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
          onVerify={OpenVerify}
          onValidate={Validate}
          onReject={Reject}
        />
      )}

      {selectedInternship && (
        <AdministrativeStatusForm
          internship={selectedInternship}
          administrativeStatus={selectedAdministrativeStatus}
          onChange={HandleAdministrativeChange}
          onSubmit={SubmitAdministrativeStatus}
          onCancel={CloseVerify}
          saving={saving}
        />
      )}
    </>
  );
}

export default InternshipManagementPage;
