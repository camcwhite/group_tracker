import React, { useEffect, useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { getSession, saveSession, SessionInfo } from "../../sessions";
import './AddSessionPage.css';
import SessionForm from "../SessionForm/SessionForm";
import { storeGet } from "../../store";

const AddSessionPage = () => {

  const handleSubmit = (sessionInfo: SessionInfo) => {
    saveSession(sessionInfo);
  };

  return (
    <div className="page AddSessionPage">
      <h2>Add Group Session</h2>
      <SessionForm 
        buttons={[['Submit', handleSubmit]]}
      />
    </div >
  );
};

export default AddSessionPage;