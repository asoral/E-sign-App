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
  title=""
  visible={visible}
  onCancel={onCancel}
  footer={null}
  width="fit-content"
  className="!p-0 glass-modal max-w-prose"
>
  <div className="overflow-hidden relative rounded-md max-w-[290px] text-white  ">
    {/* Header */}
    <div className="p-5 pt-6">
      <div className="flex mx-auto bg-red-500/20 shrink-0 justify-center items-center w-12 h-12 rounded-full">
        <svg
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6 text-red-500"
        >
          <path
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mt-3 text-center">
        <span className="text-white text-base font-semibold leading-6">{module}</span>
        <p className="mt-2 text-gray-300 text-sm leading-5">{message}</p>
      </div>
    </div>

    {/* Buttons */}
    <div className="px-4 pb-4 pt-2">
      <button
        type="button"
        onClick={() => onConfirm(name)}
        className="inline-flex w-full justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium border border-transparent shadow-sm hover:bg-red-700 transition"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex w-full justify-center mt-3 rounded-md bg-white/10 text-white px-4 py-2 text-sm font-medium border border-white/20 shadow-sm hover:bg-white/20 transition"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>


  );
};

export default ConfirmDeleteModal;
