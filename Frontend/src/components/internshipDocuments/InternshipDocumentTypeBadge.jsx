import {
  INTERNSHIP_DOCUMENT_TYPE_LABELS,
  INTERNSHIP_DOCUMENT_TYPE_STYLES,
} from "../../utils/internshipDocumentUtils.jsx";

function InternshipDocumentTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        INTERNSHIP_DOCUMENT_TYPE_STYLES[type] || "bg-slate-100 text-slate-700"
      }`}
    >
      {INTERNSHIP_DOCUMENT_TYPE_LABELS[type] || type}
    </span>
  );
}

export default InternshipDocumentTypeBadge;
