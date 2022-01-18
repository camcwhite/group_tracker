import { storeGet, storeSet, STORE_KEYS } from "./store";
import { v4 as uuid } from "uuid";

/**
 * Get the current date as a string
 * 
 * @returns the current date in YYYY-MM-DD
 */
export const getTodayStr = () => {
  return getDateStr(new Date());
}

/**
 * Get a date as a string
 * 
 * @returns a date in YYYY-MM-DD
 */
export const getDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const raw_month = date.getMonth() + 1;
  const month = raw_month >= 10 ? `${raw_month}` : `0${raw_month}`;
  const raw_day = date.getDate();
  const day = raw_day >= 10 ? `${raw_day}` : `0${raw_day}`;
  return `${year}-${month}-${day}`;
};

export const oneMonthAgo = (): Date => {
  const today = new Date();
  const newDate = new Date(today.getTime());
  newDate.setMonth(today.getMonth() - 1);
  return newDate;
};

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
  let sessions = getAllSessions();
  if (session.sessionID === '') {
    // generate a new unique session ID
    let goodID = false;
    while (!goodID) {
      const newSessionID = uuid();
      if (sessions.reduce((soFar, {sessionID}) => soFar && sessionID !== newSessionID, true)) {
        session.sessionID = newSessionID;
        goodID = true;
      }
    }
  }

  const groupNames = getAllGroupNames();
  storeSet(STORE_KEYS.GROUP_NAMES, [...new Set(groupNames.concat(session.groupName))]);

  const participantNames = getAllParticipantNames();
  storeSet(STORE_KEYS.PARTICIPANT_NAMES, [...new Set(participantNames.concat(session.participants))]);

  if (sessions.find(({sessionID}) => sessionID === session.sessionID) !== undefined) {
    // get rid of existing session
    sessions = sessions.filter(({sessionID}) => sessionID !== session.sessionID);
  }

  return storeSet(STORE_KEYS.SESSIONS, sessions.concat(session));
};

export const deleteSession = (sessionID: string): void => {
  const sessions = getAllSessions().filter(sessionInfo => sessionInfo.sessionID !== sessionID);

  storeSet(STORE_KEYS.GROUP_NAMES, sessions.map(({ groupName }) => groupName));
  storeSet(STORE_KEYS.PARTICIPANT_NAMES, sessions.flatMap(({participants}) => participants));

  storeSet(STORE_KEYS.SESSIONS, sessions)
};

/**
 * Get the sessions in between two dates
 * 
 * @param startDateStr the starting date as a string in YYYY-MM-DD format
 * @param endDateStr the starting date as a string in YYYY-MM-DD format
 * @returns a list of saved sessions with dates in between startDateStr and 
 *          endDateStr inclusive 
 */
export const getSessionsBetween = (startDateStr: string, endDateStr: string): SessionInfo[]  => {
  const startDate = Date.parse(startDateStr);
  const endDate = Date.parse(endDateStr);
  return getAllSessions().filter(({dateStr}) => {
    const date = Date.parse(dateStr);
    return startDate <= date && date <= endDate; 
  });
}