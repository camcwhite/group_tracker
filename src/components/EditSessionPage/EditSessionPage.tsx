import React, { useEffect, useState } from "react";
import { SessionInfo, getAllSessions } from "../../sessions";
import SessionForm from "../SessionForm/SessionForm";
import './EditSessionPage.css';

const EditSessionPage = () => {
  const [currentSessionID, setCurrentSessionID] = useState(0); 
  const [sessions, setSessions] = useState<SessionInfo[]>(getAllSessions());

  const handleSave = (sessionInfo: SessionInfo): boolean => {
    return true;
  };

  const handleDelete = (sessionInfo: SessionInfo): boolean => {
    return true;
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