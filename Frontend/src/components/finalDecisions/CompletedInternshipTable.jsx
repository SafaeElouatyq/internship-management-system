import CompletedInternshipRow from "./CompletedInternshipRow";

function CompletedInternshipTable({
  internships,
  readOnly = false,
  onDecide,
  onView,
}) {
  if (!internships.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun stage terminé
        </h3>
        <p className="text-slate-500 mt-2">
          Les stages prêts pour décision apparaîtront ici.
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
              <th className="text-left px-4 py-4">Rapport final</th>
              <th className="text-left px-4 py-4">Décision</th>
              <th className="text-center px-2 py-4 w-56">Actions</th>
            </tr>
          </thead>

          <tbody>
            {internships.map((internship) => (
              <CompletedInternshipRow
                key={internship.id}
                internship={internship}
                readOnly={readOnly}
                onDecide={onDecide}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompletedInternshipTable;
