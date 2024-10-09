import  { useState ,useEffect } from 'react';
import { ToastContainer, toast ,Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectEmail } from '../../redux/selectors/userSelector';
import { Modal ,Tabs, Card, List } from 'antd';
import { useSelector } from 'react-redux';
import DocumentAllList from './Document/DocumentAllList';

interface ApiResponse {
  message: {
    status: number;
    data: Template[];
  };
}
interface Template {
  name: string;
}


const { TabPane } = Tabs;
function Documents() {
  
  const [refreshTempletes, setRefreshTempletes] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const email = useSelector<string>(selectEmail);
  const [templateNames, setTemplateNames] = useState<string[]>([]);

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
  const saveTemplateDocument = async () => {

    setVisible(false)
    const DocumentObj = {
      templete_name: selectedTemplate,
      document_name: title,
      user_email: email,
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

  const nextTab = () => {
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
      >
        <Tabs 
          activeKey={currentTab} 
          onChange={key => setCurrentTab(key)}>
          <TabPane 
           tab={
            <span
              style={{
                color: currentTab === '1' ? '#283C42' : '#a0aec0',
              }}
            >
              Title
            </span>
          }
          disabled key="1">
              <input
              className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                placeholder="Enter Document Title"
                value={title}
                onChange={e =>{
                  const newValue = e.target.value;
                  const formattedValue = newValue.replace(/\s{2,}/g, ' ');
                  setTitle(formattedValue);
                }
                } 
              />
            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <button 
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={nextTab}>Next</button>
            </div>
          </TabPane>
          <TabPane  tab={
            <span
              style={{
                color: currentTab === '2' ? '#283C42' : '#a0aec0',
              }}
            >
              Templates
            </span>
          } disabled key="2">
            <div 
            className="doc-temp-scroll-container"
            style={{ maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden' }}>
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={templateNames}
                renderItem={item => (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => setSelectedTemplate(item)}
                      style={{ backgroundColor: selectedTemplate === item ? '#283C42' : '#fff' ,  color: selectedTemplate === item ? '#fff' : '#000' }}
                    >
                      {(item as string).split('-')[0]}
                    </Card>
                  </List.Item>
                )}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button 
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={previousTab}>Previous</button>
              <button 
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={nextTab}>Next</button>
            </div>
          </TabPane>
          <TabPane  tab={
            <span
              style={{
                color: currentTab === '3' ? '#283C42' : '#a0aec0',
              }}
            >
              Confirm
            </span>
          } disabled key="3">
            <div>
              <p>Title: {title}</p>
              <p>Email: {email as React.ReactNode}</p>
              <p>Template Name: {selectedTemplate}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button 
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={previousTab}>Previous</button>
              <button 
              className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
              onClick={() =>saveTemplateDocument()}>Confirm</button>
            </div>
          </TabPane>
        </Tabs>
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