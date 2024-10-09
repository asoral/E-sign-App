import React from 'react';
import { Modal, Tooltip } from 'antd';
import dayjs from '../helper/dayjsConfig';

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Unread':
      return 'bg-red-100 text-red-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'unseen':
      return 'bg-red-500';
    case 'open':
      return 'bg-yellow-500';
    case 'close':
      return 'bg-green-500';
    default:
      return '';
  }
};

const SentModal: React.FC<{ modalContent: any; isModalVisible: boolean; handleModalCancel: () => void }> = ({ modalContent, isModalVisible, handleModalCancel }) => {
  const statusClasses = getStatusClasses(modalContent?.status);

  // Parse the assigned_users string into an object
  const assignedUsers = JSON.parse(modalContent?.assigned_users || '{}');
  const userList = Object.keys(assignedUsers).map((key) => ({
    email: assignedUsers[key]?.email,
    status: assignedUsers[key]?.status,
  }));

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleModalCancel}
      footer={null}
      className="text-gray-700 max-w-prose"
      // width={"50vw"}
    >
      <div className="m-3 max-h-[70vh] overflow-y-auto doc-temp-scroll-container">
        <p className="mb-2 text-xl text-gray-400">
          {modalContent?.subject}
        </p>
        <div className="relative flex gap-3">
          <p className={`mb-4 ${statusClasses} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium`}>
            {modalContent?.status}
          </p>

          <Tooltip
            title={
              <div className='bg-[#283C42] rounded-md'>
                {userList.map((user, index) => (
                  <div key={index} className="flex bg-[#283C42] items-center space-x-2 text-white pl-2 pr-2 ">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusClasses(user.status)}`}></div>
                    <span>{user.email} : {user.status}</span>
                  </div>
                ))}
              </div>
            }
            placement="top"
           
          >
            <svg
              className="cursor-pointer"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1.3em"
              width="1.3em"
            >
              <path d="M20.5 14.5V16H19v-1.5h1.5m-2-5H17V9a3 3 0 013-3 3 3 0 013 3c0 .97-.5 1.88-1.29 2.41l-.3.19c-.57.4-.91 1.01-.91 1.7v.2H19v-.2c0-1.19.6-2.3 1.59-2.95l.29-.19c.39-.26.62-.69.62-1.16A1.5 1.5 0 0020 7.5 1.5 1.5 0 0018.5 9v.5M9 13c2.67 0 8 1.34 8 4v3H1v-3c0-2.66 5.33-4 8-4m0-9a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1m0-9A2.1 2.1 0 006.9 8 2.1 2.1 0 009 10.1 2.1 2.1 0 0011.1 8 2.1 2.1 0 009 5.9z" />
            </svg>
          </Tooltip>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-lg text-gray-600 px-4 font-bold tracking-tight">
            Description
          </p>
          <p className="text-justify text-gray-500 leading-relaxed mt-2 mb-4 px-4">
            {modalContent?.description}
          </p>

        </div>
        <p className="mt-4 px-4">
          <strong>Timestamp:</strong> {dayjs(modalContent?.timestamp).format('DD/MM/YYYY')} ({dayjs(modalContent?.timestamp).fromNow()})
        </p>
      </div>
    </Modal>
  );
};

export default SentModal;
