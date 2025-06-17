import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/selectors/userSelector';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select } from 'antd';

interface Document {
  name: string;
  document_title: string;
  owner_email: string;
  document_created_at: string;
  assigned_users: string;
  template_title: string;
  isrejected:boolean;
}

interface ApiResponse {
  message: {
    status: number;
    data: Document[];
  };
}

const Inbox = () => {
  const navigate = useNavigate();
  const email = useSelector(selectEmail);
  const [documentData, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'opened' | 'completed' | 'unseen'>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleEdit = (documentData: Document) => {
    navigate(`/signer/${documentData.name}`, { state: { documentData } });
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_documents_by_user?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();

        if (response.status === 200) {
          if (result.message.data.length > 0) {
            setDocuments(result.message.data);
          } else {
            setError('No documents found');
          }
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

  const parseAssignedUsers = (assignedUsersString: string) => {
    try {
      return JSON.parse(assignedUsersString) as Record<string, { email: string; status: string }>;
    } catch (error) {
      console.error("Failed to parse assigned_users:", error);
      return {};
    }
  };

  const filteredDocuments = documentData.filter((document) => {
    const assignedUsers = parseAssignedUsers(document.assigned_users);
    const userStatus = Object.values(assignedUsers).find(user => user.email === email)?.status;

    const statusMatch =
      filter === 'all' ||
      (filter === 'unseen' && userStatus === 'unseen') ||
      (filter === 'opened' && userStatus === 'open') ||
      (filter === 'completed' && userStatus === 'close');

    const searchMatch = document.document_title.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
      
      {/* Search and Filter Dropdown */}
      <div className="mb-4 flex gap-2 items-center max-w-40">
        <input
          type="text"
          placeholder="Search by document title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
       <Select
        value={filter}
        onChange={(value) => setFilter(value)}
        className="min-w-40"
      >
        <Select.Option value="all">All</Select.Option>
        <Select.Option value="opened">Opened</Select.Option>
        <Select.Option value="completed">Completed</Select.Option>
        <Select.Option value="unseen">Unseen</Select.Option>
      </Select>

      </div>

      <div className="h-[90vh] overflow-y-auto">
        <div className="flex flex-wrap gap-5">
          {filteredDocuments.map((document, index) => {
            const assignedUsers = parseAssignedUsers(document.assigned_users);
            const userStatus = Object.values(assignedUsers).find(user => user.email === email)?.status;

            let themeClass = "";

            if(!document.isrejected)
            {
              if (userStatus === "unseen") {
                themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] relative";
              } else if (userStatus === "open") {
                themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42]";
              } else if (userStatus === "close") {
                themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] opacity-50";
              }
            }
            else{
              themeClass = "bg-[#de4343] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] opacity-50";
            }

            return (
              <div key={index} className="w-[200px] h-[100px] relative">
                <div
                  className={`p-4 rounded border-2 transition-colors duration-300 cursor-pointer ${themeClass}`}
                  onClick={() => handleEdit(document)}
                >
                  <h3 className={`mt-2 font-bold ${userStatus === "close" ? "line-through" : ""} text-ellipsis overflow-hidden whitespace-nowrap`}>
                    {document.document_title}
                  </h3>
                  <p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {new Date(document.document_created_at).toLocaleString()}
                  </p>
                  {userStatus === "unseen" && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Inbox;
