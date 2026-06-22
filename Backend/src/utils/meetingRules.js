export const MIN_MEETINGS_BY_LEVEL = {
  LICENCE: 3,
  MASTER: 5,
  ENGINEER: 5,
};

export const getMinimumMeetings = (level) =>
  MIN_MEETINGS_BY_LEVEL[level] || null;

export const getLicenceMeetingCompliance = (meetingCount) => ({
  minimumRequired: MIN_MEETINGS_BY_LEVEL.LICENCE,
  meetingCount,
  isCompliant: meetingCount >= MIN_MEETINGS_BY_LEVEL.LICENCE,
  remaining: Math.max(0, MIN_MEETINGS_BY_LEVEL.LICENCE - meetingCount),
});
