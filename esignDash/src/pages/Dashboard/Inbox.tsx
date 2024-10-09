import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/selectors/userSelector';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Document {
  name: string;
  document_title: string;
  owner_email: string;
  document_created_at: string;
  assigned_users: string; 
  template_title:string;
}

interface ApiResponse {
  message: {
    status: number;
    data: Document[];
  };
}

// interface AllDocumentsProps {
//   refreshDocuments: boolean;
//   setRefreshDocuments: Dispatch<SetStateAction<boolean>>;
// }

const Inbox = () => {
  const navigate = useNavigate();
  const email = useSelector(selectEmail);
  const [documentData, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'opened' | 'completed' | 'unseen'>('all');

  const handleEdit = (documentData:Document) => {
    navigate(`/signer/${documentData.name}`, { state: { documentData } });
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      // // // console.log("Fetching documentData...");
      try {
        const response = await fetch(`/api/method/esign_app.api.get_documents_by_user?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();
        // // // console.log("Fetch result:", result);

        if (response.status === 200) {
          if (result.message.data.length > 0) {
            setDocuments(result.message.data);
          } else {
            setError('No documentData found');
          }
        } else {
          setError('Failed to fetch documentData');
        }
      } catch (error) {
        setError('An error occurred while fetching documentData');
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

  // Function to parse assigned_users JSON string
  const parseAssignedUsers = (assignedUsersString: string) => {
    try {
      return JSON.parse(assignedUsersString) as Record<string, { email: string; status: string }>;
    } catch (error) {
      console.error("Failed to parse assigned_users:", error);
      return {};
    }
  };

  // Filter documentData based on the selected status
  const filteredDocuments = documentData.filter((document) => {
    const assignedUsers = parseAssignedUsers(document.assigned_users);
    const userStatus = Object.values(assignedUsers).find(user => user.email === email)?.status;

    if (filter === 'all') return true;
    if (filter === 'unseen' && userStatus === 'unseen') return true;
    if (filter === 'opened' && userStatus === 'open') return true;
    if (filter === 'completed' && userStatus === 'close') return true;

    return false;
  });

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
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

      <div className="flex flex-wrap gap-5">
  {filteredDocuments.map((document, index) => {
    const assignedUsers = parseAssignedUsers(document.assigned_users);
    const userStatus = Object.values(assignedUsers).find(user => user.email === email)?.status;

    let themeClass = "";
    if (userStatus === "unseen") {
      themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] relative";
    } else if (userStatus === "open") {
      themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42]";
    } else if (userStatus === "close") {
      themeClass = "bg-[#283C42] text-white border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] opacity-50";
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

      <ToastContainer />
    </div>
  );
};

export default Inbox;
