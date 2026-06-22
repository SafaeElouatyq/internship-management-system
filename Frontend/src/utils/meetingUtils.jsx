export const typeLabels = {
  PRESENTIAL: "Présentiel",
  REMOTE: "Distanciel",
};

export const getMeetingStatus = (date) => {
  const meetingDate = new Date(date);
  const now = new Date();

  return meetingDate > now ? "À venir" : "Terminée";
};

export const getStatusClass = (date) => {
  const meetingDate = new Date(date);
  const now = new Date();

  return meetingDate > now
    ? "bg-amber-50 text-amber-700"
    : "bg-green-50 text-green-700";
};
