import ReactPDF, { PDFViewer } from "@react-pdf/renderer";
import React, { useState } from "react";
import { generatePDF, generateReport } from "../../reports";
import { getDateStr, getSessionsBetween, getTodayStr, oneMonthAgo } from "../../sessions";
import './CreateReportPage.css';

const CreateReportPage = () => {

  const [startDate, setStartDate] = useState(getDateStr(oneMonthAgo()));
  const [endDate, setEndDate] = useState(getTodayStr());
  const [PDFReport, setPDFReport] = useState<() => JSX.Element>()

  const createPDF = () => {
    const report = generateReport(getSessionsBetween(startDate, endDate), startDate, endDate);
    console.log(report);
    // const PDFReport = generatePDF(report);
    setPDFReport(generatePDF(report));
    // ReactPDF.renderToFile(PDFReport, './report.pdf');
    // ReactPDF.render(PDFReport, `${__dirname}/report.pdf`);
  };

  const createTXT = () => {

  }

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
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;