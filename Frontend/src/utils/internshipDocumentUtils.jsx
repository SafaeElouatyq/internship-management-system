export const INTERNSHIP_DOCUMENT_TYPE_LABELS = {
  CONVENTION: "Convention de stage",
  ATTESTATION: "Attestation de stage",
  OTHER: "Autre document",
};

export const INTERNSHIP_DOCUMENT_TYPE_STYLES = {
  CONVENTION: "bg-blue-50 text-blue-700",
  ATTESTATION: "bg-green-50 text-green-700",
  OTHER: "bg-slate-100 text-slate-700",
};

export const INTERNSHIP_DOCUMENT_TYPE_OPTIONS = [
  { value: "CONVENTION", label: "Convention de stage" },
  { value: "ATTESTATION", label: "Attestation de stage" },
  { value: "OTHER", label: "Autre document" },
];

export const getFileNameFromUrl = (fileUrl) => {
  if (!fileUrl) return "Document";

  const parts = fileUrl.split("/");
  const filename = parts[parts.length - 1] || "Document";
  const dashIndex = filename.indexOf("-");

  return dashIndex > -1 ? filename.slice(dashIndex + 1) : filename;
};
