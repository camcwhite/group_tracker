import React from 'react';
import { motion } from 'framer-motion';
import './AboutPage.css';

const AboutPage = () => (
  <div className="page AboutPage">
    <h2>About</h2>
    <div className="about-text-container">
      <p>This app was was made, with love, for River City Advocacy</p>
      <p>by Renee and Cameron White</p>
    </div>
    {/* <a 
      className='button'
      href="https://github.com/whiteceric/group_tracker#readme"
      target="_blank"
      rel="noopener noreferrer"
    >
      See Usage Instructions
    </a> */}
    <h3>Using is very simple:</h3>
    <ul className='usage-instructions'>
      <li>
        To create a new session record:
        <ul>
          <li>
            Click 'Add Group Session' from the main menu and enter information for that session.
          </li>
          <li>
            Participants can either be entered one at a time using the text box next to 'Participants' (press Enter to add a name) or pasted/edited in the text box below 'Participants'.
          </li>
        </ul>
      </li>
      <li>
        To edit a session record:
        <ul>
          <li>
            Click 'Edit Group Sessions' from the main menu. Select which record to edit using the 'Prev' and 'Next' buttons at the top of the page.
          </li>
          <li>
            When you are done editing a session, click 'Save' to save your changes.
          </li>
          <li>
            To delete a record click 'Delete' at the bottom of the page (warning: there is no warning after clicking, the record is immediately deleted).
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
            Enter start date in YYYY-MM-DD format (example: 2021-09-12 for September 12, 2021)
          </li>
          <li>
            Enter end date in YYYY-MM-DD format
          </li>
          <li>
            Click 'PDF' to save report to a PDF (.pdf) file (after choosing a save location and file name)
          </li>
          <li>
            Click 'Text' to save report to a text (.txt) file (after choosing a save location and file name)
          </li>
        </ul>
      </li>
    </ul>


    <small>v0.2.0</small>
  </div>
);

export default AboutPage;
