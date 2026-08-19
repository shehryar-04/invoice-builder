import React from 'react';
import '../styles/Modal.css';

/**
 * Reusable Modal Component
 * Handles success, error, warning, and info messages
 */
export default function Modal({ isOpen, title, message, type = 'info', onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="modal-backdrop" onClick={onClose} aria-label="Close modal" />

      {/* Modal container */}
      <div className="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div className={`modal-content modal-${type}`}>
          {/* Modal header */}
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Modal body */}
          <div className="modal-body">
            <p>{message}</p>
          </div>

          {/* Modal footer */}
          <div className="modal-footer">
            <button
              className="modal-btn modal-btn-primary"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
