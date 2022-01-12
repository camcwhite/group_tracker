import React, { useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import './AddSessionPage.css';

const groupNameSuggestions = [
  'A',
  'ABC',
  'BC',
  'BAC',
];

const participantSuggestions = [
  'A',
  'ABC',
  'BC',
  'BAC',
];



const AddSessionPage = () => {

  // form state
  const [groupName, setGroupName] = useState('');

  // date
  const today = new Date();
  const year = today.getFullYear();
  const raw_month = today.getMonth() + 1;
  const month = raw_month >= 10 ? `${raw_month}` : `0${raw_month}`;
  const raw_day = today.getDate();
  const day = raw_day >= 10 ? `${raw_day}` : `0${raw_day}`;
  const [dateStr, setDateStr] = useState(`${year}-${month}-${day}`);

  const [duration, setDuration] = useState(1);

  const changeDuration = (dt: -1 | 1) => {
    setDuration(Math.max(duration + dt, 0));
  };

  const [currentParticipant, setCurrentParticipant] = useState('');

  const addParticipant = (name: string) => {
    if (name.length !== 0) {
      setCurrentParticipant('');
      setParticipants([name, ...participants])
    }
  };

  const [participants, setParticipants] = useState<string[]>([
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
  ]);

  return (
    <div className="page AddSessionPage">
      <h2>Add Group Session</h2>
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
            onChange={setCurrentParticipant}
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
            <div className="participant-container">
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

      <button className="submit-session-button">Submit</button>
    </div >
  );
};

export default AddSessionPage;