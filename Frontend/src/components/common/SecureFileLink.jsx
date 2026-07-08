import { useState } from "react";
import { openSecureFile } from "../../services/fileService.jsx";

function SecureFileLink({
  filePath,
  displayName,
  children,
  className = "",
  title,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Open = async (event) => {
    event.preventDefault();

    if (!filePath || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await openSecureFile(filePath, displayName);
    } catch (openError) {
      setError(
        openError.response?.data?.message ||
          openError.message ||
          "Impossible d'ouvrir le fichier",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={Open}
        disabled={loading || !filePath}
        className={className}
        title={title}
      >
        {loading ? "Ouverture..." : children}
      </button>

      {error && (
        <span className="text-xs text-red-600 mt-1">{error}</span>
      )}
    </span>
  );
}

export default SecureFileLink;
