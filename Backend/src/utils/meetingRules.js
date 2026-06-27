export const MIN_MEETINGS_BY_LEVEL = {
  LICENCE: 3,
  MASTER: 5,
  ENGINEER: 5,
};

export const getMinimumMeetings = (level) =>
  MIN_MEETINGS_BY_LEVEL[level] || null;

export const getMeetingSequenceLabel = (sequenceNumber) =>
  `Rencontre ${sequenceNumber}`;

export const sortMeetingsBySequence = (meetings = []) =>
  [...meetings].sort((left, right) => left.id - right.id);

export const enrichMeetingsWithSequence = (meetings = []) => {
  const sorted = sortMeetingsBySequence(meetings);
  const sequenceById = new Map(
    sorted.map((meeting, index) => [meeting.id, index + 1]),
  );

  return meetings.map((meeting) => {
    const sequenceNumber = sequenceById.get(meeting.id);

    return {
      ...meeting,
      sequenceNumber,
      sequenceLabel: getMeetingSequenceLabel(sequenceNumber),
    };
  });
};

export const buildMeetingContext = (internship, meetings = []) => {
  const sorted = sortMeetingsBySequence(meetings);
  const meetingCount = sorted.length;
  const minimumRequired = getMinimumMeetings(internship?.student?.level);
  const nextSequenceNumber =
    minimumRequired && meetingCount < minimumRequired
      ? meetingCount + 1
      : null;

  const completedSequences = sorted.map((_, index) => index + 1);

  return {
    minimumRequired,
    meetingCount,
    completedSequences,
    nextSequenceNumber,
    nextSequenceLabel: nextSequenceNumber
      ? getMeetingSequenceLabel(nextSequenceNumber)
      : null,
    canCreateNext: Boolean(nextSequenceNumber),
    isCompliant: !minimumRequired || meetingCount >= minimumRequired,
    remaining: minimumRequired
      ? Math.max(0, minimumRequired - meetingCount)
      : 0,
  };
};

export const getLicenceMeetingCompliance = (meetingCount) => ({
  minimumRequired: MIN_MEETINGS_BY_LEVEL.LICENCE,
  meetingCount,
  isCompliant: meetingCount >= MIN_MEETINGS_BY_LEVEL.LICENCE,
  remaining: Math.max(0, MIN_MEETINGS_BY_LEVEL.LICENCE - meetingCount),
});

export const assertCanCreateMeeting = (internship, existingCount) => {
  const minimumRequired = getMinimumMeetings(internship?.student?.level);
  const nextSequenceNumber = existingCount + 1;

  if (minimumRequired && existingCount >= minimumRequired) {
    throw new Error(
      `Le quota de ${minimumRequired} rencontre(s) obligatoire(s) est déjà atteint pour cet étudiant`,
    );
  }

  return {
    nextSequenceNumber,
    nextSequenceLabel: getMeetingSequenceLabel(nextSequenceNumber),
  };
};
