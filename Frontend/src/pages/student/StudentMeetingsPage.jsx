import { useEffect, useState } from "react";
import MeetingDetailsModal from "../../components/meetings/MeetingDetailsModal";
import MeetingTable from "../../components/meetings/MeetingTable";
import { getStudentMeetings } from "../../services/meetingService.jsx";
import {
  buildSequenceProgress,
  getMeetingSequenceLabel,
} from "../../utils/meetingUtils.jsx";

function StudentMeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [meetingContext, setMeetingContext] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getStudentMeetings()
      .then((data) => {
        if (!active) return;

        if (Array.isArray(data)) {
          setMeetings(data);
          setMeetingContext(null);
          return;
        }

        setMeetings(data.meetings || []);
        setMeetingContext(data.meetingContext || null);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError.response?.data?.message || "Erreur lors du chargement",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const progress = buildSequenceProgress(meetingContext);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Réunions</h1>
        <p className="text-slate-500 mt-2">
          Consultez les rencontres obligatoires planifiées par votre encadrant
          académique.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {meetingContext?.minimumRequired && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Rencontres obligatoires
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {meetingContext.meetingCount} / {meetingContext.minimumRequired}{" "}
                planifiée{meetingContext.meetingCount > 1 ? "s" : ""}
              </p>
            </div>

            {meetingContext.nextSequenceLabel ? (
              <span className="inline-flex self-start rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                Prochaine : {meetingContext.nextSequenceLabel}
              </span>
            ) : (
              <span className="inline-flex self-start rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                Toutes les rencontres sont planifiées
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {progress.map((step) => (
              <span
                key={step.sequenceNumber}
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  step.isCompleted
                    ? "bg-green-50 text-green-700"
                    : step.isCurrent
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {getMeetingSequenceLabel(step.sequenceNumber)}
                {step.isCompleted
                  ? " ✓"
                  : step.isCurrent
                    ? " — en cours"
                    : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-slate-500">
          Chargement...
        </div>
      ) : (
        <MeetingTable
          meetings={meetings}
          onView={setSelectedMeeting}
          title="Mes rencontres"
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
