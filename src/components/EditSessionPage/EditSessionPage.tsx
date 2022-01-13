import React, { useState } from "react";
import { SessionInfo } from "../../sessions";
import SessionForm from "../SessionForm/SessionForm";
import './EditSessionPage.css';

const EditSessionPage = () => {
  const [currentSessionID, setCurrentSessionID] = useState(0); 

  const handleSave = (sessionInfo: SessionInfo) => {
    
  };

  const handleDelete = (sessionInfo: SessionInfo) => {

  };

  return (
    <div className="page EditSessionPage">
      <h2>Edit Group Session</h2>
      <SessionForm 
        buttons={[['Save', handleSave], ['Delete', handleDelete]]}
      />
    </div>
  );
};

export default EditSessionPage;