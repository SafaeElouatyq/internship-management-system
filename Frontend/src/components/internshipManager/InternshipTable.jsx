import InternshipRow from "./InternshipRow";

function InternshipTable({ internships, onView, onValidate, onReject }) {
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
              <th className="text-left px-4 py-4">Étudiant</th>
              <th className="text-left px-4 py-4">Entreprise</th>
              <th className="text-left px-4 py-4">Sujet</th>
              <th className="text-left px-3 py-4 whitespace-nowrap">
                Date début
              </th>
              <th className="text-left px-3 py-4 whitespace-nowrap">
                Date fin
              </th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-left px-4 py-4">Documents</th>
              <th className="text-center px-2 py-4 w-44">Actions</th>
            </tr>
          </thead>

          <tbody>
            {internships.map((internship) => (
              <InternshipRow
                key={internship.id}
                internship={internship}
                onView={onView}
                onValidate={onValidate}
                onReject={onReject}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InternshipTable;
