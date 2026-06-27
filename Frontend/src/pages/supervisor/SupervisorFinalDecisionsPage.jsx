import { useEffect, useState } from "react";
import CompletedInternshipTable from "../../components/finalDecisions/CompletedInternshipTable";
import FinalDecisionModal from "../../components/finalDecisions/FinalDecisionModal";
import FinalDecisionViewModal from "../../components/finalDecisions/FinalDecisionViewModal";
import {
  createFinalDecision,
  getFinalDecisions,
} from "../../services/finalDecisionService.jsx";

function SupervisorFinalDecisionsPage() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [viewInternship, setViewInternship] = useState(null);
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
      setError("");
    } catch (loadError) {
      setError(
        loadError.response?.data?.message || "Erreur lors du chargement",
      );
    } finally {
      setLoading(false);
    }
  };

  const OpenModal = (internship) => {
    setSelectedInternship(internship);
    setDecision("");
    setComment("");
    setError("");
  };

  const CloseModal = () => {
    setSelectedInternship(null);
    setDecision("");
    setComment("");
  };

  const Submit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Le commentaire est obligatoire");
      return;
    }

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
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Erreur lors de l'enregistrement",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Décisions finales
        </h1>

        <p className="text-slate-500 mt-2">
          Prenez la décision finale de soutenance pour vos étudiants dont le
          stage est prêt pour défense.
        </p>
      </div>

      {error && !selectedInternship && (
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
          onDecide={OpenModal}
          onView={setViewInternship}
        />
      )}

      {selectedInternship && (
        <FinalDecisionModal
          internship={selectedInternship}
          decision={decision}
          comment={comment}
          onDecisionChange={(event) => setDecision(event.target.value)}
          onCommentChange={(event) => setComment(event.target.value)}
          onSubmit={Submit}
          onCancel={CloseModal}
          saving={saving}
          error={error}
        />
      )}

      {viewInternship && (
        <FinalDecisionViewModal
          internship={viewInternship}
          onClose={() => setViewInternship(null)}
        />
      )}
    </>
  );
}

export default SupervisorFinalDecisionsPage;
