import React, { useEffect, useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import { EMPTY_SESSION, SessionInfo, getSession } from "../../sessions";
import './SessionForm.css';
import { AnimatePresence, motion } from "framer-motion";

const groupNameSuggestions = [
  'A',
  'ABC',
  'BC',
  'BAC',
];

const participantSuggestions = [
  'A',
  'ABaaC',
  'BC',
  'BA123C',
];

/**
 * sessionInfo: the session info to populate the form with
 * buttons: an array of tuples, each indicating the text to display
 *          on a button and a function that is called when the button 
 *          is pressed and returns true if the form should be cleared
 */
type SessionFormProps = {
  sessionInfo: SessionInfo,
  buttons: Array<[string, (sessionInfo: SessionInfo) => boolean]>,
};

const SessionForm = ({ sessionInfo, buttons }: SessionFormProps) => {
  // form state
  const [groupName, setGroupName] = useState(sessionInfo.groupName);
  // date
  const [dateStr, setDateStr] = useState(sessionInfo.dateStr);

  const [duration, setDuration] = useState(sessionInfo.duration);

  const getParticipantObjects = () => {
    return sessionInfo.participants.map((name, index) => {
      return { name, id: index + 1 }
    })
  }

  const [participants, setParticipants] = useState<{ name: string, id: number }[]>(getParticipantObjects());

  const [idCounter, setIDCounter] = useState(sessionInfo.participants.length + 1);

  const [currentParticipant, setCurrentParticipant] = useState('');

  const addParticipant = (name: string) => {
    if (name.length !== 0) {
      setCurrentParticipant('');
      setParticipants([{ name, id: idCounter }, ...participants]);
      setIDCounter(idCounter + 1);
    }
  };

  const getSessionInfo = (): SessionInfo => {
    return {
      sessionID: sessionInfo.sessionID,
      groupName,
      dateStr,
      duration,
      participants: participants.map(({ name }) => name),
    };
  };

  const clearForm = () => {
    setGroupName(sessionInfo.groupName);
    setDateStr(sessionInfo.dateStr);
    setDuration(sessionInfo.duration);
    setParticipants(getParticipantObjects());
  }

  const handleKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      addParticipant(currentParticipant);
    }
  }

  return (
    <div className="page SessionForm" onKeyPress={handleKeyPress}>
      <form>
        <label>
          Group Name:
          <SearchDropDown
            className="search-drop-down"
            options={groupNameSuggestions}
            value={groupName}
            onChange={setGroupName}
          />
        </label>
        <label>
          Date:
          <input
            type='date'
            value={dateStr}
            onChange={ev => setDateStr(ev.target.value)}
          />
        </label>
        <label>
          Duration (hours):
          <input
            className="number-input"
            type='number'
            value={duration}
            step={0.5}
            min={0}
            onChange={ev => {
              setDuration(parseFloat(ev.target.value))
            }}
          />
        </label>
        <label>
          Add Participant:
          <SearchDropDown
            className="search-drop-down"
            value={currentParticipant}
            options={participantSuggestions}
            onChange={newValue => {
              setCurrentParticipant(newValue);
            }}
          />
        </label>
        <button
          className="add-participant-button"
          onClick={() => addParticipant(currentParticipant)}
        >
          Add
        </button>
      </form>
      <h3>Participants</h3>
      <AnimatePresence>
        {participants.length === 0 ? <p>No Participants</p> :
          <div className="participant-section">
            {participants.map(({ name, id }, index) => (
              <motion.div
                key={id}
                className="participant-container"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <input
                  type='text'
                  value={name}
                  onChange={ev => setParticipants(
                    participants.map(({ name: _name, id: _id }, _index) => {
                      return { id: _id, name: index === _index ? ev.target.value : _name }
                    })
                  )}
                />
                <button
                  className="remove-participant"
                  // onClick={() => removeParticipant(index)}
                  onClick={() =>
                    setParticipants(participants.filter((_, _index) =>
                      index !== _index))}
                >
                  &#10005;
                </button>
              </motion.div>
            ))}
          </div>
        }
      </AnimatePresence>

      <div className="submit-session-buttons-container">
        {buttons.map(([name, onClick], index) => (
          <button
            key={index}
            className="submit-session-button"
            onClick={() => {
              if (onClick(getSessionInfo())) {
                clearForm();
              }
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div >
  );
};

SessionForm.defaultProps = {
  sessionInfo: EMPTY_SESSION,
  buttons: [['Submit', (sessionInfo: SessionInfo) => true]],
};

export default SessionForm;