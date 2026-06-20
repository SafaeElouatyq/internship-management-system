import { CheckCircle, XCircle, X } from "lucide-react";

function Alert({ message, type, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right">
      <div
        className={`min-w-[330px] rounded-2xl shadow-lg border p-4 flex items-start justify-between
        ${
          type === "success"
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex gap-3">
          {type === "success" ? (
            <CheckCircle className="text-green-600 mt-0.5" size={22} />
          ) : (
            <XCircle className="text-red-600 mt-0.5" size={22} />
          )}

          <div>
            <p className="font-semibold text-slate-800">
              {type === "success" ? "Succès" : "Erreur"}
            </p>

            <p className="text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>

        <button onClick={onClose}>
          <X size={18} className="text-slate-400 hover:text-slate-700" />
        </button>
      </div>
    </div>
  );
}

export default Alert;