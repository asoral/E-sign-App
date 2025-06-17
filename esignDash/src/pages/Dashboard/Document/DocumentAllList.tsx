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
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentList | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_documents_list?user_mail=${email}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result: ApiResponse = await response.json();
        if (response.status === 200 && result.message.data.length > 0) {
          setDocuments(result.message.data);
          setFilteredDocuments(result.message.data); // initial load shows all
        } else {
          setDocuments([]);
          setFilteredDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (email || refreshTempletes) {
      fetchDocuments();
    }
  }, [email, refreshTempletes]);

  // Delete handler
  const handleDelete = (document: DocumentList) => {
    setDocumentToDelete(document);
    setShowModal(true);
  };

  const confirmDelete = async (name: string) => {
    if (documentToDelete) {
      try {
        const response = await fetch(`/api/method/esign_app.api.delete_esign_document?user_mail=${email}&name=${name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result: ApiDeleteResponse = await response.json();

        if (result.message.status === 200) {
          const updated = documents.filter(doc => doc.name !== name);
          setDocuments(updated);
          setFilteredDocuments(updated);
          setRefreshTempletes(true);

          toast.error('Document Deleted successfully', {
            position: "top-right",
            autoClose: 500,
            theme: "dark",
            transition: Flip,
          });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
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

  // Edit handler
  const handleEdit = (documentData: DocumentList) => {
    navigate(`/document/${documentData.name}`, { state: { documentData } });
  };

  // Instant filter logic
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.document_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(doc =>
        doc.document_created_at.startsWith(dateFilter)
      );
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, dateFilter, documents]);

  // Show All button clears filters
  const handleShowAll = () => {
    setSearchTerm('');
    setDateFilter('');
    setFilteredDocuments(documents); // reset to all
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
      {/* Search & Date filter + Show All */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          className="bg-[#283C42] text-white px-4 py-2 rounded"
          onClick={handleShowAll}
        >
          Show All
        </button>
      </div>

      {/* Document List (old design) */}
      <div className="flex flex-wrap gap-4">
        {filteredDocuments.map((document, index) => (
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

            {/* Card content (old design preserved) */}
            <div 
              className="bg-[#283C42] text-white rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer p-4 w-full h-full"
              onClick={() => handleEdit(document)}
            >
              <h3 className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">{document.document_title}</h3>
              <h4 className="font-bold text-xs text-ellipsis overflow-hidden whitespace-nowrap">{document.template_title.replace(/-\d+$/, '')}</h4>
              <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                {new Date(document.document_created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
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
