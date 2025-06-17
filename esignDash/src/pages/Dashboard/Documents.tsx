import  { useState ,useEffect } from 'react';
import { ToastContainer, toast ,Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectEmail } from '../../redux/selectors/userSelector';
import { Modal ,Tabs, Card, List } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DocumentAllList from './Document/DocumentAllList';
import { pdfToBase64 } from './helper/PDFtoBase64';
import { splitPDF } from './helper/GetPages';

interface BasePDFInterface
{
  page: number;
  data: string;
}
interface ApiResponse {
  message: {
    status: number;
    data: Template[];
  };
}
interface Template {
  name: string;
}
interface DocumentList {
  name: string;
  document_title: string;
  template_title: string;
  owner_email: string;
  document_created_at: string;
}

const { TabPane } = Tabs;
function Documents() {
  const [datapdf , setdatapdf] = useState<BasePDFInterface[]>();
  const [fileName, setFileName] = useState<string | null>(null)
  const [refreshTempletes, setRefreshTempletes] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const email = useSelector<string>(selectEmail);
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [flagForField,setFlagForField] = useState(0);

  useEffect(() => {
    const fetchTempletes = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_templetes_list_doc?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result:ApiResponse = await response.json();
        // // // console.log("Template Fetch Result :"+ JSON.stringify(result));
        if (result.message.status === 200) {
          const names = result.message.data.map(item => item.name);
          setTemplateNames(names);
          // // // console.log(templateNames);
        } else {
          
        }
      } catch (error) {
     
      }
    };

    fetchTempletes();
  }, []);

  const removeSelectedTemAndTitle = () =>{
    setCurrentTab('1');
    setTitle('')
    setSelectedTemplate('')
    setVisible(false);
  }
  const openDialogBox = () =>{
    setCurrentTab('1');
    setTitle('')
    setSelectedTemplate('')
    setVisible(true);
  }
  const navigate = useNavigate();
  const handleEdit = (documentData: DocumentList) => {
    console.log('inside handleEdit',documentData)
    navigate(`/document/${documentData.name}`, { state: { documentData: documentData } });
  };
  const saveTemplateDocument = async () => {
    if (flagForField === 0 && !datapdf) {
      toast.error('Please upload the base document PDF before proceeding.', {
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
      return;
    } 

    setVisible(false)
    const DocumentObj = {
      templete_name: selectedTemplate,
      document_name: title,
      user_email: email,
      manual_data_pdf: flagForField === 0 ? datapdf : null,
      isFixedPdf: flagForField
    };
    try {
      const response = await fetch('/api/method/esign_app.api.save_template_document', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(DocumentObj),
      });
      const result = await response.json();
      // // // console.log(result);
      if (result.message.status < 300) {
        toast.success('Document Created Successfully', {
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
        console.log("way to click " , result)
        handleEdit(result.message.data)
        clearFunctionModel();
        removeSelectedTemAndTitle();
        setRefreshTempletes((prev: boolean) => !prev); 
      } else {
        toast.error('Error while saving Document', {
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
        removeSelectedTemAndTitle();
      }
    } catch (error) {
     
    }
  };

  const clearFunctionModel = () =>{
  setCurrentTab('1');
  setTitle('');
  setSelectedTemplate('');
  setVisible(true);
  }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const base64String = await pdfToBase64(file);
        const result = await splitPDF(base64String);
        setFileName(file ? file.name : null)
        setdatapdf(result); 
      }
    };
    
  
  const nextTab = async() => {
    if (currentTab === '1') {
      if(title == '')
      {
        toast.error('Enter Title', {
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
        return;
      }else if(title.length < 5){
        toast.error('Title must have more than 5 words', {
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
    return;
      }
      setCurrentTab('2');
    } else if (currentTab === '2') {
      if(selectedTemplate == '')
      {
        toast.error('Select Template', {
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
          return;
      }
      console.log("Temp--->",selectedTemplate)
      // fetch and check set , so in 3rd tab will compare and validate 
      try {
        const response = await fetch(`/api/method/esign_app.api.get_templetes_fixstatus?name=${selectedTemplate}`);
        const result = await response.json();
        const useDefaultBasePdf = result?.message?.data?.[0]?.use_default_base_pdf;
        setFlagForField(useDefaultBasePdf)
      } catch (error) {

        console.error('Error:', error);
      }
      setCurrentTab('3');
    }
  };

  const previousTab = () => {
    if (currentTab === '2') {
      setCurrentTab('1');
    } else if (currentTab === '3') {
      setCurrentTab('2');
    }
  };


  useEffect(() => {
    console.log("____________________> useeffect");
    const handleKeyDownTab1_2 = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        nextTab(); 
      }
    };
    const handleKeyDownTab3 = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        saveTemplateDocument(); 
      }
    };

if(visible)
{
  if(currentTab == '1' || currentTab == '2' )
  {
        window.addEventListener('keydown', handleKeyDownTab1_2);
  }
  if(currentTab == '3')
  {
         window.addEventListener('keydown', handleKeyDownTab3);
  }
}
    
    

    return () => {
      window.removeEventListener('keydown', handleKeyDownTab1_2);
      window.removeEventListener('keydown', handleKeyDownTab3);
    };
  }, [currentTab,selectedTemplate,title]);

  return (
    <>
      <div className="mb-5">
        <button
          onClick={() =>  openDialogBox()}
          // onDoubleClick={() => setVisible(true)}
          className=" mt-2 mr-2 bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
        >
          Create Document
        </button>
      </div>
      <div> 
      <DocumentAllList refreshTempletes={refreshTempletes} setRefreshTempletes={setRefreshTempletes} />    
      </div>

  <Modal
  title="Create Document"
  open={visible}
  onCancel={() => setVisible(false)}
  footer={null}
  className="glass-modal"
>
  <div>
    <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
      {/* --- Tab 1: Title --- */}
      <TabPane
        tab={
          <span className={currentTab === '1' ? 'text-white font-semibold' : 'text-gray-400'}>
            Title
          </span>
        }
        key="1"
        disabled
      >
        <div className="space-y-4">
          <input
            className="bg-white/70 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
            placeholder="Enter Document Title"
            value={title}
            onChange={(e) => {
              const formattedValue = e.target.value.replace(/\s{2,}/g, ' ');
              setTitle(formattedValue);
            }}
          />
          <div className="text-right">
            <button
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={nextTab}
            >
              Next
            </button>
          </div>
        </div>
      </TabPane>

      {/* --- Tab 2: Templates --- */}
      <TabPane
        tab={
          <span className={currentTab === '2' ? 'text-white font-semibold' : 'text-gray-400'}>
            Templates
          </span>
        }
        key="2"
        disabled
      >
        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden rounded">
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={templateNames}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => setSelectedTemplate(item)}
                  style={{
                    backgroundColor: selectedTemplate === item ? '#283C42' : 'rgba(255, 255, 255, 0.6)',
                    color: selectedTemplate === item ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {(item as string).split('-').slice(0, -1).join('-')}
                </Card>
              </List.Item>
            )}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={previousTab}
          >
            Previous
          </button>
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={nextTab}
          >
            Next
          </button>
        </div>
      </TabPane>

      {/* --- Tab 3: Confirm --- */}
      <TabPane
        tab={
          <span className={currentTab === '3' ? 'text-white font-semibold' : 'text-gray-400'}>
            Confirm
          </span>
        }
        key="3"
        disabled
      >
        <div className="space-y-2 text-white">
          <p>Title: <span className="font-semibold">{title}</span></p>
          <p>Email: <span className="font-semibold">{email as React.ReactNode}</span></p>
          <p>Template Name: <span className="font-semibold">{selectedTemplate}</span></p>
        </div>

        {flagForField === 0 && (
          <div className="mt-6">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="w-full block text-center bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer"
            >
              {fileName ? 'Change File' : 'Upload PDF'}
            </label>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={previousTab}
          >
            Previous
          </button>
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={saveTemplateDocument}
          >
            Confirm
          </button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</Modal>

      
      <ToastContainer
      limit={1}
      />
    </>
  );
}

export default Documents;

// card 2nd Style 
//  <div key={document.id} className="mt-10">
//     <div className="notification">
//     <div className=" "></div>
//     <div className="notiborderglow"></div>
//     <div className="notititle"><h2><b> {document.documentName} </b></h2></div>
//     <div className="notibody"><p>Email: {document.email}<br/> <p>Created At: {document.createdAt}</p> </p></div>
//     </div>
// </div>