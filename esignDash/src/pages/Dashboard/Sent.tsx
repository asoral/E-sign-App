import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/selectors/userSelector';
import dayjs from './helper/dayjsConfig';
import { Modal } from 'antd';
// import 'antd/dist/reset.css'; 

import SentModal from './Sent/SentModal'

interface User {
  email: string;
  status: 'unseen' | 'open' | 'close';
}

interface Document {
  name: string;
  document_title: string;
  owner_email: string;
  document_created_at: string;
  assigned_users: string;
  document_subject: string;
  description: string;
}

interface ApiResponse {
  message: {
    status: number;
    data: Document[];
  };
}

interface Mail {
  id: number;
  status: 'Unread' | 'Pending' | 'Completed';
  documentTitle: string;
  subject: string;
  timestamp: string;
  description: string;
  assigned_users:string;
}

const Sent: React.FC = () => {
  const email = useSelector(selectEmail);
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'opened' | 'completed' | 'unseen'>('all');
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
        console.log(result);

        if (response.status === 200) {
          const processedMails = result.message.data.map((doc, index) => {
            console.log(doc);

            const assignedUsers: Record<string, User> = JSON.parse(doc.assigned_users);

            const statusCounts: Record<string, number> = {
              unseen: 0,
              open: 0,
              close: 0,
            };

            Object.values(assignedUsers).forEach((user) => {
              if (user.status in statusCounts) {
                statusCounts[user.status]++;
              }
            });
            // Status Code for User check and Give PDF print
            let finalStatus: 'Unread' | 'Pending' | 'Completed' = 'Completed';
            if (statusCounts.unseen > 0) {
              finalStatus = 'Unread';
            } else if (statusCounts.open > 0) {
              finalStatus = 'Pending';
            }



            return {
              id: index + 1,
              status: finalStatus,
              documentTitle: doc.document_title,
              subject: doc.document_subject,
              description: doc.description,
              timestamp: dayjs(doc.document_created_at).toISOString(),
              assigned_users :doc.assigned_users,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredMails = mails.filter((mail) => {
    switch (filter) {
      case 'all':
        return true;
      case 'opened':
        return mail.status === 'Pending';
      case 'completed':
        return mail.status === 'Completed';
      case 'unseen':
        return mail.status === 'Unread';
      default:
        return true;
    }
  });

  const sortedMails = filteredMails.sort((a, b) => dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix());

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Unread':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return '';
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
    <div className="container mx-auto p-1 pt-3 w-[73vw]">
      <div className="mb-4 flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`text-sm px-4 py-2 transition-all duration-200 ease-in-out ${filter === 'all' ? 'bg-[#283C42] text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300'} rounded-l-md hover:bg-[#283C42] hover:text-white hover:shadow-xl hover:translate-y-[-2px]`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('opened')}
          className={`text-sm px-4 py-2 transition-all duration-200 ease-in-out ${filter === 'opened' ? 'bg-[#283C42] text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300'} hover:bg-[#283C42] hover:text-white hover:shadow-xl hover:translate-y-[-2px]`}
        >
          Opened
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`text-sm px-4 py-2 transition-all duration-200 ease-in-out ${filter === 'completed' ? 'bg-[#283C42] text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300'} hover:bg-[#283C42] hover:text-white hover:shadow-xl hover:translate-y-[-2px]`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('unseen')}
          className={`text-sm px-4 py-2 transition-all duration-200 ease-in-out ${filter === 'unseen' ? 'bg-[#283C42] text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300'} rounded-r-md hover:bg-[#283C42] hover:text-white hover:shadow-xl hover:translate-y-[-2px]`}
        >
          Unseen
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-y-auto max-h-[85vh] doc-temp-scroll-container">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#283C42] text-white">
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
              <React.Fragment key={mail.id}>
                <tr
                  className={`cursor-pointer ${hoveredRow === mail.id ? 'bg-gray-100' : ''}`}
                  onMouseEnter={() => setHoveredRow(mail.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleRowClick(mail)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(mail.status)}`}>
                      {mail.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap max-w-9">{mail.documentTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate text-ellipsis overflow-hidden whitespace-nowrap ">{mail.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(mail.timestamp).format('DD/MM/YYYY')} ({dayjs(mail.timestamp).fromNow()})
                  </td>
                </tr>
              </React.Fragment>
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

