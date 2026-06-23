import PfeDocumentRow from "./PfeDocumentRow";
import {
  PFE_CATEGORY_LABELS,
  PFE_VALIDATION_STYLES,
} from "../../utils/pfeDocumentUtils.jsx";
import PfeValidationBadge from "./PfeValidationBadge";

function PfeDocumentTable({
  documents,
  missingCategories = [],
  onView,
  onDelete,
  showStudent = false,
}) {
  const missingRows = missingCategories.map((item) => ({
    key: `missing-${item.category}`,
    type: "missing",
    item,
  }));

  const documentRows = documents.map((document) => ({
    key: `document-${document.id}`,
    type: "document",
    document,
  }));

  const rows = [...documentRows, ...missingRows];

  if (!rows.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun document PFE
        </h3>
        <p className="text-slate-500 mt-2">
          Téléversez vos documents de rapport PFE ici.
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
              <th className="text-left px-4 py-4">Document</th>
              {showStudent && (
                <th className="text-left px-4 py-4">Étudiant</th>
              )}
              <th className="text-left px-4 py-4">Format</th>
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-left px-4 py-4">Statut</th>
              <th className="text-center px-2 py-4 w-44">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              if (row.type === "missing") {
                return (
                  <tr
                    key={row.key}
                    className="border-t border-slate-200 bg-red-50/30"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {row.item.label || PFE_CATEGORY_LABELS[row.item.category]}
                    </td>
                    {showStudent && <td className="px-4 py-4" />}
                    <td className="px-4 py-4 text-slate-500">-</td>
                    <td className="px-4 py-4 text-slate-500">-</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${PFE_VALIDATION_STYLES.MISSING}`}
                      >
                        Non déposé
                      </span>
                    </td>
                    <td className="px-2 py-4" />
                  </tr>
                );
              }

              return (
                <PfeDocumentRow
                  key={row.key}
                  document={row.document}
                  onView={onView}
                  onDelete={onDelete}
                  showStudent={showStudent}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PfeDocumentTable;
