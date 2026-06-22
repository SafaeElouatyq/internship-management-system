import MeetingRow from "./MeetingRow";

function MeetingTable({ meetings, onView, showStudent = false, title }) {
  if (!meetings.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucune réunion
        </h3>
        <p className="text-slate-500 mt-2">
          Les réunions apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              {showStudent && (
                <th className="text-left px-4 py-4">Étudiant</th>
              )}
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-left px-4 py-4">Type</th>
              <th className="text-left px-4 py-4">Statut</th>
              {onView && (
                <th className="text-center px-2 py-4 w-32">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <MeetingRow
                key={meeting.id}
                meeting={meeting}
                onView={onView}
                showStudent={showStudent}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MeetingTable;
