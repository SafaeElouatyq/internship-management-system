const TIMEZONE = "Africa/Casablanca";

const WEEKDAY_MAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getPart = (parts, type) => parts.find((part) => part.type === type)?.value;

export const getCasablancaDateTime = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);

  return {
    year: Number(getPart(parts, "year")),
    month: Number(getPart(parts, "month")),
    day: Number(getPart(parts, "day")),
    hour: Number(getPart(parts, "hour")),
    minute: Number(getPart(parts, "minute")),
    second: Number(getPart(parts, "second")),
    dayOfWeek: WEEKDAY_MAP[getPart(parts, "weekday")],
  };
};

export const toDateKey = ({ year, month, day }) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const dateKeyToDate = (dateKey) => new Date(`${dateKey}T12:00:00.000Z`);

export const addDaysToDateKey = (dateKey, days) => {
  const date = dateKeyToDate(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const formatWeekLabel = (dateKey) => {
  const start = dateKeyToDate(dateKey);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
};

export const getSubmissionContext = (date = new Date()) => {
  const casablanca = getCasablancaDateTime(date);
  const dateKey = toDateKey(casablanca);
  const minutesSinceMidnight =
    casablanca.hour * 60 + casablanca.minute + casablanca.second / 60;
  const saturdayOpenMinutes = 19 * 60;
  const mondayCloseMinutes = 10 * 60;

  if (casablanca.dayOfWeek === 6) {
    if (minutesSinceMidnight >= saturdayOpenMinutes) {
      return {
        weekStartDate: addDaysToDateKey(dateKey, -5),
        windowType: "ON_TIME",
        canCreate: true,
        canEdit: true,
      };
    }

    return {
      weekStartDate: addDaysToDateKey(dateKey, -12),
      windowType: "LATE",
      canCreate: true,
      canEdit: false,
    };
  }

  if (casablanca.dayOfWeek === 0) {
    return {
      weekStartDate: addDaysToDateKey(dateKey, -6),
      windowType: "ON_TIME",
      canCreate: true,
      canEdit: true,
    };
  }

  if (casablanca.dayOfWeek === 1) {
    const weekStartDate = addDaysToDateKey(dateKey, -7);

    if (minutesSinceMidnight < mondayCloseMinutes) {
      return {
        weekStartDate,
        windowType: "ON_TIME",
        canCreate: true,
        canEdit: true,
      };
    }

    return {
      weekStartDate,
      windowType: "LATE",
      canCreate: true,
      canEdit: false,
    };
  }

  const daysFromMonday = casablanca.dayOfWeek - 1;
  const currentMonday = addDaysToDateKey(dateKey, -daysFromMonday);

  return {
    weekStartDate: addDaysToDateKey(currentMonday, -7),
    windowType: "LATE",
    canCreate: true,
    canEdit: false,
  };
};

export const isWeekSubmissionClosed = (weekStartDate, date = new Date()) => {
  const context = getSubmissionContext(date);
  const currentWeekStart = context.weekStartDate;

  if (weekStartDate < currentWeekStart) {
    return true;
  }

  if (weekStartDate > currentWeekStart) {
    return false;
  }

  return context.windowType === "CLOSED";
};

export const getReportStatusForSubmission = (windowType) =>
  windowType === "ON_TIME" ? "SUBMITTED_ON_TIME" : "SUBMITTED_LATE";

export const canModifyReport = (reportWeekStartDate, date = new Date()) => {
  const context = getSubmissionContext(date);

  return (
    context.canEdit && context.weekStartDate === reportWeekStartDate.slice(0, 10)
  );
};

export const canCreateReportForWeek = (weekStartDate, date = new Date()) => {
  const context = getSubmissionContext(date);

  return context.canCreate && context.weekStartDate === weekStartDate.slice(0, 10);
};

export const getMissingWeeks = (internshipStartDate, existingWeekStartDates, date = new Date()) => {
  const context = getSubmissionContext(date);
  const missingWeeks = [];
  const existing = new Set(existingWeekStartDates.map((value) => value.slice(0, 10)));

  let weekCursor = getFirstReportingWeekStart(internshipStartDate);
  const lastClosedWeek = getLastClosedWeekStart(context.weekStartDate, context, date);

  while (weekCursor <= lastClosedWeek) {
    if (!existing.has(weekCursor)) {
      missingWeeks.push({
        weekStartDate: weekCursor,
        weekLabel: formatWeekLabel(weekCursor),
        status: "MISSING",
      });
    }

    weekCursor = addDaysToDateKey(weekCursor, 7);
  }

  return missingWeeks;
};

const getFirstReportingWeekStart = (internshipStartDate) => {
  const start = new Date(internshipStartDate);
  const casablanca = getCasablancaDateTime(start);
  const dateKey = toDateKey(casablanca);
  const daysFromMonday = (casablanca.dayOfWeek + 6) % 7;
  return addDaysToDateKey(dateKey, -daysFromMonday);
};

const getLastClosedWeekStart = (currentWeekStartDate, context, date = new Date()) => {
  if (context.windowType === "LATE") {
    return addDaysToDateKey(currentWeekStartDate, -7);
  }

  if (context.windowType === "ON_TIME") {
    const casablanca = getCasablancaDateTime(date);

    if (casablanca.dayOfWeek === 6) {
      const minutesSinceMidnight =
        casablanca.hour * 60 + casablanca.minute + casablanca.second / 60;

      if (minutesSinceMidnight >= 19 * 60) {
        return addDaysToDateKey(currentWeekStartDate, -7);
      }
    }

    return addDaysToDateKey(currentWeekStartDate, -7);
  }

  return addDaysToDateKey(currentWeekStartDate, -7);
};

export const getSubmissionWindowMessage = (context) => {
  if (context.windowType === "ON_TIME") {
    return "Fenêtre ouverte : du samedi 19h00 au lundi 10h00 (heure du Maroc).";
  }

  return "Soumission en retard autorisée jusqu'au samedi 19h00 (heure du Maroc).";
};

export const normalizeWeekStartDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};
