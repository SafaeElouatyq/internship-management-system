import axios from "axios";

const API_URL = "http://localhost:5000/api/files";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const extractFilename = (storedPath) => {
  if (!storedPath) {
    return "";
  }

  return storedPath.split("/").pop();
};

export const openSecureFile = async (storedPath, displayName) => {
  const filename = extractFilename(storedPath);

  if (!filename) {
    throw new Error("Fichier introuvable");
  }

  const response = await axios.get(
    `${API_URL}/download/${encodeURIComponent(filename)}`,
    {
      ...getToken(),
      responseType: "blob",
    },
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "application/octet-stream",
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.target = "_blank";
  link.rel = "noreferrer";

  if (displayName) {
    link.download = displayName;
  }

  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};
