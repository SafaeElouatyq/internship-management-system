import DocumentRow from "./DocumentRow";

function DocumentTable({ documents, onDelete }) {
  if (!documents.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun document
        </h3>
        <p className="text-slate-500 mt-2">
          Vos documents apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Nom</th>
              <th className="text-left px-4 py-4">Type</th>
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-center px-2 py-4 w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentTable;
