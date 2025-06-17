import { Modal, Tabs, Select } from "antd";
import { useState, useEffect } from "react";
import { ToastContainer, toast ,Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { TrashBin2BoldDuotone } from "../../../../svg/TrashBin2BoldDuotone";
interface SendDocProps {
  owner_email: string;
  assigned_user: string[];
  template_tite: string;
  document_title: string;
  setTarget: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClickSaveDoc: () => void;
}
interface EmailEntry {
  email: string;
  status: string;
}
type EmailWithStatus = { email: string; status?: string };
type EmailOnly = { email: string };

function SendDoc({ owner_email, assigned_user, template_tite, document_title , setTarget , onClickSaveDoc }: SendDocProps) {
  const { TabPane } = Tabs;
  const [visible, setVisible] = useState<boolean>(false);
  const [emails, setEmails] = useState<Record<number, EmailEntry>>({});
  const [newEmail, setNewEmail] = useState<string>("");
  const [mailTitle, setMailTitle] = useState<string>(`${document_title}-(${template_tite})`);
  const [mailBody, setMailBody] = useState<string>("");
  const [checked, setChecked] = useState<number>(1);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templates, setTemplates] = useState<{ name: string }[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true);
  const [additionalEmail, setAdditionalEmail] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<{ email: string }[]>([]);

const addAdditionalEmail = () => {
  if (additionalEmail && ![...Object.values(emails), ...additionalEmails].some(e => e.email === additionalEmail)) {
    setAdditionalEmails([...additionalEmails, { email: additionalEmail }]);
    setAdditionalEmail("");
  }
};

function normalizeEmailList(
  emails: Record<number, EmailWithStatus>,
  additionalEmails: (string | { email: string })[]
): Record<number, EmailOnly> {
  const strippedEmails: EmailOnly[] = Object.values(emails).map((e) => ({
    email: e.email
  }));
  const normalizedAdditional: EmailOnly[] = additionalEmails.map((e) =>
    typeof e === "string" ? { email: e } : { email: e.email }
  );
  const merged: EmailOnly[] = [...strippedEmails, ...normalizedAdditional];
  const result: Record<number, EmailOnly> = {};
  merged.forEach((entry, index) => {
    result[index] = entry;
  });
  return result;
}

const removeFromCombined = (emailToRemove: string) => {
  // Remove from additionalEmails only (not from main tab's `emails`)
  setAdditionalEmails(additionalEmails.filter(e => e.email !== emailToRemove));
};


  useEffect(() => {
    if (mailTitle && mailBody && Object.keys(emails).length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newEmail, mailTitle, mailBody, emails]);

  const navigate = useNavigate();

  useEffect(() => {
    const formattedEmails: Record<number, EmailEntry> = assigned_user.reduce((acc, email, index) => {
      acc[index] = { email, status: "unseen" };
      return acc;
    }, {} as Record<number, EmailEntry>);

    setEmails(formattedEmails);
  }, [assigned_user]);


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/resource/Email Template?fields=[\"name\"]");
        if (!response.ok) throw new Error("Failed to fetch email templates");
        const result = await response.json();
        setTemplates(result.data);
      } catch (error) {
        console.error("Error fetching email templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

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

  const FetchEmailTemplate = async () => {
    try {
      const response = await fetch("/api/method/frappe.email.doctype.email_template.email_template.get_email_template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_name: selectedTemplate, doc: {} }),
      });

      if (!response.ok) throw new Error("Failed to fetch email template");

      const data = await response.json();
      setMailTitle(data.message.subject);
      setMailBody(data.message.message);
    } catch (error) {
      console.error("Error fetching email template:", error);
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



      const mailUsers = normalizeEmailList(emails, additionalEmails);
      const DocumentObj = {
        to: JSON.stringify(emails , null , 2) ,
        mailUsers: JSON.stringify(mailUsers, null, 2),
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
  width="60vw"
  rootClassName="glass-modal"
>
  <div>
    <Tabs defaultActiveKey="1" className="[&_.ant-tabs-tab]:text-white">
      {/* Tab 1: Compose Mail */}
      <TabPane tab="Compose" key="1">
        <div className="space-y-6">
          {/* From Email */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">From:</label>
            <input
              type="email"
              value={owner_email}
              disabled
              className="w-full px-3 py-2 rounded bg-white/10 text-white text-xs border border-white/10 cursor-not-allowed backdrop-blur-sm"
            />
          </div>

          {/* To Emails */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">To:</label>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Add email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/10 text-white text-xs border border-white/10 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={addEmail}
                className="bg-white/20 text-white px-3 py-2 rounded text-xs font-semibold border border-white/10 backdrop-blur-sm hover:bg-white/30"
              >
                Add
              </button>
            </div>
            <div className="mt-3 max-h-24 overflow-y-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.keys(emails).map((key) => (
                  <li
                    key={key}
                    className="flex justify-between items-center bg-white/10 text-white text-xs px-3 py-2 rounded border border-white/10 backdrop-blur-sm"
                  >
                    <span className="truncate">{emails[parseInt(key)].email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(emails[parseInt(key)].email)}
                      className="text-red-400 text-xs font-semibold hover:text-red-500"
                    >
                      <TrashBin2BoldDuotone size="1.2em" color="red" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="text-xs font-semibold mb-1 text-white">Select Template:</label>
            <div className="flex items-center gap-2 w-full">
              <Select
                showSearch
                value={selectedTemplate}
                onChange={(value: string) => setSelectedTemplate(value)}
                filterOption={(input, option) =>
                  option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                }
                options={templates.map((template) => ({
                  label: template.name,
                  value: template.name,
                }))}
                className="flex-1 glass-select"
              />
              <button
                type="button"
                onClick={FetchEmailTemplate}
                className="bg-white/20 text-white px-4 py-2 rounded text-xs border border-white/10 backdrop-blur-sm hover:bg-white/30"
              >
                Load Template
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">Title:</label>
            <input
              type="text"
              value={mailTitle}
              onChange={(e) => setMailTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 text-white text-xs border border-white/10 backdrop-blur-sm rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">Description:</label>
            <div className="bg-white/10 text-white p-2 rounded border border-white/10 backdrop-blur-sm">
              <ReactQuill theme="snow" value={mailBody} onChange={setMailBody} />
            </div>
          </div>

          {/* Send Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={sendMail}
              className={`bg-white/20 text-white px-4 py-2 rounded-md font-semibold text-xs border border-white/10 backdrop-blur-sm hover:bg-white/30 ${
                !isFormValid ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
              disabled={!isFormValid}
            >
              Send
            </button>
          </div>
        </div>
      </TabPane>

      {/* Tab 2: Manage Email List */}
      <TabPane tab="Manage Emails" key="2">
        <div className="space-y-6">
          {/* Add More Emails */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">Add More Emails:</label>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter email"
                value={additionalEmail}
                onChange={(e) => setAdditionalEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/10 text-white text-xs border border-white/10 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={addAdditionalEmail}
                className="bg-white/20 text-white px-3 py-2 rounded text-xs font-semibold border border-white/10 backdrop-blur-sm hover:bg-white/30"
              >
                Add
              </button>
            </div>
          </div>

          {/* Combined Email List */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-white">All Emails:</label>
            <div className="max-h-40 overflow-y-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[...Object.values(emails), ...additionalEmails].map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white/10 text-white text-xs px-3 py-2 rounded border border-white/10 backdrop-blur-sm"
                  >
                    <span className="truncate">{item.email}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCombined(item.email)}
                      className="text-red-400 hover:text-red-500 font-semibold"
                    >
                      <TrashBin2BoldDuotone size="1.2em" color="currentColor" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</Modal>

    </>
  );
}

export default SendDoc;
