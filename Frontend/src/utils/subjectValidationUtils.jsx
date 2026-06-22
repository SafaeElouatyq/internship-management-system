export const subjectDecisionLabels = {
  ACCEPTED: "Accepté",
  ACCEPTED_WITH_REFORMULATION: "Accepté avec reformulation",
  NEEDS_CORRECTION: "Nécessite correction",
  REJECTED: "Rejeté",
};

export const subjectDecisionOptions = [
  { value: "ACCEPTED", label: "Accepté" },
  {
    value: "ACCEPTED_WITH_REFORMULATION",
    label: "Accepté avec reformulation",
  },
  { value: "NEEDS_CORRECTION", label: "Nécessite correction" },
  { value: "REJECTED", label: "Rejeté" },
];

export const canValidateSubject = (internship) =>
  internship.status === "SUBJECT_PENDING" && (internship.meetings?.length || 0) > 0;

export const canScheduleFirstMeeting = (internship) =>
  internship.status === "SUPERVISOR_ASSIGNED" &&
  !(internship.meetings?.length || 0);
