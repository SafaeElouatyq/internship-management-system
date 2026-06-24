import InternshipDocumentsPanel from "../internshipDocuments/InternshipDocumentsPanel";
import { getStatusLabel } from "../../utils/internshipUtils.jsx";

function StudentInternshipDetailsModal({ internship, onClose }) {
  const company = internship.company;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Détail de la déclaration
            </h2>

            <p className="text-slate-500 mt-1">
              {getStatusLabel(internship.status)}
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

        <div className="space-y-6 text-slate-700">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Stage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Sujet</p>
                <p className="font-medium">{internship.title}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Encadrant professionnel</p>
                <p className="font-medium">
                  {internship.professionalSupervisor || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Date début</p>
                <p className="font-medium">
                  {internship.startDate?.slice(0, 10)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Date fin</p>
                <p className="font-medium">
                  {internship.endDate?.slice(0, 10)}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-500">Description</p>
                <p className="font-medium">{internship.description || "-"}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Entreprise
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nom</p>
                <p className="font-medium">{company?.name || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Adresse</p>
                <p className="font-medium">{company?.address || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{company?.email || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Téléphone</p>
                <p className="font-medium">{company?.phone || "-"}</p>
              </div>
            </div>
          </section>

          <InternshipDocumentsPanel
            internshipId={internship.id}
            canUpload
            title="Documents de stage"
            description="Convention, attestation et autres documents administratifs."
          />

          <p className="text-sm text-slate-500">
            Le rapport PFE se gère dans la section « Rapport PFE ».
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentInternshipDetailsModal;
