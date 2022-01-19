import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './AboutPage.css';
import { saveSession } from '../../sessions';
import { storeObj } from '../../store';

const AboutPage = () => {

  const handleUploadLegacyData = () => {
    window.postMessage({ type: "upload-legacy-data", data: null });
  };

  const handleUploadDone = ({data}: {data: any}) => {
    if (data.type === 'upload-done' && data.status === 'ok') {
      if (data.data.SESSIONS === undefined) {
        console.error('Malformed legacy data');
        return;
      }
      data.data.SESSIONS.forEach((session: any)=> {
        if (
          session.GROUP_NAME === undefined ||
          session.DATE === undefined ||
          session.DURATION_HOURS === undefined ||
          session.ATTENDEES === undefined
        ) {
          console.error('Malformed session');
          return;
        }
        saveSession({
          sessionID: '',
          groupName: session.GROUP_NAME,
          dateStr: session.DATE,
          duration: session.DURATION_HOURS,
          participants: session.ATTENDEES, 
        });
      })
    }
  };

  console.log(storeObj());

  useEffect(() => {
    window.addEventListener('message', handleUploadDone);
    return () => window.removeEventListener('message', handleUploadDone);
  }, [])

  return (
    <div className="page AboutPage">
      <h2>About</h2>
      <div className="about-text-container">
        <p>This app was was made, with love, for River City Advocacy</p>
        <p>by Renee and Cameron White</p>
      </div>
      <h3>Using is very simple:</h3>
      <ul className='usage-instructions'>
        <li>
          To create a new session record:
          <ul>
            <li>
              Click 'Add Group Session' from the main menu and enter information for that session.
            </li>
            <li>
              Participants can either be entered one at a time using the text box next to 'Participants' (press Enter to add a name) or edited in a text box below 'Participants'.
            </li>
          </ul>
        </li>
        <li>
          To edit a session record:
          <ul>
            <li>
              Click 'Edit Group Sessions' from the main menu. Select which record to edit using filter/sort options and click on that record to edit it.
            </li>
            <li>
              When you are done editing a session, click 'Save' to save your changes.
            </li>
            <li>
              To delete a record click 'Delete' at the bottom of the page.
            </li>
          </ul>
        </li>
        <li>
          To generate a report from saved data:
          <ul>
            <li>
              Click 'Create Report' from the main menu.
            </li>
            <li>
              Enter start and end date for the report. The report will be generated from all saved sessions between the start and end date.
            </li>
            <li>
              Click 'PDF' to save report to a PDF (.pdf) file (after choosing a save location and file name)
            </li>
            <li>
              Click 'Text' to save report to a text (.txt) file (after choosing a save location and file name)
            </li>
            <li>
              Click either of the CSV options to generate a CSV file that can be imported to Excel or Google Sheets
            </li>
          </ul>
        </li>
      </ul>

      <button
        onClick={handleUploadLegacyData}
        className='small-button'
      >
        Upload Legacy Data
      </button>

      <small>v0.2.0</small>
    </div>
  );
};

export default AboutPage;
