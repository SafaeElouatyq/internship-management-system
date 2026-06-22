import {
  uploadDocument as saveDocument,
  getMyDocuments,
  getAllDocuments,
  deleteDocument as removeDocument,
} from "../services/documentService.js";

export const createDocument = async (req, res) => {
  try {
    const document = await saveDocument(req.user.id, req.body, req.file);

    res.status(201).json({
      message: "Document téléversé avec succès",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents =
      req.user.role === "INTERNSHIP_MANAGER"
        ? await getAllDocuments()
        : await getMyDocuments(req.user.id);

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await removeDocument(req.params.id, req.user.id);

    res.status(200).json({
      message: "Document supprimé avec succès",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
