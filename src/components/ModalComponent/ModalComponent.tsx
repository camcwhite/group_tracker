import React from 'react';
import x_pic from '../../assets/x.png';
import './ModalComponent.css';

type ModalPropTypes = {
  handleClose: () => void,
  showing: boolean,
  children: JSX.Element,
};

// from: https://www.digitalocean.com/community/tutorials/react-modal-component
const ModalComponent = ({ handleClose, showing, children }: ModalPropTypes) => {
  return (
    <div className={`modal ${showing ? 'displayBlock' : 'displayNone'}`}>
      <section className="modalMain">
        <div className='modalCloseButtonRow'>
          <button 
            className="modalCloseButton"
            type="button" 
            onClick={handleClose}
          >
            <img src={x_pic} alt='' />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
};

export default ModalComponent;