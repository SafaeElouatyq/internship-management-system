import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInternship,
  rejectInternship,
  validateInternship,
} from "../../services/internshipManagerService.jsx";

const statusLabels = {
  DECLARED: "Déclaré",
  ADMIN_PENDING: "En attente",
  ADMIN_VALIDATED: "Stage validé",
  SUPERVISOR_ASSIGNED: "Encadrant affecté",
  SUBJECT_PENDING: "Sujet en attente",
  SUBJECT_VALIDATED: "Sujet validé",
  IN_PROGRESS: "En cours",
  REPORT_LATE: "Rapport en retard",
  REPORT_WRITING: "Rédaction du rapport",
  READY_FOR_DEFENSE: "Prêt pour soutenance",
  DEFENSE_AUTHORIZED: "Soutenance autorisée",
  DEFENSE_NOT_AUTHORIZED: "Soutenance non autorisée",
  CLOSED: "Clôturé",
};

const levelLabels = {
  LICENCE: "Licence",
  MASTER: "Master",
  ENGINEER: "Ingénieur",
};

const canManageInternship = (internship) =>
  ["DECLARED", "ADMIN_PENDING"].includes(internship.status) &&
  internship.administrativeStatus !== "REJECTED";

function InternshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    getInternship(id)
      .then((data) => {
        if (active) setInternship(data);
      })
      .catch((error) => {
        if (active) {
          setError(error.response?.data?.message || "Erreur lors du chargement");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const Validate = async () => {
    const confirmValidate = window.confirm("Valider ce stage ?");

    if (!confirmValidate) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await validateInternship(id);
      setInternship(response.internship);
      setSuccess("Stage validé avec succès");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la validation");
    } finally {
      setSaving(false);
    }
  };

  const Reject = async () => {
    const confirmReject = window.confirm("Refuser ce stage ?");

    if (!confirmReject) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await rejectInternship(id);
      setInternship(response.internship);
      setSuccess("Stage refusé avec succès");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du refus");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        Chargement...
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        Déclaration introuvable.
      </div>
    );
  }

  const student = internship.student?.user;
  const company = internship.company;
  const documents = internship.documents || [];
  const canManage = canManageInternship(internship);

  return (
    <>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Détail déclaration
          </h1>

          <p className="text-slate-500 mt-2">
            Consultez le dossier complet avant validation du stage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/internships")}
          className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-3 rounded-xl font-medium"
        >
          Retour
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Informations étudiant
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700">
            <div>
              <p className="text-sm text-slate-500">Nom</p>
              <p className="font-medium">{student?.lastName || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Prénom</p>
              <p className="font-medium">{student?.firstName || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{student?.email || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Niveau</p>
              <p className="font-medium">
                {levelLabels[internship.student?.level] ||
                  internship.student?.level ||
                  "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Informations entreprise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700">
            <div>
              <p className="text-sm text-slate-500">Nom</p>
              <p className="font-medium">{company?.name || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Adresse</p>
              <p className="font-medium">{company?.address || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Téléphone</p>
              <p className="font-medium">{company?.phone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{company?.email || "-"}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 xl:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Informations stage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700">
            <div>
              <p className="text-sm text-slate-500">Sujet</p>
              <p className="font-medium">{internship.title || "-"}</p>
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
                {internship.startDate?.slice(0, 10) || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Date fin</p>
              <p className="font-medium">
                {internship.endDate?.slice(0, 10) || "-"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Description</p>
              <p className="font-medium">{internship.description || "-"}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Documents
          </h2>

          {documents.length ? (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {document.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {document.type || "Document"}
                    </p>
                  </div>

                  <a
                    href={document.path}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ouvrir
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Aucun document disponible.</p>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Historique
          </h2>

          <div className="grid grid-cols-1 gap-5 text-slate-700">
            <div>
              <p className="text-sm text-slate-500">Date création</p>
              <p className="font-medium">
                {internship.createdAt?.slice(0, 10) || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Dernière mise à jour</p>
              <p className="font-medium">
                {internship.updatedAt?.slice(0, 10) || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Statut actuel</p>
              <p className="font-medium">
                {statusLabels[internship.status] || internship.status || "-"}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={Validate}
          disabled={saving || !canManage}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-60"
        >
          Valider le stage
        </button>

        <button
          type="button"
          onClick={Reject}
          disabled={saving || !canManage}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-60"
        >
          Refuser le stage
        </button>
      </div>
    </>
  );
}

export default InternshipDetailPage;
