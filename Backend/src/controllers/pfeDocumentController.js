import {
  uploadPfeDocument,
  getMyPfeDocuments,
  deletePfeDocument,
  getSupervisorPfeDocuments,
  validatePfeDocument,
  getPfeDocumentByIdForSupervisor,
} from "../services/pfeDocumentService.js";

export const createPfeDocument = async (req, res) => {
  try {
    const document = await uploadPfeDocument(req.user.id, req.body, req.file);

    res.status(201).json({
      message: "Document PFE téléversé avec succès",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyPfeDocumentsList = async (req, res) => {
  try {
    const data = await getMyPfeDocuments(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const removePfeDocument = async (req, res) => {
  try {
    const result = await deletePfeDocument(req.user.id, req.params.id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorPfeDocumentsList = async (req, res) => {
  try {
    const documents = await getSupervisorPfeDocuments(req.user.id, {
      student: req.query.student || "",
      category: req.query.category || "",
      validationStatus: req.query.validationStatus || "",
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorPfeDocument = async (req, res) => {
  try {
    const document = await getPfeDocumentByIdForSupervisor(
      req.user.id,
      req.params.id,
    );

    res.status(200).json(document);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  }
};

export const validateSupervisorPfeDocument = async (req, res) => {
  try {
    const { validationStatus, supervisorComment } = req.body;

    const document = await validatePfeDocument(
      req.user.id,
      req.params.id,
      {
        validationStatus,
        supervisorComment,
      },
    );

    res.status(200).json({
      message: "Validation enregistrée avec succès",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
