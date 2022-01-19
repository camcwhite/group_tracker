import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateReport, getAttendeeCSVText, getGroupCSVText, getReportText } from "../../reports";
import { getDateStr, getSessionsBetween, getTodayStr, oneMonthAgo } from "../../sessions";
import './CreateReportPage.css';

const CreateReportPage = () => {
  const [startDate, setStartDate] = useState(getDateStr(oneMonthAgo()));
  const [endDate, setEndDate] = useState(getTodayStr());

  const getReport = () => generateReport(getSessionsBetween(startDate, endDate), startDate, endDate);

  const doSave = (type: string, data: any) => {
    window.postMessage({ type, data })
  };

  const createPDF = () => {
    const reportText = getReportText(getReport());
    doSave('savePDF', reportText);
  };

  const createTXT = () => {
    const reportText = getReportText(getReport());
    console.log(reportText);
    doSave('saveTXT', reportText);
  };

  const createGroupCSV = () => {
    doSave('saveCSV', getGroupCSVText(getReport().groups));
  };

  const createAttendeeCSV = () => {
    doSave('saveCSV', getAttendeeCSVText(getReport().people));
  };

  return (
    <div className="page CreateReportPage">
      <h1>Create Report</h1>
      <form>
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
          <button onClick={createPDF}>PDF</button>
          <button onClick={createTXT}>Text File</button>
          <button onClick={createGroupCSV}>Group Data (CSV)</button>
          <button onClick={createAttendeeCSV}>Attendee Data (CSV)</button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;