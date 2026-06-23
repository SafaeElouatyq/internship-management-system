import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const allowedMimes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Seuls les fichiers PDF et DOCX sont acceptés"));
};

export const uploadDocument = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const reportAttachmentMimes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

const reportAttachmentFilter = (req, file, cb) => {
  if (reportAttachmentMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Seuls les fichiers PDF, DOCX et images sont acceptés"));
};

export const uploadReportAttachments = multer({
  storage,
  fileFilter: reportAttachmentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

const pfeDocumentMimes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const pfeDocumentFilter = (req, file, cb) => {
  if (pfeDocumentMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Seuls les fichiers PDF, DOCX et PPTX sont acceptés"));
};

export const uploadPfeDocument = multer({
  storage,
  fileFilter: pfeDocumentFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

export { uploadDir };
