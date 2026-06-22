import InternshipRow from "./InternshipRow";

function InternshipTable({ internships, onView, onAssign, onEditStatus }) {
  if (!internships.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucune déclaration trouvée
        </h3>
        <p className="text-slate-500 mt-2">
          Les déclarations de stage apparaîtront ici.
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
              <th className="text-left px-4 py-4">Etudiant</th>
              <th className="text-left px-4 py-4">Entreprise</th>
              <th className="text-left px-4 py-4">Titre</th>
              <th className="text-left px-3 py-4 whitespace-nowrap">
                Date début
              </th>
              <th className="text-left px-3 py-4 whitespace-nowrap">
                Date fin
              </th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-left px-4 py-4">Dossier</th>
              <th className="text-left px-4 py-4">Encadrant</th>
              <th className="text-center px-2 py-4 w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {internships.map((internship) => (
              <InternshipRow
                key={internship.id}
                internship={internship}
                onView={onView}
                onAssign={onAssign}
                onEditStatus={onEditStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InternshipTable;
