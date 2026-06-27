import path from "path";

export const sanitizeFilename = (input) => {
  const filename = path.basename(String(input || ""));

  if (!filename || filename === "." || filename.includes("..")) {
    throw new Error("Chemin de fichier invalide");
  }

  return filename;
};

export const toStoredUploadPath = (filename) => `/uploads/${filename}`;

export const getMimeType = (filename) => {
  const extension = path.extname(filename).toLowerCase();

  const mimeTypes = {
    ".pdf": "application/pdf",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  return mimeTypes[extension] || "application/octet-stream";
};
