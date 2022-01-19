import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateReport, getReportText } from "../../reports";
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

  const createGroupXLSX = () => {

  };

  const createAttendeeXLSX = () => {

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
          <button onClick={createGroupXLSX}>Group Data (Excel)</button>
          <button onClick={createAttendeeXLSX}>Attendee Data (Excel)</button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;