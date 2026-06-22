import { useEffect, useState } from "react";
import MeetingDetailsModal from "../../components/meetings/MeetingDetailsModal";
import MeetingForm from "../../components/meetings/MeetingForm";
import MeetingTable from "../../components/meetings/MeetingTable";
import {
  createMeeting,
  getSupervisorMeetings,
} from "../../services/supervisorMeetingService.jsx";

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
  const [formData, setFormData] = useState(initialForm);
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
      await createMeeting(formData);
      setSuccess("Réunion planifiée avec succès");
      CloseForm();
      loadMeetings();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Mes réunions
          </h1>

          <p className="text-slate-500 mt-2">
            Planifiez et suivez les réunions avec vos étudiants.
          </p>
        </div>

        {!openForm && (
          <button
            onClick={OpenForm}
            disabled={!internships.length}
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

      {openForm && (
        <MeetingForm
          formData={formData}
          internships={internships}
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
        <MeetingTable
          meetings={meetings}
          onView={setSelectedMeeting}
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
