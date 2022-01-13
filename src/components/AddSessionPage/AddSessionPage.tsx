import React, { useEffect, useState } from "react";
import SearchDropDown from "../SearchDropDown/SearchDropDown";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { SessionInfo } from "../../sessions";
import './AddSessionPage.css';
import SessionForm from "../SessionForm/SessionForm";

const AddSessionPage = () => {

  const handleSubmit = (sessionInfo: SessionInfo) => {
    console.log(sessionInfo);
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