import { useEffect, useState } from "react";
import MeetingDetailsModal from "../../components/meetings/MeetingDetailsModal";
import MeetingTable from "../../components/meetings/MeetingTable";
import { getStudentMeetings } from "../../services/meetingService.jsx";

function StudentMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getStudentMeetings()
      .then((data) => {
        if (active) setMeetings(data);
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Réunions
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez les réunions planifiées par votre encadrant académique.
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
        <MeetingTable
          meetings={meetings}
          onView={setSelectedMeeting}
          title="Mes réunions"
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

export default StudentMeetingsPage;
