import {
  createFinalDecision,
  getFinalDecisionsForSupervisor,
  getFinalDecisionsForViewer,
  getStudentFinalDecision,
} from "../services/finalDecisionService.js";

export const getDecisions = async (req, res) => {
  try {
    const { role, id } = req.user;
    let data;

    if (role === "SUPERVISOR") {
      data = await getFinalDecisionsForSupervisor(id);
    } else if (role === "STUDENT") {
      data = await getStudentFinalDecision(id);
    } else if (role === "DEPARTMENT_HEAD" || role === "INTERNSHIP_MANAGER") {
      data = await getFinalDecisionsForViewer();
    } else {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

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
    const internship = await createFinalDecision(req.user.id, req.body);

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
