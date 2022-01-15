import { storeGet, storeSet } from "./store";
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

export const saveSession = async (session: SessionInfo): Promise<void> => {
  if (session.sessionID === '') {
    session.sessionID = uuid();
  }  
  return storeSet(`sessions.${session.sessionID}`, session);
};

export const getSession = async (sessionID: string): Promise<SessionInfo> => {
  return storeGet(`sessions.${sessionID}`)
};