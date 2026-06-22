import {
  createFinalDecision,
  getFinalDecisions,
} from "../services/finalDecisionService.js";

export const getDecisions = async (req, res) => {
  try {
    const data = await getFinalDecisions();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const addDecision = async (req, res) => {
  try {
    const internship = await createFinalDecision(req.body);

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
