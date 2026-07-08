import { getMinimumMeetings } from "./meetingRules.js";

export const SUBJECT_VALIDATED_STATUSES = [
  "SUBJECT_VALIDATED",
  "IN_PROGRESS",
  "REPORT_LATE",
  "REPORT_WRITING",
  "READY_FOR_DEFENSE",
];

export const DECIDED_STATUSES = [
  "DEFENSE_AUTHORIZED",
  "DEFENSE_NOT_AUTHORIZED",
  "CLOSED",
];

export const FINAL_DECISION_LIST_STATUSES = [
  ...SUBJECT_VALIDATED_STATUSES,
  ...DECIDED_STATUSES,
];

export const isAdministrativelyValidated = (internship) =>
  internship.administrativeStatus === "COMPLETE";

export const isSubjectValidated = (internship) =>
  SUBJECT_VALIDATED_STATUSES.includes(internship.status) ||
  DECIDED_STATUSES.includes(internship.status);

export const areMeetingsCompleted = (meetings = []) => {
  if (!meetings.length) {
    return false;
  }

  const now = new Date();

  return meetings.every((meeting) => new Date(meeting.date) <= now);
};

export const getFinalDecisionEligibility = (internship, meetings = []) => {
  const minimumMeetingsRequired = getMinimumMeetings(internship.student?.level);
  const meetingCount = meetings.length;
  const meetingsScheduled =
    !minimumMeetingsRequired || meetingCount >= minimumMeetingsRequired;
  const meetingsCompleted = areMeetingsCompleted(meetings);
  const adminValidated = isAdministrativelyValidated(internship);
  const subjectValidated = isSubjectValidated(internship);
  const hasDecision = Boolean(internship.finalDecision);

  const canDecide =
    !hasDecision &&
    adminValidated &&
    subjectValidated &&
    meetingsScheduled &&
    meetingsCompleted;

  return {
    minimumMeetingsRequired,
    meetingCount,
    meetingsScheduled,
    meetingsCompleted,
    meetingsCompliant: meetingsScheduled && meetingsCompleted,
    adminValidated,
    subjectValidated,
    canDecide,
  };
};

export const assertCanCreateFinalDecision = (internship, meetings = []) => {
  const eligibility = getFinalDecisionEligibility(internship, meetings);

  if (internship.finalDecision) {
    throw new Error("Une décision finale existe déjà pour ce stage");
  }

  if (!eligibility.adminValidated) {
    throw new Error(
      "Décision finale impossible : le dossier administratif n'est pas encore validé",
    );
  }

  if (!eligibility.subjectValidated) {
    throw new Error(
      "Décision finale impossible : le sujet du stage n'est pas encore validé",
    );
  }

  if (!eligibility.meetingsScheduled) {
    const remaining =
      eligibility.minimumMeetingsRequired - eligibility.meetingCount;
    throw new Error(
      `Décision finale impossible : ${eligibility.minimumMeetingsRequired} rencontre(s) obligatoire(s) requise(s) (${eligibility.meetingCount}/${eligibility.minimumMeetingsRequired} planifiée(s)). Il manque encore ${remaining} rencontre(s).`,
    );
  }

  if (!eligibility.meetingsCompleted) {
    throw new Error(
      "Décision finale impossible : toutes les rencontres obligatoires doivent être terminées avant de prendre la décision",
    );
  }

  return eligibility;
};
