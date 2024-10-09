import { Modal } from "antd";
import { useState, useEffect } from "react";
import { ToastContainer, toast ,Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface SendDocProps {
  owner_email: string;
  assigned_user: string[];
  template_tite: string;
  document_title: string;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClickSaveDoc: () => void;
}



function SendDoc({ owner_email, assigned_user, template_tite, document_title , setTarget , onClickSaveDoc }: SendDocProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [emails, setEmails] = useState<{ [key: number]: { email: string; status: string } }>({});
  const [newEmail, setNewEmail] = useState<string>('');
  const [mailTitle,setMailTitle] = useState<string>(`${document_title}-(${template_tite})`);
  const [mailBody, setMailBody] = useState<string>('');
  const [checked, setChecked] = useState<number>(1);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (mailTitle && mailBody && Object.keys(emails).length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newEmail, mailTitle, mailBody, emails]);

  const navigate = useNavigate();
  useEffect(() => {
    const formattedEmails = assigned_user.reduce((acc, email, index) => {
      acc[index] = { email, status: 'unseen' };
      return acc;
    }, {} as { [key: number]: { email: string; status: string } });

    setEmails(formattedEmails);
  }, [assigned_user]);

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(e.target.checked ? 1 : 0);
  // };
  const handleMailTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMailTitle(e.target.value);
  };
  const handleMailBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMailBody(e.target.value);
  };
 const addEmail = () => {
    if (newEmail && !Object.values(emails).some(e => e.email === newEmail)) {
      const newIndex = Object.keys(emails).length;
      setEmails({ ...emails, [newIndex]: { email: newEmail, status: 'unseen' } });
      setNewEmail('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    const updatedEmails = Object.keys(emails)
      .filter(key => emails[parseInt(key)].email !== emailToRemove)
      .reduce((acc, key, index) => {
        acc[index] = emails[parseInt(key)];
        return acc;
      }, {} as { [key: number]: { email: string; status: string } });

    setEmails(updatedEmails);
  };
  const sendDialogHandle = () => {
    
    setTarget(null);
    setVisible(true);
  };
  
    const sendMail = async () => {
      setVisible(false)

      
      const DocumentObj = {
        to: JSON.stringify(emails , null , 2) ,
        subject: mailTitle,
        body: mailBody,
        document_name: document_title,
        user_mail: owner_email,
        isChecked: checked,
      };
      // // console.log(DocumentObj);
      try {
        const response = await fetch('/api/method/esign_app.api.send_document_data', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(DocumentObj),
        });
        const result = await response.json();
        // // console.log(result);
        if (result.message.status < 300) {
          onClickSaveDoc()
          toast.success('Document Assigned Successfully', {
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
          setTimeout(() => {
            navigate('/documents');
          }, 2000);
        } else {
          toast.error('Error While Sending Document...', {
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
      } catch (error) {
        toast.error('Server Error, Please Try Again...', {
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
    };


  return (
    <>
      <button 
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
        onClick={sendDialogHandle}
      >
        Send Document
      </button>   

      <Modal
        title="Send Document"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={"100vh"}
      >
        <div className="bg-[#283C42] text-white p-6 rounded-md shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">From:</label>
            <input
              type="email"
              value={owner_email}
              disabled
              className="w-full px-3 py-2 rounded bg-gray-300 text-gray-700 cursor-not-allowed text-xs"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">To:</label>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Add email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white text-black text-xs"
              />
              <button
                type="button"
                onClick={addEmail}
                className="bg-[#283C42] text-white px-3 py-2 rounded text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="mt-2 max-h-24 overflow-y-auto">
              <ul>
                {Object.keys(emails).map(key => (
                  <li
                    key={key}
                    className="flex justify-between items-center bg-white text-black text-xs px-3 py-2 rounded mb-1"
                  >
                    <span>{emails[parseInt(key)].email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(emails[parseInt(key)].email)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">Title:</label>
            <input
              type="text"
              value={mailTitle}
              onChange={handleMailTitleChange}
              className="w-full px-3 py-2 rounded bg-white text-black text-xs"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">Description:</label>
            <textarea
              onChange={handleMailBodyChange}
              rows={6}
              className="w-full px-3 py-2 rounded bg-white text-black text-xs"
                       />
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-[#283C42] rounded"
                checked={checked === 1}
                onChange={handleCheckboxChange}
              />
              <label className="ml-2 text-xs">Freeze</label>
            </div> */}
            <button
              type="submit"
              onClick={sendMail}
              className={`bg-white text-[#283C42] px-4 py-2 rounded-md font-semibold text-xs ${!isFormValid? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={!isFormValid}
            >
              Send
            </button>
          </div>
        </div>
      </Modal>

    </>
  );
}

export default SendDoc;
