import React, { useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import './AddSessionPage.css';

const groupNameSuggestions = [
  'A',
  'ABC',
  'BC',
  'BAC',
];

const AddSessionPage = () => {

  // form state
  const [groupName, setGroupName] = useState('');

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
      </form>
    </div>
  );
};

export default AddSessionPage;