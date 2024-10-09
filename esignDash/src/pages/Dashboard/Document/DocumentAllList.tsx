import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../../redux/selectors/userSelector';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';

interface DocumentList {
  name: string;
  document_title: string;
  template_title: string;
  owner_email: string;
  document_created_at: string;
}

interface ApiResponse {
  status: number;
  message: {
    data: DocumentList[];
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

const DocumentAllList: React.FC<AllTempletesProps> = ({ refreshTempletes, setRefreshTempletes }) => {
  const email = useSelector(selectEmail);
  const [documents, setDocuments] = useState<DocumentList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State for showing modal
  const [documentToDelete, setDocumentToDelete] = useState<DocumentList | null>(null); // State for document to delete
  const navigate = useNavigate();

  const handleEdit = (documentData: DocumentList) => {
    navigate(`/document/${documentData.name}`, { state: { documentData } });
  };

  useEffect(() => {
    const fetchTempletes = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_documents_list?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();

        if (response.status === 200) {
          if (result.message.data.length > 0) {
            setDocuments(result.message.data);
            setLoading(false);
          } else {
            setError('No documents found');
            setLoading(false);
          }
        } else {
          setError('Failed to fetch documents');
          setLoading(false);
        }
      } catch (error) {
        setError('An error occurred while fetching documents');
        setLoading(false);
      }
    };

    if (email || refreshTempletes) {
      fetchTempletes();
    }
  }, [email, refreshTempletes]);

  const handleDelete = (document: DocumentList) => {
    setDocumentToDelete(document);
    setShowModal(true);
  };

  const confirmDelete = async (name: string) => {
    if (documentToDelete) {
      try {
        const response = await fetch(`/api/method/esign_app.api.delete_esign_document?user_mail=${email}&name=${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiDeleteResponse = await response.json();

        if (result.message.status === 200) {
          setDocuments(documents.filter(document => document.name !== name));
          setRefreshTempletes(true);
          toast.error('Document Deleted successfully', {
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
        } else {
          console.error('Failed to delete template:', result.message);
          setError('Failed to delete template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        setError('Error deleting template');
      } finally {
        setShowModal(false);
        setDocumentToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDocumentToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
      <div className="flex flex-wrap gap-4">
  {documents.map((document, index) => (
    <div key={index} className="relative flex-shrink-0 w-[200px] h-[100px]">
      {/* Delete button */}
      <div className="absolute top-2 right-2 cursor-pointer" onClick={() => handleDelete(document)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 text-red-600">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-2 14H7L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M18 4l-1-1h-8L7 4"></path>
        </svg>
      </div>

      {/* Card content */}
      <div 
        className="bg-[#283C42] text-white rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer p-4 w-full h-full"
        onClick={() => handleEdit(document)}
      >
        <h3 className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">{document.document_title}</h3>
        <h4 className="font-bold text-xs text-ellipsis overflow-hidden whitespace-nowrap">{document.template_title}</h4>
        <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">{new Date(document.document_created_at).toLocaleString()}</p>
      </div>
    </div>
  ))}
</div>

     
      {showModal && documentToDelete && (
        <ConfirmDeleteModal
          visible={showModal}
          name={documentToDelete.name}
          message={`Are you sure you want to delete the document titled "${documentToDelete.document_title}"?`}
          module="Document"
          onConfirm={(name) => confirmDelete(name)}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default DocumentAllList;
