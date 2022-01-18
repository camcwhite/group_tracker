import React, { useState } from "react";
import { getDateStr, getTodayStr, oneMonthAgo } from "../../sessions";
import './CreateReportPage.css';

const CreateReportPage = () => {
  
  const [startDate, setStartDate] = useState(getDateStr(oneMonthAgo()));
  const [endDate, setEndDate] = useState(getTodayStr());

  const createPDF = () => {

  };

  const createTXT = () => {

  }
  
  return (
    <div className="page CreateReportPage">
      <h1>Create Report</h1>
      <form onSubmit={createPDF}>
        <label>
          Start Date:
          <input
            type='date'
            value={startDate}
            onChange={ev => setStartDate(ev.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type='date'
            value={endDate}
            onChange={ev => setEndDate(ev.target.value)}
          />
        </label>
        <div className="create-form-buttons">
          <button type='submit' onClick={createPDF}>PDF</button>
          <button type='submit' onClick={createTXT}>Text File</button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;