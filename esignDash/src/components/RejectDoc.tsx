import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";

interface ConfirmRejectModalProps {
  visible: boolean;
  name: string;
  owner_name: string;
  message: string;
  module: string;
  onCancel: () => void;
  onConfirm: (name: string, reason: string) => void; 
}


const RejectDoc: React.FC<ConfirmRejectModalProps> = ({ visible, onCancel, onConfirm, name,owner_name, message, module }) => {
  const [mailBody, setMailBody] = useState('');
  
  
  async function ConfirmData(name: string, reason: string) {
    // Remove HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = reason;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
  
    const minAlphabets = plainText.replace(/[^a-zA-Z]/g, "").length >= 5;
  
    if (!minAlphabets) {
      toast.error("Reason must contain at least 5 alphabetic characters.");//(CHANGE TO 15 LATER)
      return;
    }
  
    console.log(name, plainText);
    const documentObj = {
        document_title: name,
        document_reason: reason,
        document_owner: owner_name,
      };

    try {
        // Make API request
        const response = await fetch('/api/method/esign_app.api.reject_final_document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(documentObj),
        });
    
        const result = await response.json();
        console.log(JSON.stringify(result))
        if (result.message.status === 200) {
          toast.success(result.message);
          onConfirm(name, plainText);
          setMailBody('')
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Error rejecting document:", error);
        toast.error("Failed to reject document. Please try again.");
      }   
  }
  return (
   <Modal
  title=""
  visible={visible}
  onCancel={onCancel}
  footer={null}
  width="fit-content"
  className="!p-0 glass-modal"
>
  <div className="min-w-[40vw] p-6  text-white ">
    {/* Header */}
    <div>
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

      <div className="mt-4 text-center">
        <span className="text-white text-base font-semibold leading-6">{module}</span>
        <p className="mt-2 text-gray-300 text-sm leading-5">{message}</p>
      </div>
    </div>

    {/* Reason Input */}
    <div className="mt-6 mb-4">
      <label className="block font-semibold text-white mb-2">Reason for Rejection:</label>
      <div className="bg-white rounded-md overflow-hidden">
        <ReactQuill theme="snow" value={mailBody} className='text-black' onChange={setMailBody} />
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={() => ConfirmData(name, mailBody)}
        disabled={!mailBody.trim()}
        className="w-full inline-flex justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium border border-transparent shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full inline-flex justify-center rounded-md bg-white/10 text-white px-4 py-2 text-sm font-medium border border-white/20 shadow-sm hover:bg-white/20 transition"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

  );
};

export default RejectDoc;
