import { storeGet, storeSet, STORE_KEYS } from "./store";
import { v4 as uuid } from "uuid";

/**
 * Get the current date as a string
 * 
 * @returns the current date in YYYY-MM-DD
 */
export const getTodayStr = () => {
  const today = new Date();
  const year = today.getFullYear();
  const raw_month = today.getMonth() + 1;
  const month = raw_month >= 10 ? `${raw_month}` : `0${raw_month}`;
  const raw_day = today.getDate();
  const day = raw_day >= 10 ? `${raw_day}` : `0${raw_day}`;
  return `${year}-${month}-${day}`;
}

export type SessionInfo = {
  sessionID: string,
  groupName: string,
  dateStr: string,
  duration: number,
  participants: string[],
};

export const EMPTY_SESSION: SessionInfo = {
  sessionID: '',
  groupName: '',
  dateStr: getTodayStr(),
  duration: 1,
  participants: [],
};

export const getSession = (sessionID: string): SessionInfo => {
  return getAllSessions().find(sessionInfo => sessionInfo.sessionID === sessionID) ?? EMPTY_SESSION;
};

export const getAllSessions = (): SessionInfo[] => {
  return storeGet(STORE_KEYS.SESSIONS) as SessionInfo[];
};

export const getAllGroupNames = (): string[] => {
  return storeGet(STORE_KEYS.GROUP_NAMES) as string[];
};

export const getAllParticipantNames = (): string[] => {
  return storeGet(STORE_KEYS.PARTICIPANT_NAMES) as string[];
};

export const saveSession = (session: SessionInfo): void => {
  if (session.sessionID === '') {
    session.sessionID = uuid();
  }
  const sessions = getAllSessions();

  const groupNames = getAllGroupNames();
  if (!groupNames.includes(session.groupName)) {
    storeSet(STORE_KEYS.GROUP_NAMES, groupNames.concat(session.groupName))
  }

  const participantNames = getAllParticipantNames();
  session.participants.forEach(participant => {
    if (!participantNames.includes(participant)) {
      storeSet(STORE_KEYS.PARTICIPANT_NAMES, participantNames.concat(participant));
    }
  })
  console.log(storeGet(STORE_KEYS.PARTICIPANT_NAMES));

  return storeSet(STORE_KEYS.SESSIONS, sessions.concat(session));
};

export const deleteSession = (sessionID: string): void => {
  const sessions = getAllSessions().filter(sessionInfo => sessionInfo.sessionID !== sessionID);

  storeSet(STORE_KEYS.GROUP_NAMES, sessions.map(({ groupName }) => groupName));
  storeSet(STORE_KEYS.PARTICIPANT_NAMES, sessions.flatMap(({participants}) => participants));

  storeSet(STORE_KEYS.SESSIONS, sessions)
};