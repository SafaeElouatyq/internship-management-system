import { useEffect, useState } from "react";
import CompletedInternshipTable from "../../components/departmentHead/CompletedInternshipTable";
import FinalDecisionModal from "../../components/departmentHead/FinalDecisionModal";
import {
  createFinalDecision,
  getFinalDecisions,
} from "../../services/finalDecisionService.jsx";

function DepartmentHeadFinalDecisionsPage() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [decision, setDecision] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getFinalDecisions();
      setInternships(data.internships);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const OpenModal = (internship, selectedDecision) => {
    setSelectedInternship(internship);
    setDecision(selectedDecision);
    setComment("");
    setError("");
    setSuccess("");
  };

  const CloseModal = () => {
    setSelectedInternship(null);
    setDecision("");
    setComment("");
  };

  const ChangeDecision = (e) => {
    setDecision(e.target.value);
  };

  const ChangeComment = (e) => {
    setComment(e.target.value);
  };

  const Submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createFinalDecision({
        internshipId: selectedInternship.id,
        decision,
        comment,
      });
      setSuccess("Décision enregistrée avec succès");
      CloseModal();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Stages terminés
        </h1>

        <p className="text-slate-500 mt-2">
          Autorisez ou refusez la soutenance des étudiants ayant terminé leur stage.
        </p>
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

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <CompletedInternshipTable
          internships={internships}
          onAuthorize={(internship) =>
            OpenModal(internship, "DEFENSE_AUTHORIZED")
          }
          onReject={(internship) =>
            OpenModal(internship, "DEFENSE_NOT_AUTHORIZED")
          }
        />
      )}

      {selectedInternship && (
        <FinalDecisionModal
          internship={selectedInternship}
          decision={decision}
          comment={comment}
          onDecisionChange={ChangeDecision}
          onCommentChange={ChangeComment}
          onSubmit={Submit}
          onCancel={CloseModal}
          saving={saving}
        />
      )}
    </>
  );
}

export default DepartmentHeadFinalDecisionsPage;
