import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/selectors/userSelector';
import dayjs from './helper/dayjsConfig';
import { Modal, Select } from 'antd';
import SentModal from './Sent/SentModal';
import { isRejected } from '@reduxjs/toolkit';

const { Option } = Select;

interface User {
  email: string;
  status: 'unseen' | 'open' | 'close' | 'rejected' ;
}

interface Document {
  isrejected: boolean;
  name: string;
  document_title: string;
  owner_email: string;
  document_created_at: string;
  assigned_users: string;
  document_subject: string;
  description: string;
  rejected_by?:string;
  reject_reason?:HTMLBodyElement;
}

interface ApiResponse {
  message: {
    status: number;
    data: Document[];
  };
}

interface Mail {
  id: number;
  status: 'Unread' | 'Pending' | 'Completed' | 'Rejected';
  documentTitle: string;
  subject: string;
  timestamp: string;
  description: string;
  assigned_users: string;
  name:string;
  isRejected: boolean;
  rejected_by?:string;
  reject_reason?:HTMLBodyElement;
}

const Sent: React.FC = () => {
  const email = useSelector(selectEmail);
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'opened' | 'completed' | 'unseen'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Mail | null>(null);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.sent_doc_by_user?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();
        if (response.status === 200) {
          const processedMails = result.message.data.map((doc, index) => {
            const assignedUsers: Record<string, User> = JSON.parse(doc.assigned_users);
            const statusCounts = { unseen: 0, open: 0, close: 0, rejected:0 };

            Object.values(assignedUsers).forEach(user => {
              if (user.status in statusCounts) {
                statusCounts[user.status]++;
              }
            });

            let finalStatus: 'Unread' | 'Pending' | 'Completed' | 'Rejected' = 'Completed';
            if(!doc.isrejected)
            {
              if (statusCounts.unseen > 0) {
                finalStatus = 'Unread';
              } else if (statusCounts.open > 0) {
                finalStatus = 'Pending';
              }
            }
            else{
              finalStatus = 'Rejected';
            }

            return {
              id: index + 1,
              status: finalStatus,
              documentTitle: doc.document_title,
              subject: doc.document_subject,
              description: doc.description,
              timestamp: dayjs(doc.document_created_at).toISOString(),
              assigned_users: doc.assigned_users,
              name:doc.name,
              isRejected:doc.isrejected,
              rejected_by: doc.rejected_by,
              reject_reason: doc.reject_reason,
            };
          });

          setMails(processedMails);
        } else {
          setError('Failed to fetch documents');
        }
      } catch (error) {
        setError('An error occurred while fetching documents');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchDocuments();
    }
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredMails = mails.filter(mail => {
    switch (filter) {
      case 'all':
        return true;
      case 'opened':
        return mail.status === 'Pending';
      case 'completed':
        return mail.status === 'Completed';
      case 'unseen':
        return mail.status === 'Unread';
      case 'rejected':
        return mail.status === 'Rejected';
      default:
        return true;
    }
  }).filter(mail => mail.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedMails = filteredMails.sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix());

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Unread': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-gray-200 text-red-800';
      default: return '';
    }
  };
  
  const handleRowClick = (mail: Mail) => {
    setModalContent(mail);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };
  return (
    <div className="mx-auto p-1 pt-3 w-[73vw] w-min-full">
      <div className="mb-4 flex gap-2 items-center max-w-10">
        <input
          type="text"
          placeholder="Search by document title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
        <Select value={filter} onChange={setFilter} className="min-w-40 ">
          <Option value="all">All</Option>
          <Option value="opened">Opened</Option>
          <Option value="completed">Completed</Option>
          <Option value="unseen">Unseen</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-y-auto max-h-[85vh] doc-temp-scroll-container">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#283C42] text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Document Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
           
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {sortedMails.map((mail, index) => (
    <tr
      key={mail.id}
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => handleRowClick(mail)} // Restored onClick functionality
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(mail.status)}`}>
          {mail.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 truncate">{mail.documentTitle}</td>
      <td className="px-6 py-4 text-sm text-gray-500 truncate">{mail.subject}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {dayjs(mail.timestamp).format('DD/MM/YYYY')} ({dayjs(mail.timestamp).fromNow()})
      </td>
  
    </tr>
  ))}
</tbody>

        </table>
      </div>
      <SentModal
        modalContent={modalContent}
        isModalVisible={isModalVisible}
        handleModalCancel={handleModalCancel}
      />
    </div>
  );
};

export default Sent;
