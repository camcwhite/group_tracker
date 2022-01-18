import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllGroupNames, getAllSessions, SessionInfo } from "../../sessions";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import SessionForm from "../SessionForm/SessionForm";
import './SessionSearchPage.css';

const SessionSearchPage = () => {
  const [sessions, setSessions] = useState(getAllSessions());
  const [groupNameFilter, setGroupNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allGroupNames, setAllGroupNames] = useState<string[]>([]);

  const [editingSession, setEditingSession] = useState<SessionInfo | undefined>(undefined);

  useEffect(() => {
    setAllGroupNames(getAllGroupNames());
  }, [])

  const filterSessionInfo = (sessionInfo: SessionInfo) => {
    const startDateMs = startDate !== '' ? Date.parse(startDate) : 0;
    const endDateMs = endDate !== '' ? Date.parse(endDate) : 0;
    const sessionDateMs = Date.parse(sessionInfo.dateStr);
    const compareDates = startDateMs !== 0 && endDateMs !== 0;
    return sessionInfo.groupName.startsWith(groupNameFilter) &&
      (!compareDates ||
        (startDateMs <= sessionDateMs && endDateMs >= sessionDateMs))
  };

  const resetFilters = () => {
    setGroupNameFilter('');
    setStartDate('');
    setEndDate('');
  };

  const handleSave = (sessionInfo: SessionInfo): boolean => {
    return true;
  };

  const handleDelete = (sessionInfo: SessionInfo): boolean => {
    return true;
  };

  const handleBack = (): boolean => {
    setEditingSession(undefined);
    return true;
  }

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {editingSession === undefined ? (
        <motion.div
          key='search'
          className="page SessionSearchPage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .3 }}
        >
          <h2>Find a Session</h2>
          <div className="search-container">
            <p>Filter:</p>
            <SearchDropDown
              className="filter-search-drop-down"
              options={allGroupNames}
              placeholder="Group Name"
              value={groupNameFilter}
              onChange={setGroupNameFilter}
            />
          </div>
          <div className="search-container">
            <p>Date Range:</p>
            <input
              type='date'
              value={startDate}
              onChange={ev => setStartDate(ev.target.value)}
            />
            <p>to</p>
            <input
              type='date'
              value={endDate}
              onChange={ev => setEndDate(ev.target.value)}
            />
          </div>
          <button
            className='reset-filters-button'
            onClick={resetFilters}
          >
            Reset Filters
          </button>
          <div className="session-list-container">
            <div className="session-list-header">
              <p>Group Name</p>
              <p>Date</p>
              <p>Duration (hours)</p>
            </div>
            {sessions.filter(filterSessionInfo).map(sessionInfo => (
              <div
                key={sessionInfo.sessionID}
                className="button session-list-item"
                onClick={() => setEditingSession(sessionInfo)}
              >
                <p>{sessionInfo.groupName}</p>
                <p>{sessionInfo.dateStr}</p>
                <p>{sessionInfo.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key='edit'
          className="page EditSessionPage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .3, type: 'spring' }}
        >
          <h2>Edit Group Session</h2>
          <SessionForm
            sessionInfo={editingSession}
            buttons={[['Save', handleSave], ['Delete', handleDelete], ['Back', handleBack]]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionSearchPage;