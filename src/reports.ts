import { SessionInfo } from "./sessions";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


type GroupInfo = {
  people: Set<String>,
  sessions: Array<SessionInfo>,
  totalHours: number,
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
  numberOfHours: number,
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
const setDefault = <K, V>(map: Map<K, V>, key: K, value: V): boolean => {
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
      totalHours: 0,
      people: new Set<string>(),
      sessions: [],
    });
    const groupInfo = groups.get(sessionInfo.groupName);
    if (groupInfo !== undefined) {
      groupInfo.totalHours += sessionInfo.duration;
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

  const round = (num: number): number => {
    return parseFloat(num.toFixed(1));
  }

  return {
    reportDate: new Date(),
    reportStartDate: new Date(Date.parse(startDateStr + 'CST')),
    reportEndDate: new Date(Date.parse(endDateStr + 'CST')),
    uniquePeople: people.size,
    uniqueGroups: groups.size,
    numberOfSessions: sessions.length,
    numberOfHours: totalHours,
    averageAttendance: round(totalAttendance / sessions.length),
    averageSessionDuration: round(totalHours / sessions.length),
    groups: [...groups.entries()].map(([
      groupName, {
        totalHours: totalGroupHours,
        people: groupAttendees,
        sessions: groupSessions,
      }]) => {
      const totalGroupAttendees = groupSessions.reduce((total, { participants }) => total + participants.length, 0);
      return {
        groupName,
        uniquePeople: groupAttendees.size,
        numberOfSessions: groupSessions.length,
        numberOfHours: totalGroupHours,
        averageAttendance: round(totalGroupAttendees / groupSessions.length),
        averageSessionDuration: round(totalGroupHours / groupSessions.length),
      }
    }),
    people: [...people.values()],
  };
};

const dateOptions: {
  timeZone: 'US/Central',
  day: 'numeric',
  year: 'numeric',
  month: 'long',
} = {
  timeZone: 'US/Central',
  day: 'numeric',
  year: 'numeric',
  month: 'long',
};

const timeOptions: {
  timeZone: 'US/Central',
  hour: 'numeric',
  minute: '2-digit',
} = {
  timeZone: 'US/Central',
  hour: 'numeric',
  minute: '2-digit',
};

const getFormattedDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', dateOptions);
};

const getFormattedTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', timeOptions);
};

type ReportText = {
  title: string,
  mainText: string[],
  groups: (string | string[])[][],
  attendees: string[],
};

export const getReportText = (report: ReportDataType): ReportText => {
  return {
    title: `River City Advocacy Peer Support Participants Report`,
    mainText: [
      `Generated on ${getFormattedDate(report.reportDate)} at ${getFormattedTime(report.reportDate)}`,
      `Time Period: ${getFormattedDate(report.reportStartDate)} to ${getFormattedDate(report.reportEndDate)}`,
      `Number of unique people: ${report.uniquePeople}`,
      `Number of groups: ${report.uniqueGroups} `,
      `Number of sessions: ${report.numberOfSessions} `,
      `Number of total hours: ${report.numberOfHours} `,
      `Average attendance per session: ${report.averageAttendance} `,
      `Average session duration: ${report.averageSessionDuration} hour${report.averageSessionDuration !== 1 ? 's' : ''} `,
    ],
    groups: [
      ...report.groups.map(groupInfo => [
        `${groupInfo.groupName}:`, [
          `Number of unique people: ${groupInfo.uniquePeople}`,
          `Number of sessions: ${groupInfo.numberOfSessions}`,
          `Number of total hours: ${groupInfo.numberOfHours}`,
          `Average attendance per session: ${groupInfo.averageAttendance}`,
          `Average session duration: ${groupInfo.averageSessionDuration} hour${groupInfo.averageSessionDuration !== 1 ? 's' : ''}`,
        ]
      ]),
    ],
    attendees: [
      ...report.people.map(({personName, numberOfSessions, numberOfHours}) => 
        `${personName}, ${numberOfSessions} session${numberOfSessions > 1 ? 's' : ''},  ${numberOfHours} hour${numberOfHours !== 1 ? 's' : ''}`),
    ],
  };
};