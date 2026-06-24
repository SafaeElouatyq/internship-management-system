import ReportStatusBadge from "./ReportStatusBadge";
import { getReportAttachmentUrl } from "../../utils/reportUtils.jsx";

function ReportDetailsModal({
  report,
  onClose,
  showSupervisorComment = false,
  supervisorComment = "",
  onCommentChange,
  onCommentSubmit,
  savingComment = false,
  commentError = "",
}) {
  const student = report.internship?.student?.user;
  const attachments = report.attachments || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Rapport hebdomadaire
            </h2>

            <p className="text-slate-500 mt-1">
              {student
                ? `${student.firstName} ${student.lastName} — `
                : ""}
              {report.weekLabel || report.weekStartDate || report.submittedAt?.slice(0, 10)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>

        <div className="mb-6">
          <ReportStatusBadge status={report.status} />
        </div>

        <div className="space-y-5 text-slate-700">
          <div>
            <p className="text-sm text-slate-500">Travail réalisé</p>
            <p className="font-medium mt-1">{report.completedWork}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Difficultés rencontrées</p>
            <p className="font-medium mt-1">{report.difficulties || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Plan semaine prochaine</p>
            <p className="font-medium mt-1">{report.nextWeekPlan || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Progression</p>
            <p className="font-medium mt-1">{report.progress}%</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date de soumission</p>
            <p className="font-medium mt-1">
              {report.submittedAt?.slice(0, 16).replace("T", " ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Pièces jointes</p>

            {attachments.length ? (
              <div className="mt-2 space-y-2">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={getReportAttachmentUrl(attachment.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="font-medium mt-1">-</p>
            )}
          </div>

          {!showSupervisorComment && report.supervisorComment && (
            <div>
              <p className="text-sm text-slate-500">Commentaire encadrant</p>
              <p className="font-medium mt-1 whitespace-pre-wrap">
                {report.supervisorComment}
              </p>
            </div>
          )}

          {showSupervisorComment && report.supervisorComment && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                Commentaire actuel
              </p>
              <p className="mt-2 text-slate-800 whitespace-pre-wrap">
                {report.supervisorComment}
              </p>
            </div>
          )}

          {showSupervisorComment && (
            <form onSubmit={onCommentSubmit} className="pt-2">
              <label className="block text-sm font-medium mb-2">
                {report.supervisorComment
                  ? "Nouveau commentaire"
                  : "Commentaire encadrant"}
              </label>

              {commentError && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {commentError}
                </div>
              )}

              <textarea
                value={supervisorComment}
                onChange={onCommentChange}
                rows={4}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  report.supervisorComment
                    ? "Saisissez un nouveau commentaire pour remplacer l'actuel..."
                    : "Ajoutez un commentaire pour l'étudiant..."
                }
              />

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={savingComment || !supervisorComment.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {savingComment ? "Enregistrement..." : "Enregistrer le commentaire"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportDetailsModal;
