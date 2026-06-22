import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FirstMeetingForm from "../../components/supervisor/FirstMeetingForm";
import SubjectValidationForm from "../../components/supervisor/SubjectValidationForm";
import SubjectValidationHistory from "../../components/supervisor/SubjectValidationHistory";
import { getDocumentUrl } from "../../services/documentService.jsx";
import { createMeeting } from "../../services/supervisorMeetingService.jsx";
import {
  getAssignedInternship,
  validateSubject,
} from "../../services/supervisorInternshipService.jsx";
import { statusLabels } from "../../utils/internshipUtils.jsx";
import {
  canScheduleFirstMeeting,
  canValidateSubject,
} from "../../utils/subjectValidationUtils.jsx";

const levelLabels = {
  LICENCE: "Licence",
  MASTER: "Master",
  ENGINEER: "Ingénieur",
};

const meetingTypeLabels = {
  PRESENTIAL: "Présentiel",
  REMOTE: "Distanciel",
};

const initialMeetingForm = {
  date: "",
  type: "",
  summary: "",
};

const initialValidationForm = {
  decision: "",
  comment: "",
  reformulatedTitle: "",
};

function SupervisorInternshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [meetingForm, setMeetingForm] = useState(initialMeetingForm);
  const [validationForm, setValidationForm] = useState(initialValidationForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInternship = async () => {
    try {
      const data = await getAssignedInternship(id);
      setInternship(data);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternship();
  }, [id]);

  const MeetingChange = (event) => {
    setMeetingForm({
      ...meetingForm,
      [event.target.name]: event.target.value,
    });
  };

  const ValidationChange = (event) => {
    setValidationForm({
      ...validationForm,
      [event.target.name]: event.target.value,
    });
  };

  const SubmitFirstMeeting = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createMeeting({
        internshipId: id,
        ...meetingForm,
      });
      setMeetingForm(initialMeetingForm);
      setSuccess("Première réunion planifiée avec succès");
      await loadInternship();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la planification de la réunion",
      );
    } finally {
      setSaving(false);
    }
  };

  const SubmitValidation = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await validateSubject(id, validationForm);
      setInternship(response.internship);
      setValidationForm(initialValidationForm);
      setSuccess("Décision enregistrée avec succès");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement de la décision",
      );
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
        Stage introuvable.
      </div>
    );
  }

  const student = internship.student?.user;
  const company = internship.company;
  const documents = internship.documents || [];
  const meetings = internship.meetings || [];
  const validations = internship.subjectValidations || [];
  const showFirstMeetingForm = canScheduleFirstMeeting(internship);
  const showValidationForm = canValidateSubject(internship);

  return (
    <>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Détail du stage
          </h1>

          <p className="text-slate-500 mt-2">
            Consultez le dossier, planifiez la première réunion et validez le
            sujet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/supervisor/students")}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
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
              <p className="text-sm text-slate-500">Statut</p>
              <p className="font-medium">
                {statusLabels[internship.status] || internship.status || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Encadrant professionnel</p>
              <p className="font-medium">
                {internship.professionalSupervisor || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Période</p>
              <p className="font-medium">
                {internship.startDate?.slice(0, 10)} —{" "}
                {internship.endDate?.slice(0, 10)}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Description</p>
              <p className="font-medium">{internship.description || "-"}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 xl:col-span-2">
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
                    href={getDocumentUrl(document.path)}
                    target="_blank"
                    rel="noreferrer"
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
      </div>

      {showFirstMeetingForm && (
        <div className="mb-6">
          <FirstMeetingForm
            formData={meetingForm}
            onChange={MeetingChange}
            onSubmit={SubmitFirstMeeting}
            saving={saving}
          />
        </div>
      )}

      {meetings.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Réunions
          </h2>

          <div className="space-y-3">
            {meetings.map((meeting, index) => (
              <div
                key={meeting.id}
                className="border border-slate-200 rounded-xl px-4 py-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-medium text-slate-800">
                    {index === 0 ? "Première réunion" : `Réunion ${index + 1}`}
                  </p>

                  <p className="text-sm text-slate-500">
                    {meeting.date?.slice(0, 16).replace("T", " ")}
                  </p>
                </div>

                <p className="text-sm text-slate-600 mt-2">
                  Type : {meetingTypeLabels[meeting.type] || meeting.type}
                </p>

                {meeting.summary && (
                  <p className="text-sm text-slate-600 mt-2">
                    {meeting.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 mb-6">
        <SubjectValidationForm
          formData={validationForm}
          onChange={ValidationChange}
          onSubmit={SubmitValidation}
          saving={saving}
          disabled={!showValidationForm}
        />

        <SubjectValidationHistory validations={validations} />
      </div>
    </>
  );
}

export default SupervisorInternshipDetailPage;
