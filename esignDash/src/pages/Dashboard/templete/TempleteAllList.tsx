import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../../redux/selectors/userSelector';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';

interface Templete {
  name: string;
  templete_title: string;
  templete_owner_email: string;
  templete_owner_name: string;
  templete_created_at: string;
}

interface ApiResponse {
  status: number;
  message: {
    data: Templete[];
  };
}

interface AllTempletesProps {
  refreshTempletes: boolean;
  setRefreshTempletes: Dispatch<SetStateAction<boolean>>;
}

interface ApiDeleteResponse {
  message: {
    status: number;
    message: string;
  };
}

const TempleteAllList: React.FC<AllTempletesProps> = ({ refreshTempletes, setRefreshTempletes }) => {
  const navigate = useNavigate();
  const email = useSelector(selectEmail);
  const [templetes, setTempletes] = useState<Templete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedTemplete, setSelectedTemplete] = useState<Templete | null>(null);

  useEffect(() => {
    const fetchTempletes = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_templetes?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();

        if (response.status === 200) {
          if (result.message.data.length > 0) {
            setTempletes(result.message.data);
            setLoading(false);
          } else {
            setError('No templates found');
            setLoading(false);
          }
        } else {
          setError('Failed to fetch templates');
          setLoading(false);
        }
      } catch (error) {
        setError('An error occurred while fetching templates');
        setLoading(false);
      }
    };

    if (email || refreshTempletes) {
      fetchTempletes();
    }
  }, [email, refreshTempletes]);

  const handleEdit = (templete: Templete) => {
    navigate(`/templete/${templete.name}`, { state: { templete } });
  };

  const handleDelete = async (name: string) => {
    if (selectedTemplete) {
      try {
        const response = await fetch(`/api/method/esign_app.api.delete_esign_templete?user_mail=${email}&name=${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiDeleteResponse = await response.json();

        if (result.message.status === 200) {
          setTempletes(templetes.filter(templete => templete.name !== name));
          setRefreshTempletes(true);
          deleted();
        } else {
          console.error('Failed to delete template:', result.message);
          setError('Failed to delete template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        setError('Error deleting template');
      } finally {
        setDeleteModalVisible(false);
      }
    }
  };

  const showDeleteModal = (templete: Templete) => {
    setSelectedTemplete(templete);
    setDeleteModalVisible(true);
  };

  function deleted() {
    toast.error('Template Deleted successfully', {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Flip,
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
 <div className="flex flex-wrap gap-5">
  {templetes.map((templete, index) => (
    <div key={index} className="relative flex w-[200px] h-[100px]">
      <div className="absolute top-2 right-2 cursor-pointer" onClick={() => showDeleteModal(templete)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 text-red-600">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-2 14H7L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M18 4l-1-1h-8L7 4"></path>
        </svg>
      </div>
      <div 
        className="bg-[#283C42] text-white rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer p-4"
        style={{ width: '200px', height: '100px' }}
        onClick={() => handleEdit(templete)}
      >
        <h3 className="mt-2 font-bold text-ellipsis overflow-hidden whitespace-nowrap">
          {templete.templete_title}
        </h3>
        <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
          {new Date(templete.templete_created_at).toLocaleString()}
        </p>
      </div>
    </div>
  ))}
</div>

      {selectedTemplete && (
        <ConfirmDeleteModal
          visible={deleteModalVisible}
          name={selectedTemplete.name}
          message={`Are you sure you want to delete the template "${selectedTemplete.templete_title}"?`}
          module="Template"
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default TempleteAllList;
