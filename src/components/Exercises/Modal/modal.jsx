import React from 'react';
import './modal.scss';

const Modal = ({ title, messageOne, messageTwo, actions }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{title}</h2>
      <p>{messageOne}</p>
      <p>{messageTwo}</p>
      <div className="modal-actions">
        {actions.map((action, index) => (
          <button key={index} className={action.className} onClick={action.onClick}>
            {action.icon && <i className={action.icon}></i>} {action.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Modal;
