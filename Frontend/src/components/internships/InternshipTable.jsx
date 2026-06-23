import InternshipRow from "./InternshipRow";

function InternshipTable({ internships, onView, onEdit, onDelete }) {
  if (!internships.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucune déclaration de stage
        </h3>
        <p className="text-slate-500 mt-2">
          Déclarez un stage pour commencer le suivi.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left px-6 py-4">
              Titre
            </th>

            <th className="text-left px-6 py-4">
              Entreprise
            </th>

            <th className="text-left px-6 py-4">
              Période
            </th>

            <th className="text-left px-6 py-4">
              Statut
            </th>

            <th className="text-center px-6 py-4">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {internships.map((internship) => (
              <InternshipRow
                key={internship.id}
                internship={internship}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InternshipTable;
