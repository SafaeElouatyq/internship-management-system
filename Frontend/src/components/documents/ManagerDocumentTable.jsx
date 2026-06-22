import ManagerDocumentRow from "./ManagerDocumentRow";

function ManagerDocumentTable({ documents }) {
  if (!documents.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun document
        </h3>
        <p className="text-slate-500 mt-2">
          Les documents des étudiants apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Étudiant</th>
              <th className="text-left px-4 py-4">Document</th>
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-center px-2 py-4 w-44">Actions</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <ManagerDocumentRow key={document.id} document={document} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerDocumentTable;
