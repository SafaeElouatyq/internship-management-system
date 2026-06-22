import {
  createWeeklyReport,
  getMyWeeklyReports,
  getSupervisorWeeklyReports,
  getSupervisorReportStats,
} from "../services/reportService.js";

export const createReport = async (req, res) => {
  try {
    const report = await createWeeklyReport(req.user.id, req.body);

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

export const getMyReports = async (req, res) => {
  try {
    const reports = await getMyWeeklyReports(req.user.id);

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSupervisorReports = async (req, res) => {
  try {
    const reports = await getSupervisorWeeklyReports(req.user.id);
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
