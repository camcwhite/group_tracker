import PDFGenerator from "pdfkit";
import { SessionInfo } from "./sessions";

type GroupInfo = {
  people: Set<String>,
  sessions: Array<SessionInfo>,
};

type GroupReportType = {
  groupName: string,
  uniquePeople: number,
  numberOfSessions: number,
  numberOfHours: number,
  averageAttendance: number,
  averageSessionDuration: number,
};

type PersonReportType = {
  personName: string,
  numberOfSessions: number,
  numberOfHours: number, 
};

type ReportDataType = {
  reportDate: Date,
  reportStartDate: Date,
  reportEndDate: Date,
  uniquePeople: number,
  uniqueGroups: number,
  numberOfSessions: number,
  averageAttendance: number,
  averageSessionDuration: number,
  groups: GroupReportType[],
  people: PersonReportType[],
};

/**
 * Set a default value for a key in a map.
 * 
 * @param map a map
 * @param key a key 
 * @param value a default value 
 * @returns true iff a new key was added to the map 
 */
const setDefault = <K, V> (map: Map<K, V>, key: K, value: V): boolean => {
  if (map.has(key)) {
    return false;
  }
  map.set(key, value);
  return true;
};

/**
 * Generate a report.
 * 
 * @param sessions an Array of sessions to create the report from
 * @returns a report object
 */
export const generateReport = (sessions: SessionInfo[], startDateStr: string, endDateStr: string): ReportDataType => {
  const people = new Map<string, PersonReportType>();
  const groups = new Map<string, GroupInfo>();
  let totalAttendance = 0;
  let totalHours = 0;

  sessions.forEach(sessionInfo => {
    totalAttendance += sessionInfo.participants.length;
    totalHours += sessionInfo.duration;
    setDefault(groups, sessionInfo.groupName, {
      people: new Set<string>(),
      sessions: [],
    });
    const groupInfo = groups.get(sessionInfo.groupName);
    if (groupInfo !== undefined) {
      sessionInfo.participants.forEach(person => groupInfo.people.add(person));
      groupInfo.sessions = groupInfo.sessions.concat(sessionInfo);
    } 

    sessionInfo.participants.forEach(person => {
      setDefault(people, person, {
        personName: person,
        numberOfSessions: 0,
        numberOfHours: 0, 
      });
      const personInfo = people.get(person);
      if (personInfo) {
        personInfo.numberOfSessions++;
        personInfo.numberOfHours += sessionInfo.duration;
      }
    })
  });

  return {
    reportDate: new Date(),
    reportStartDate: new Date(Date.parse(startDateStr)),
    reportEndDate: new Date(Date.parse(endDateStr)),
    uniquePeople: people.size,
    uniqueGroups: groups.size,
    numberOfSessions: sessions.length,
    averageAttendance: totalAttendance / sessions.length,
    averageSessionDuration: totalHours / sessions.length,
    groups: [...groups.entries()].map(([groupName, {people:groupAttendees, sessions: groupSessions}]) => {
      const totalHours = groupSessions.reduce((total, {duration}) => total + duration, 0);
      const totalGroupAttendees = groupSessions.reduce((total, {participants}) => total + participants.length, 0);
      return {
        groupName,
        uniquePeople: groupAttendees.size,
        numberOfSessions: groupSessions.length,
        numberOfHours: totalHours, 
        averageAttendance: totalGroupAttendees / groupSessions.length,
        averageSessionDuration: totalHours / groupSessions.length,
    }}),
    people: [...people.values()],
  };

};