import { useEffect, useState } from "react";
import LicenceMeetingsCompliance from "../../components/meetings/LicenceMeetingsCompliance";
import MeetingDetailsModal from "../../components/meetings/MeetingDetailsModal";
import MeetingForm from "../../components/meetings/MeetingForm";
import MeetingTable from "../../components/meetings/MeetingTable";
import {
  createMeeting,
  deleteMeeting,
  getSupervisorMeetings,
  updateMeeting,
} from "../../services/supervisorMeetingService.jsx";
import { toDateTimeLocalValue } from "../../utils/meetingUtils.jsx";

const initialForm = {
  internshipId: "",
  date: "",
  type: "",
  summary: "",
  discussedPoints: "",
  decisions: "",
  assignedWork: "",
  supervisorComment: "",
};

function SupervisorMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [internships, setInternships] = useState([]);
  const [licenceCompliance, setLicenceCompliance] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const data = await getSupervisorMeetings();
      setMeetings(data.meetings);
      setInternships(data.internships);
      setLicenceCompliance(data.licenceCompliance || []);
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

  const ResetForm = () => {
    setFormData(initialForm);
    setEditingMeeting(null);
    setOpenForm(false);
  };

  const OpenCreateForm = () => {
    setFormData(initialForm);
    setEditingMeeting(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  const OpenEditForm = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      internshipId: String(meeting.internshipId),
      date: toDateTimeLocalValue(meeting.date),
      type: meeting.type,
      summary: meeting.summary || "",
      discussedPoints: meeting.discussedPoints || "",
      decisions: meeting.decisions || "",
      assignedWork: meeting.assignedWork || "",
      supervisorComment: meeting.supervisorComment || "",
    });
    setOpenForm(true);
    setSelectedMeeting(null);
    setError("");
    setSuccess("");
  };

  const Submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, formData);
        setSuccess("Réunion modifiée avec succès");
      } else {
        await createMeeting(formData);
        setSuccess("Réunion planifiée avec succès");
      }

      ResetForm();
      loadMeetings();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const Delete = async (meeting) => {
    const confirmDelete = window.confirm("Supprimer cette réunion ?");

    if (!confirmDelete) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deleteMeeting(meeting.id);
      setSuccess("Réunion supprimée avec succès");
      setSelectedMeeting(null);
      loadMeetings();
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
            Mes réunions
          </h1>

          <p className="text-slate-500 mt-2">
            Planifiez, modifiez et suivez les réunions avec vos étudiants.
          </p>
        </div>

        {!openForm && (
          <button
            onClick={OpenCreateForm}
            disabled={!internships.length || saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50"
          >
            Planifier une réunion
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

      <LicenceMeetingsCompliance compliance={licenceCompliance} />

      {openForm && (
        <MeetingForm
          formData={formData}
          internships={internships}
          onChange={Change}
          onSubmit={Submit}
          onCancel={ResetForm}
          saving={saving}
          isEdit={Boolean(editingMeeting)}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <MeetingTable
          meetings={meetings}
          onView={setSelectedMeeting}
          onEdit={OpenEditForm}
          onDelete={Delete}
          showStudent
        />
      )}

      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </>
  );
}

export default SupervisorMeetingsPage;
