import AssignedStudentRow from "./AssignedStudentRow";

function AssignedStudentsTable({ internships, onView }) {
  if (!internships.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun étudiant assigné
        </h3>
        <p className="text-slate-500 mt-2">
          Les étudiants qui vous sont affectés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Étudiant</th>
              <th className="text-left px-4 py-4">Entreprise</th>
              <th className="text-left px-4 py-4">Sujet</th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-left px-4 py-4">Dernière décision</th>
              <th className="text-center px-2 py-4 w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {internships.map((internship) => (
              <AssignedStudentRow
                key={internship.id}
                internship={internship}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignedStudentsTable;
