export const typeLabels = {
  PRESENTIAL: "Présentiel",
  REMOTE: "Distanciel",
};

export const MIN_MEETINGS_LICENCE = 3;

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

export const toDateTimeLocalValue = (isoDate) => {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
};
