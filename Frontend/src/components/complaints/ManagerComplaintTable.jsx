import ManagerComplaintRow from "./ManagerComplaintRow";

function ManagerComplaintTable({ complaints, onView, onManage }) {
  if (!complaints.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucune réclamation
        </h3>
        <p className="text-slate-500 mt-2">
          Les réclamations déposées par les étudiants apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Sujet</th>
              <th className="text-left px-4 py-4">Étudiant</th>
              <th className="text-left px-4 py-4">Entreprise</th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-center px-4 py-4 w-48">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <ManagerComplaintRow
                key={complaint.id}
                complaint={complaint}
                onView={onView}
                onManage={onManage}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerComplaintTable;
