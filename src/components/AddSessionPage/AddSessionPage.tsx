import React, { useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
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

  const addParticipant = () => {
    setParticipants([...participants, currentParticipant])
  };

  const [participants, setParticipants] = useState<string[]>([]);

  return (
    <div className="page AddSessionPage">
      <h2>Add Group Session</h2>
      <form>
        <label>
          Group Name:
          <SearchDropDown
            className="search-drop-down"
            options={groupNameSuggestions}
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
          Participants:
          <SearchDropDown
            className="search-drop-down"
            options={participantSuggestions}
            onChange={setCurrentParticipant}
          />
        </label>
        <button 
          className="add-participant-button"
          onClick={addParticipant}
        >
          Add Participant
        </button>
      </form>
    </div >
  );
};

export default AddSessionPage;