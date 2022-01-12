import React, { useEffect, useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import './SessionForm.css';

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
  groupName: string,
  dateStr: string,
  duration: number,
  participants: string[],
};

type SessionFormProps = {
  sessionInfo: SessionInfo,
  buttons: Array<[string, (sessionInfo: SessionInfo) => void]>,
};

const EMPTY_SESSION: SessionInfo = {
  groupName: '',
  dateStr: getTodayStr(), 
  duration: 1,
  participants: [],
};

const SessionForm = ({ sessionInfo, buttons }: SessionFormProps) => {
  // form state
  const [groupName, setGroupName] = useState(sessionInfo.groupName);
  // date
  const [dateStr, setDateStr] = useState(sessionInfo.dateStr);

  const [duration, setDuration] = useState(sessionInfo.duration);

  const [participants, setParticipants] = useState<string[]>(
    sessionInfo.participants
  );

  const [currentParticipant, setCurrentParticipant] = useState('');

  const addParticipant = (name: string) => {
    console.log('call adding', name);
    if (name.length !== 0) {
      console.log('adding', name);
      setCurrentParticipant('');
      setParticipants([name, ...participants])
    }
  };

  const getSessionInfo = (): SessionInfo => {
    return {
      groupName, dateStr, duration, participants
    };
  };

  const handleKeyPress = (ev:KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      addParticipant(currentParticipant);
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  return (
    <div className="page SessionForm">
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
            onChange={ev => {
              console.log(ev.target.value);
              setDateStr(ev.target.value);
            }}
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
      {participants.length === 0 ? <p>No Participants</p> :
        <div className="participant-section">
          {participants.map((name, index) => (
            <div key={index} className="participant-container">
              <input
                type='text'
                value={participants[index]}
                onChange={ev => setParticipants(
                  participants.map((_name, _index) =>
                    index === _index ? ev.target.value : _name
                  )
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
            </div>
          ))}
        </div>
      }

      <div className="submit-session-buttons-container">
        {buttons.map(([name, onClick], index) => (
          <button 
            key={index}
            className="submit-session-button"
            onClick={() => onClick(getSessionInfo())}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

SessionForm.defaultProps = {
  sessionInfo: EMPTY_SESSION,
  buttons: [['Submit', (sessionInfo:SessionInfo) => {}]],
};

export default SessionForm;