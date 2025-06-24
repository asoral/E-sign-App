import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { selectFullName, selectEmail } from '../../../redux/selectors/userSelector';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface TempleteAddProps {
  setRefreshTempletes: Dispatch<SetStateAction<boolean>>;
}
interface Templete {
  name: string;
  templete_title: string;
  templete_owner_email: string;
  templete_owner_name: string;
  templete_created_at: string;
}

const TempleteAdd: React.FC<TempleteAddProps> = ({ setRefreshTempletes }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [templeteName, setTempleteName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const fullName = useSelector(selectFullName);
  const email = useSelector(selectEmail);
  const navigate = useNavigate();
  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTempleteName(null);
    setErrorMessage(null); // Clear error message on modal close
  };

  const cancelModal = () => {
    setModalVisible(false);
    setTempleteName(null);
    setErrorMessage(null); // Clear error message on modal cancel
  };

  const handleTempleteNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formattedValue = newValue.replace(/\s{2,}/g, ' ');
    setTempleteName(formattedValue); 
    if (errorMessage) {
      setErrorMessage(null); // Clear error message on input change
    }
  };


  const handleEdit = (templeteData: Templete | Templete[]) => {
    // Convert array to object by using the first element if it's an array
    const templete = Array.isArray(templeteData) ? templeteData[0] : templeteData;
  
    // Now you can safely access templeteObject.name
    console.log("Here is the navigate function", templete.name);
    navigate(`/templete/${templete.name}`, { state: { templete: templete } });
  };
  
  function parseServerError(raw: any): string {
  if (!raw) return "An unexpected error occurred.";

  // Try common structured patterns
  if (typeof raw === 'object') {
    if (raw.message && typeof raw.message === 'string') {
      if (raw.message.includes("Duplicate entry")) {
        return "A template with this name already exists.";
      }
      if (raw.message.includes("IntegrityError")) {
        return "A database integrity constraint was violated.";
      }
      return raw.message;
    }

    // If message is nested deeper or in list form
    if (Array.isArray(raw.message)) {
      return raw.message.join(' ');
    }

    // If it's an error object like frappe API
    if (raw._server_messages) {
      try {
        const messages = JSON.parse(raw._server_messages);
        const decoded = messages.map(m => {
          const parsed = JSON.parse(m);
          return parsed.message || '';
        });
        return decoded.join(' ') || "An unknown server error occurred.";
      } catch (e) {
        return "Server sent an unreadable error message.";
      }
    }
  }

  // If raw is just a string
  if (typeof raw === 'string') {
    if (raw.includes("Duplicate entry")) return "A template with this name already exists.";
    if (raw.includes("IntegrityError")) return "A database integrity constraint was violated.";
    return raw;
  }

  return "An unknown error occurred while processing your request.";
}

  const saveTemplete = async () => {
    setButtonDisable(true);
    if (!templeteName) {
      setErrorMessage("No value provided for templete name");
      setButtonDisable(false);
      return;
    } else if (templeteName.length < 4) {
      setErrorMessage("Enter a name with more than 4 characters");
      setButtonDisable(false);
      return;
      
    } else {
      const templeteObject = {
        templete_name: templeteName,
        user_full_name: fullName,
        user_email: email,
      };

      try {
        const response = await fetch('/api/method/esign_app.api.save_templete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': window.csrf_token,

          },
          body: JSON.stringify(templeteObject),
        });

        const result = await response.json();
        console.log(result);
        if (result.message.status < 300) {
          toast.success('Templete Created Successfully', {
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
          setTempleteName(null);
          setModalVisible(false);
          setRefreshTempletes((prev: boolean) => !prev); 
          setButtonDisable(false);

          handleEdit(result.message.data)
          
        } else {
          const errorMsg = parseServerError(result.message);

          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Flip,
          });
           setButtonDisable(false);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the templete');
         setButtonDisable(false);
      }
    }
  };
  useEffect(() => {
    if(modalVisible){
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') 
        {
          if(buttonDisable == false)
          {
            setButtonDisable(true)
            saveTemplete().then(() =>setButtonDisable(false))
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [modalVisible,fullName ,templeteName]);

  return (
    <>
      <div>
        <button
          className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={showModal}
        >
          Add Templete
        </button>
      </div>
      <Modal
  title="Add Template"
  open={modalVisible}
  onCancel={cancelModal}
  rootClassName="glass-modal"
  footer={[
    <div key="footer-buttons" className="flex justify-end gap-2 px-4 pb-4">
      <button
        disabled={buttonDisable}
        onClick={saveTemplete}
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
      >
        Save
      </button>
      <button
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#ca2424] hover:bg-white hover:text-[#ca2424] transition-colors duration-300"
        onClick={cancelModal}
      >
        Cancel
      </button>
    </div>,
  ]}
>
  <div className="px-2 pb-4">
    {/* <label className="block text-white text-sm font-semibold mb-2">Template Name</label> */}
    <input
      className="w-full mt-5 bg-white/20 text-white placeholder:text-white/60 backdrop-blur-md border border-white/30 rounded py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
      type="text"
      value={templeteName || ""}
      onChange={handleTempleteNameInput}
      placeholder="Enter template name"
    />
    {errorMessage && (
      <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
    )}
  </div>
</Modal>

      <ToastContainer limit={1} />
    </>
  );
}

export default TempleteAdd;
