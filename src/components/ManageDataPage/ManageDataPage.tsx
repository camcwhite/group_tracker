import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../sessions";
import { parseData, parseLegacyData, storeObj } from "../../store";
import './ManageDataPage.css';

const ManageDataPage = () => {
  const navigate = useNavigate();

  const handleUploadData = () => {
    window.postMessage({ type: "upload-data", data: null });
  };

  const handleUploadLegacyData = () => {
    window.postMessage({ type: "upload-data", data: null });
  };

  const handleExportData = () => {
    window.postMessage({ type: "export-data", data: storeObj() });
  };

  const handleUploadDone = ({data}: {data: any}) => {
    if (data.type === 'upload-done' && data.status === 'ok') {
      let sessions;
      if (data.legacy) {
        sessions = parseLegacyData(data.data);
      }
      else {
        sessions = parseData(data.data);
      }
      if (sessions !== undefined) {
        sessions.forEach(saveSession);
      }
      navigate('/');
    }
  };

  const handleExportDone = ({data}: {data: any}) => {
    if (data.type === 'export-done') {
      navigate('/') 
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleUploadDone);
    window.addEventListener('message', handleExportDone);
    return () => {
      window.removeEventListener('message', handleUploadDone);
      window.removeEventListener('message', handleExportDone);
    };
  }, [])

  return (
    <div className="page ManageDataPage">
      <h1>Manage Data</h1>
      <button onClick={handleExportData}>
        Export Data
      </button>

      <button onClick={handleUploadData}>
        Upload Data
      </button>

      <button onClick={handleUploadLegacyData}>
        Upload Legacy Data
      </button>

    </div>
  );
};

export default ManageDataPage;