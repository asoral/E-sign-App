import React from 'react';
import { Modal } from 'antd';

interface ConfirmDeleteModalProps {
  visible: boolean;
  name: string;
  message : string;
  module : string ;
  onCancel: () => void;
  onConfirm: (name: string) => void; 
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ visible, onCancel, onConfirm, name , message , module }) => {
  return (
    <Modal
      title="Confirm Deletion"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'fit-content'}
      className="confirm-delete-modal"
    >
      <div className="confirm-delete-card">
        <div className="confirm-delete-header">
          <div className="confirm-delete-image">
            <svg aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="confirm-delete-content">
            <span className="confirm-delete-title">{module}</span>
            <p className="confirm-delete-message">
            {message}
            </p>
          </div>
        </div>
        <button className="confirm-delete-desactivate" type="button" onClick={() => onConfirm(name)}>
          Confirm
        </button>
        <button className="confirm-delete-cancel" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      
    </Modal>
  );
};

export default ConfirmDeleteModal;
