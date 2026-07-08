import { getAuthorizedFile } from "../services/fileAccessService.js";

export const downloadFile = async (req, res) => {
  try {
    const file = await getAuthorizedFile(
      req.user.id,
      req.user.role,
      req.params.filename,
    );

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(file.displayName)}"`,
    );

    return res.sendFile(file.absolutePath);
  } catch (error) {
    console.error(error);

    const status = error.message.includes("Accès refusé") ? 403 : 404;

    return res.status(status).json({
      message: error.message,
    });
  }
};
