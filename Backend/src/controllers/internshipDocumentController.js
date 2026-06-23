import {
  deleteInternshipDocument,
  getAllInternshipDocuments,
  getInternshipDocuments,
  uploadInternshipDocument,
} from "../services/internshipDocumentService.js";

export const uploadDocument = async (req, res) => {
  try {
    const document = await uploadInternshipDocument(
      req.user.id,
      req.params.id,
      req.body,
      req.file,
    );

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

export const listInternshipDocuments = async (req, res) => {
  try {
    const documents = await getInternshipDocuments(
      req.user.id,
      req.user.role,
      req.params.id,
    );

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const listAllDocuments = async (req, res) => {
  try {
    const documents = await getAllInternshipDocuments();

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeDocument = async (req, res) => {
  try {
    const result = await deleteInternshipDocument(
      req.user.id,
      req.user.role,
      req.params.id,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
