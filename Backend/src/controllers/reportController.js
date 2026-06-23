import {
  createWeeklyReport,
  updateWeeklyReport,
  deleteWeeklyReport,
  getWeeklyReportByIdForStudent,
  getMyWeeklyReports,
  getSupervisorWeeklyReports,
  getSupervisorWeeklyReportById,
  updateSupervisorReportComment,
  getSupervisorReportStats,
} from "../services/reportService.js";

export const createReport = async (req, res) => {
  try {
    const report = await createWeeklyReport(
      req.user.id,
      req.body,
      req.files || [],
    );

    res.status(201).json({
      message: "Rapport soumis avec succès",
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await updateWeeklyReport(
      req.user.id,
      req.params.id,
      req.body,
      req.files || [],
    );

    res.status(200).json({
      message: "Rapport modifié avec succès",
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const removeReport = async (req, res) => {
  try {
    const result = await deleteWeeklyReport(req.user.id, req.params.id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyReport = async (req, res) => {
  try {
    const report = await getWeeklyReportByIdForStudent(
      req.user.id,
      req.params.id,
    );

    res.status(200).json(report);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const data = await getMyWeeklyReports(req.user.id);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorReports = async (req, res) => {
  try {
    const reports = await getSupervisorWeeklyReports(req.user.id, {
      student: req.query.student || "",
      status: req.query.status || "",
    });
    const stats = await getSupervisorReportStats(req.user.id);

    res.status(200).json({
      reports,
      stats,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorReport = async (req, res) => {
  try {
    const report = await getSupervisorWeeklyReportById(
      req.user.id,
      req.params.id,
    );

    res.status(200).json(report);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateReportComment = async (req, res) => {
  try {
    const { supervisorComment } = req.body;
    const report = await updateSupervisorReportComment(
      req.user.id,
      req.params.id,
      supervisorComment,
    );

    res.status(200).json({
      message: "Commentaire enregistré avec succès",
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};
