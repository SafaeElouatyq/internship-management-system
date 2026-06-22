import {
  createSubjectValidation,
  getSubjectValidations,
} from "../services/subjectValidationService.js";

export const validateSubject = async (req, res) => {
  try {
    const { decision, comment, reformulatedTitle } = req.body;

    const internship = await createSubjectValidation(
      req.user.id,
      req.params.id,
      {
        decision,
        comment,
        reformulatedTitle,
      },
    );

    res.status(201).json({
      message: "Décision enregistrée avec succès",
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getInternshipSubjectValidations = async (req, res) => {
  try {
    const validations = await getSubjectValidations(
      req.user.id,
      req.params.id,
    );

    res.status(200).json(validations);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
