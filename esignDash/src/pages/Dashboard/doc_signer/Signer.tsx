import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';
// import back canva from "./pdfsb";  
import Moveable from 'react-moveable';
import { PDFDocument, rgb , StandardFonts  } from 'pdf-lib';
import { PDFArray, PDFDict, PDFName, PDFString, PDFRef } from 'pdf-lib';
// Helper Custom ---
import PdfRenderer from '../helper/pdfsb/PdfRenderer';
import { datapdfDemo } from '../helper/DataPDF'
import { BlankDatapdf } from '../helper/BlankPDF'
import { ComponentData } from '../helper/Interface'
import { splitPDF } from '../helper/GetPages';
import { pdfToBase64 } from '../helper/PDFtoBase64';

import SignInput from '../helper/SignInput';
import './document.css' 
import { extractUniqueElements } from '../helper/extractUniqueElements';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../../redux/selectors/userSelector';
import dayjs from '../helper/dayjsConfig';
import SignerInput from './SignInput'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import {BlobToBase64} from '../helper/BlobToBase64'
import {Base64ToBlob} from '../helper/Base64ToBlob'
import OpenSSLAllList from '../OpenSSL/OpenSSLAllList';
import RejectDoc from '../../../components/RejectDoc';
import { parseCertificate } from '../helper/certDataExtract'

interface User {
  email: string;
  status: 'unseen' | 'open' | 'close';
}
type OpenSSLKey = {
  name: string;
  status: string;
};

interface EmailStatus {
  [key: string]: {
    email: string;
    status: string;
  };
}

type SelectedComponent = {
  id: number;
  type: ComponentType | string;
  checked:boolean;
  content:any;
} | null;

type ComponentType = "text" | "image";

interface DocumentList {
    name: string;
    document_title: string;
    template_title: string;
    owner_email: string;
    document_created_at: string;
    
  }

interface BasePDFInterface
{
  page: number;
  data: string;
}

const Signer = () => {
    
  const [documentStatusUser , setDocumentStatusUser] = useState(false);
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [emailData, setEmailData] = useState<EmailStatus | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [datapdf , setdatapdf] = useState<BasePDFInterface[]>(BlankDatapdf);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(null);
  const moveableRef = useRef<Moveable | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const [assignedUser , setAssignedUser] = useState<String[]>([])
  const [isCompleted, setIsCompleted] = useState(0);
  const [isRejected, setIsRejected] = useState(0);
  const { documentData } = location.state as { documentData?: DocumentList } || {};
  const [openSSL_List, setOpenSSL_List] = useState<OpenSSLKey[]>([]);
  const [openSSLname, setOpenSSLname] = useState<string>('')
  const email = useSelector(selectEmail);
  const navigate = useNavigate();
  if (!documentData) {
    console.log("No document data",JSON.stringify(documentData));
    return <p>Document not found</p>;
  }
  useEffect(() => {
    if (selectedId !== null) {
      const component = components.find(c => c.id === selectedId);
      if (component) {
        setSelectedComponent({ id: component.id, type: component.type,checked : component.checked ?? false , content: component.content  });
      } else {
        setSelectedComponent(null);
      }
    }
  }, [selectedId, target, components]);


useEffect(()=>{
  console.log("Fetch Data before if useEffect  --->>>>>")
  if(!isCompleted)
  {
    console.log("Fetch Data Inside if isCompleted --->>>>>")
    const fetchAssignedUsers = async () => {
      try {
        console.log("Fetch Data Inside function inside try --->>>>>")
        const response = await fetch(
          `/api/method/esign_app.api.get_assigned_users_list_check?user_document_name=${documentData.name}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          console.log("response Is OK --->>>>>")
          const data = await response.json();
          setAssignedUsers(data.message.data.assigned_users || []);
          setOpenSSL_List(data.message.data.opensslusedlist || []);
          setIsRejected(data.message.data.isRejected || 0 )
          console.log('Data OPen SSL =======>',data.message.data.opensslusedlist)

          const assignedUsers: Record<string, User> = JSON.parse(data.message.data.assigned_users);
          console.log("here is Assigned user List data",assignedUsers);
          const statusCounts: Record<string, number> = {
            unseen: 0,
            open: 0,
            close: 0,
          };

          Object.values(assignedUsers).forEach((user) => {
            if (user.status in statusCounts) {
              statusCounts[user.status]++;
            }
          });
          console.log(statusCounts,"-------------------->IMG Count-------------")
          if (statusCounts.unseen > 0) {
            setIsCompleted(0);
            return;
          }
          if (statusCounts.open > 0) {
            setIsCompleted(0);
            return;
          } 
          
          if((statusCounts.open + statusCounts.unseen)==0){
            setIsCompleted(1);
            updateDocumentStatus();
          }

        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
      
      }
    };

    fetchAssignedUsers();
  }

},[])

const updateDocumentStatus = async () => {
  console.log('inside updateDocumentStatus');
  try {
    const response = await fetch(
      `/api/method/esign_app.api.update_document_status_confirm?user_document_name=${documentData.name}`,
      {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      console.log('inside updateDocumentStatus ------------> OK')
      const data = await response.json();
      console.log(data.message , 'Document status updated successfully.',isCompleted);
    } else {

    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {

  }
};

  useEffect(() => {

    const fetchTemplateData = async () => {
      
      try {
        const response = await fetch(`/api/method/esign_app.api.get_document_components_and_basepdf?document_name=${documentData?documentData.name:''}`);
        const result = await response.json();
        // // // console.log("documentData :" ,JSON.stringify(documentData));
        console.log(result);
        if(result.message.document_json_data == null || result.message.base_pdf_datad == null)
        {
          return ;
        }
        if (result.message.status === 200) {
          
          setIsCompleted(result.message.iscompleted)

          const parsedData = typeof result.message.document_json_data === 'string'
          ? JSON.parse(result.message.document_json_data)
          : result.message.document_json_data;

          const BasePDFData = typeof result.message.base_pdf_datad === 'string'
          ? JSON.parse(result.message.base_pdf_datad)
          : result.message.base_pdf_datad;


          const userStatusDoc = typeof result.message.assigned_users === 'string'
          ? JSON.parse(result.message.assigned_users)
          : result.message.assigned_users;
          setEmailData(userStatusDoc)
          console.log("User Status Document list ------------------>", userStatusDoc);
            try{
              for (let index in userStatusDoc) {
                if (userStatusDoc.hasOwnProperty(index)) {
                  const user = userStatusDoc[index];
                  if (user.email === email) {
                    console.log(`Email found at index ${index}, status: ${user.status}`);
        
                    if (user.status === "unseen") {
                      user.status = "open";
                      userStatusDoc[index] = user;
                      setEmailData(userStatusDoc)
                      const UserStatusUpdate = {
                        document_title : documentData.name,
                        assigned_user_list : JSON.stringify(userStatusDoc)
                      }
                      try {
                        const response = await fetch('/api/method/esign_app.api.patch_user_status_document', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(UserStatusUpdate)
                        });
                    
                        const result = await response.json();
                       console.log(JSON.stringify(result));
                        if (result.message.status < 300) {
                         
                        } else {
                         
                        }
                      } catch (error) {
                        console.error('Error:', error);
                      }
                      
                    }else if(user.status === "close")
                    {
                      setDocumentStatusUser(true);
                      console.log(`Status: ${user.status}`);
                    }
                    break; 
                  }
                }
              }
            }catch(e)
            {

            }



          // console.log("here----->",userStatusDoc)
          // const userArray = Object.values(userStatusDoc);
          // const user = userArray.find((userObj:any,index) => userObj[index].email === email);

          // console.log("userList" ,user);

            console.log("Parrsed data : " , parsedData)
        setComponents(parsedData);
        setdatapdf(BasePDFData);
        } else {

        }
      } catch (error) {

        console.error('Error:', error);
      }
    };

    fetchTemplateData();
    addAssignUser();
  }, []);
  const addAssignUser = () =>{
    const AssignedUsers: string[] = extractUniqueElements(components);
    setAssignedUser(AssignedUsers);
  }
  useEffect(() => {
    addAssignUser();
  },[components])

  useEffect(() => {
    if (selectedId !== null) {
      const component = components.find(c => c.id === selectedId);
      if (component) {
        setSelectedComponent({ id: component.id, type: component.type,checked : component.checked ?? false , content: component.content  });
      } else {
        setSelectedComponent(null);
      }
    }
  }, [selectedId, target, components]);

const handleNextPage = () => {
  if (currentPage < datapdf.length - 1) {
    setCurrentPage(currentPage + 1); setTarget(null); setSelectedId(null);
  }
};

const Print_PDF_Merged_Valid = async() =>{
  mergeAndPrintPDF();
  try {
    const response = await fetch('/api/method/esign_app.api.generate_and_sign_pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_name: documentData.name,
      }),
    });

    const result = await response.json();
    console.log(JSON.stringify(result));
    const base64blob  = await Base64ToBlob(result.message)
    console.log(result.signed_pdf_base64)
    const url = URL.createObjectURL(base64blob);
    const varName = `esignDoc-${documentData.document_title}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${varName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (result.message.status < 300) {
       toast.success('PDF genrated Successfully', {
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
        window.open(result.message.pdf_url, '_blank');
      }, 2500);
    } else {
      console.error('Error printing PDF:', result.message.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const submitFinalDocument = async () => {
  const documentObj = {
    document_title :documentData.name,
    document_json_data: JSON.stringify(components),
    opensslusedlist: openSSL_List
  };
  try {
    const response = await fetch('/api/method/esign_app.api.submit_final_document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentObj),
    });

    const result = await response.json();
    console.log(JSON.stringify(result));
    if (result.message.status < 300) {

      handleChangeStatus();
      toast.success('Document Submitted Successfully', {
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
        window.location.reload();
      }, 2000);
    } else {
      toast.error('Error Submitting Document...', {
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
const handleChangeStatus = () => {
  if (emailData) {
    const updatedData = { ...emailData };
    let isUpdated = false;

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key].email === email && updatedData[key].status === "open") {
        updatedData[key].status = "close";  
        isUpdated = true;

        setEmailData(updatedData);

        console.log("Updated data of assigned users:", updatedData);
        
        sendToAPI(updatedData);  
      }
    });

    if (!isUpdated) {
      console.log('No matching user with "open" status found.');
    }
  }
};

const handleCancel = () => {
  setIsModalVisible(false);
};

const handleConfirm = () => {
  // save OPenssl Aswell
  submitFinalDocument();
  setIsModalVisible(false); 
};

const showConfirmModal = () => {
  setIsModalVisible(true); 
};

const showRejectModal = () => {
  setIsRejectModalVisible(true); 
};
const handleRejectCancel = () => {
  setIsRejectModalVisible(false);
};

const handleRejectConfirm = () => {
  // save OPenssl Aswell
  // submitFinalDocument();
  handleChangeStatus();
  toast.success('Document rejected Successfully', {
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
    window.location.reload();
  }, 2000);
  setIsRejectModalVisible(false); 
};
const sendToAPI = async (updatedData: EmailStatus) => {
  
  const UserStatusUpdate = {
    document_title: documentData.name, 
    assigned_user_list: JSON.stringify(updatedData),  
  };
  // console.log("IMPPPPPPPPPPPPPPPP---",UserStatusUpdate)
  try {
    const response = await fetch(`/api/method/esign_app.api.patch_user_status_document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(UserStatusUpdate),
    });

    const result = await response.json();
    console.log('API response:', result);
  } catch (error) {
    console.error('Error sending data to API:', error);
  }
};

// const logComponentData = () => {
//   const data = components.map(({ id, type, content,pageNo, value, position, size, name, fontSize, assign }) => ({
//     id,
//     type,
//     content,
//     pageNo,
//     value,
//     position,
//     size,
//     name,
//     fontSize,
//     assign,
//   }));
//   console.log(JSON.stringify(data, null, 2));
// };

const handlePreviousPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1); setTarget(null); setSelectedId(null);
  }
};

// const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setUserInput(e.target.value);
// };


// const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
//   const { type, value, files } = e.target;

//   setComponents(prevComponents =>
//     prevComponents.map(component => {
//       if (component.id !== id) return component;

//       switch (component.type) {
//         case 'text':
//           return { ...component, content: value, value };
//         case 'image':
//         case 'v_image':
//           if (files && files[0]) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//               setComponents(prevComponents =>
//                 prevComponents.map(c =>
//                   c.id === id ? { ...c, content: reader.result as string } : c
//                 )
//               );
//             };
//             reader.readAsDataURL(files[0]);
//           }
//           return component;
//         case 'checkbox':
//           return { ...component, checked: e.target.checked };
//         case 'm_date':
//         case 'live_date':
//         case 'fix_date':
//           return { ...component, content: value };
//         default:
//           return component;
//       }
//     })
//   );
// };


const handleSelectSignComp = (SelectedDataUrl: string,SelectedPemCert:string,OpenSSLName:string) => {
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === selectedId ? { ...component, content: SelectedDataUrl, value: SelectedDataUrl , cert_pem: SelectedPemCert } : component
    )
  );

  setOpenSSL_List((prevList) => {
    // Parse prevList if it's a string
    const parsedList = typeof prevList === 'string' ? JSON.parse(prevList) : prevList;

    // Check if parsedList is indeed an array
    if (!Array.isArray(parsedList)) {
        console.error('prevList is not an array:', parsedList);
        return [];
    }

    // Append the new data
    const newList = [
        ...parsedList,
        { name: OpenSSLName, status: 'notapplied' }
    ];
    console.log('Updated List:', newList);
    return newList;
});



  console.log(OpenSSLName)
  console.log(openSSL_List)
  setTarget(null);
  setSelectedId(null);
  setSelectedComponent(null);
};

const handleModelSignComp = () => {
  setTarget(null);
};

const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, componentId: number) => {
  const isChecked = e.target.checked;
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === componentId ? { ...component, checked: isChecked } : component
    )
  );
};
const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, componentId: number) => {
  const newDate = e.target.value;
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === componentId ? { ...component, content: newDate, value: newDate } : component
    )
  );
};

const handleTextChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
  const newText = e.target.value;
  
  if (selectedId !== null) {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === selectedId ? { ...component, content: newText, value: newText } : component
      )
    );
  }
};

const handleDeselect = (e: React.MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.component')) {
    setSelectedId(null);
    setTarget(null);
  }
};

// const changeTextSize = (increment: boolean) => {
//   if (selectedId !== null) {
//     setComponents((prevComponents) =>
//       prevComponents.map((component) =>
//         component.id === selectedId
//           ? {
//               ...component,
//               fontSize: (component.fontSize || 16) + (increment ? 2 : -2),
//             }
//           : component
//       )
//     );
//   }
// };


useEffect(() => {
  if (selectedId !== null) {
    const selectedElement = document.querySelector(`[data-id="${selectedId}"]`);
    setTarget(selectedElement as HTMLElement);
    const selectedComponent = components.find((c) => c.id === selectedId);
    if (selectedComponent?.type === 'text') {
      setTextFieldValue(selectedComponent.content || '');
    }
  }
}, [selectedId, components]);

useEffect(() => {
  if (selectedId !== null) {
    const component = components.find(c => c.id === selectedId);
    if (component) {
      setSelectedComponent({
        id: component.id,
        type: component.type,
        checked: component.checked || false,
        content: component.content || '',
      });
    } else {
      setSelectedComponent(null);
    }
  }
}, [selectedId, target, components]);


const base64ToUint8Array = (base64:any) => {
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
};

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, componentId: number) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setComponents(prevComponents =>
        prevComponents.map(component =>
          component.id === componentId
            ? { ...component, content: base64String }
            : component
        )
      );
    };
    reader.readAsDataURL(file);
  }
};



const mergeAndPrintPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  for (let i = 0; i < datapdf.length; i++) {
    const pdfBytes = base64ToUint8Array(datapdf[i].data);
    const pdfToMerge = await PDFDocument.load(pdfBytes);
// Peg Segrt PDF
    const pages = await pdfDoc.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
    pages.forEach(page => pdfDoc.addPage(page));
  }
  // Solution 12th -------------------- ( close To solve but not solved ) ---------------------------
  // pdfDoc.catalog.set(
  //   PDFName.of('OutputIntent'),
  //   pdfDoc.context.obj({
  //     Type: PDFName.of('OutputIntent'),
  //     S: PDFName.of('GTS_PDFA1'),
  //     OutputConditionIdentifier: PDFString.of('sRGB'),
  //     Info: PDFString.of('sRGB IEC61966-2.1'),
  //   })
  // );
  // const metadata = pdfDoc.context.obj({
  //   Type: PDFName.of('Metadata'),
  //   Subtype: PDFName.of('XML'),
  //   Length: Number(0),
  // });
  // pdfDoc.catalog.set(PDFName.of('Metadata'), metadata);
  

  const componentsByPage: { [key: number]: ComponentData[] } = components.reduce((acc, component) => {
    if (!acc[component.pageNo]) acc[component.pageNo] = [];
    acc[component.pageNo].push(component);
    return acc;
  }, {} as { [key: number]: ComponentData[] });

  const pages = pdfDoc.getPages();
  
  for (const page of pages) {
    const pageIndex = pages.indexOf(page);
    const pageComponents = componentsByPage[pageIndex] || [];

    for (const component of pageComponents) {
      const { left, top } = component.position;

      if (component.type === 'text' || component.type === 'v_text') {
        const fontSize = component.fontSize ?? 12;
        const yPosition = page.getHeight() - top - fontSize - 3;
        page.drawText(component.content || '', {
          x: left + 3,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
          lineHeight: fontSize * 1.2,
          maxWidth: component.size?.width ?? 0,
          font: timesRomanFont,
        });
      } else if ((component.type === 'image' || component.type === 'v_image'  || component.type === 'v_signature'  || component.type === 'signature' ) && component.content) {
        const imageData = component.content.split(',')[1];
        if (!imageData) {
          console.error('Invalid image data');
          continue;
        }
       
  if (component.type === 'signature') {
  const signerName = component.name || 'Unknown';
  const signedAt = new Date().toISOString();

  // Create the annotation contents with the PEM certificate
  const annotationContents = PDFString.of(
    `Certificate: ${component.cert_pem}\nSigner: ${signerName}\nSignedAt: ${signedAt}`
  );

  // Create a new annotation dictionary (PDF object)
  const signatureAnnotation = pdfDoc.context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Widget'), // Mimicking a signature field
    T: PDFString.of(`Signature_${pageIndex}_${component.name}`),
    Contents: annotationContents,
    Rect: [0, 0, 0, 0], // Invisible annotation (no visible rectangle)
    P: page.ref, // Reference to the page
    F: 4, 
  });

  let annots = page.node.lookup(PDFName.of('Annots')) as PDFArray | undefined;
  if (!annots) {
    annots = pdfDoc.context.obj([]) as PDFArray;
    page.node.set(PDFName.of('Annots'), annots);
  }

  // Push the new annotation to the annotations array_________________________ Solution 15th
  annots.push(signatureAnnotation);

  page.node.set(PDFName.of('Group'), pdfDoc.context.obj({
    Type: PDFName.of('Group'),
    S: PDFName.of('Transparency'),
    CS: PDFName.of('DeviceRGB'), // Correct blending color space
  }));
  console.log(`Certificate embedded as annotation for ${component.name}`);
}

        // const cert_pem_key

        const imageBytes = base64ToUint8Array(imageData);
        let embeddedImage;

        if (component.content.startsWith('data:image/png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else if (component.content.startsWith('data:image/jpeg') || component.content.startsWith('data:image/jpg')) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          console.error('Unsupported image format');
          continue;
        }
        
        const { width: imageWidth, height: imageHeight } = embeddedImage;
        const containerWidth = component.size?.width ?? 0;
        const containerHeight = component.size?.height ?? 0;

        const widthRatio = containerWidth / imageWidth;
        const heightRatio = containerHeight / imageHeight;
        const scaleRatio = Math.min(widthRatio, heightRatio);

        const drawWidth = imageWidth * scaleRatio;
        const drawHeight = imageHeight * scaleRatio;

        const x = left;
        const y = page.getHeight() - top - drawHeight;

        page.drawImage(embeddedImage, {
          x: x,
          y: y,
          width: drawWidth,
          height: drawHeight,
        });
      } else if (component.type === 'checkbox') {
        const size = 10; //=================================================================================== CheckBox
        const yPosition = page.getHeight() - top - size - 5;

        if (component.checked) {
          page.drawRectangle({
            x: left + 5,
            y: yPosition,
            width: size,
            height: size,
            color: rgb(0, 0, 0),
          });
        } else {
          page.drawRectangle({
            x: left + 5,
            y: yPosition,
            width: size,
            height: size,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(1, 1, 1),
          });
        }
      } else if (component.type === 'm_date'||component.type === 'live_date' || component.type === 'fix_date') {
        const fontSize = component.fontSize ?? 12;
        const yPosition = page.getHeight() - top - fontSize - 3;
        const dateValue = component.content || new Date().toLocaleDateString();

        page.drawText(dateValue, {
          x: left + 3,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
          font: timesRomanFont,
        });
      }
    }
  }
//   pdfDoc.setMetadata({
//     UserInfo: JSON.stringify(userInfo),
//     Date: new Date().toISOString(), // You can add a timestamp as well
// });
 // Set the trailer ID
//  const id = [pdfDoc.context.obj('UUID1'), pdfDoc.context.obj('UUID2')]; // Replace with actual UUIDs
//  pdfDoc.trailer.set(PDFName.of('ID'), pdfDoc.context.obj(id));
  // pdfDoc.context.
  // Setting OutputIntent
  pdfDoc.catalog.set(
    PDFName.of('OutputIntent'),
    pdfDoc.context.obj({
      Type: PDFName.of('OutputIntent'),
      S: PDFName.of('GTS_PDFA1'),
      OutputConditionIdentifier: PDFString.of('sRGB IEC61966-2.1'),
      Info: PDFString.of('sRGB IEC61966-2.1'),
    })
  );

  // Adding Metadata
  const metadata = pdfDoc.context.obj({
    Type: PDFName.of('Metadata'),
    Subtype: PDFName.of('XML'),
    Length: 0, // Set to the actual length of the metadata content if known
  });
  pdfDoc.catalog.set(PDFName.of('Metadata'), metadata);


pdfDoc.setTitle(`Document signed by eSign`);
pdfDoc.setAuthor('Dexciss Technology');
pdfDoc.setSubject('eSign');
pdfDoc.setKeywords(['Dexciss Technology','eSign']);
pdfDoc.setCreationDate(new Date());
pdfDoc.setModificationDate(new Date());

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const base64String = await BlobToBase64(blob);
  console.log('lvl1')
  mergeAndPrintSave(base64String)

  toast.success('PDF Has Been Merged', {
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
  // const base64blob  = await Base64ToBlob(base64String)
  // console.log(base64String)
  // const url = URL.createObjectURL(base64blob);
  // const varName = `esignDoc-${documentData.document_title}`;
  // const link = document.createElement('a');
  // link.href = url;
  // link.download = `${varName}.pdf`;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // URL.revokeObjectURL(url);
};


const mergeAndPrintSave = async (MergedPDFData:string) => {
  const documentObj = {
    document_title: documentData.name, 
    validated_pdf : MergedPDFData
  };
  console.log('inside merge and save')
  try {
    const response = await fetch('/api/method/esign_app.api.mergeAndPrintSave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentObj),
    });

    if (!response.ok) {
      throw new Error('Failed to process the document.');
    }

    const data = await response.json();
    console.log('Document processed successfully:', data);
    return data; // Return the response if needed for further use
  } catch (error) {
    console.error('Error in mergeAndPrintSave:', error);
    throw error;
  }
};



if (!documentData) {
  return <div>No Doc data available</div>;
}
//-------------------------------------------React UI part -------------------------------------------------
return (
<>
<div className="text-xs flex items-center gap-3 relative p-6 bg-[#283C42] text-white border-2 border-transparent hover:border-[#283C42] transition-colors duration-300">
<div>
  <button className="button" onClick={() => navigate(-1)}>
  <div className="button-box">
    <span className="button-elem">
      <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
        ></path>
      </svg>
    </span>
    <span className="button-elem">
      <svg viewBox="0 0 46 40">
        <path
          d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
        ></path>
      </svg>
    </span>
  </div>
</button>
      </div>
  <div>
    <h1 className="text-xl font-bold " style={{ fontVariant: 'small-caps' }}>{documentData.document_title}</h1>
    <p className='text-xs'>{documentData.template_title}</p>
    <p className='text-xs'>Email: {documentData.owner_email}</p>
    <p className='text-sm'>
            Created At: {dayjs(documentData.document_created_at).format('DD/MM/YYYY - HH:mm')} ({dayjs().to(dayjs(documentData.document_created_at))})
          </p>
  </div>
</div>
{ isRejected == 1 && (
  <div className='min-w-full bg-red-800 text-white p-2'>
    Rejected Doument
  </div>
)}

<div className={`${documentStatusUser ? '' : 'templete-main-div-signer'} `}>

  <div className="templete-app text-xs">
      <div className='flex gap-3 mb-2'>
        <button 
          className="bg-[#283C42] text-white px-4 py-2 min-w-[5rem] max-w-[5rem] rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <h1 className='mt-2'>{currentPage + 1} / {datapdf.length}</h1>
        <button
          className="bg-[#283C42] text-white px-4 py-2 rounded border-2 min-w-[5rem] max-w-[5rem] border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={handleNextPage}
          disabled={currentPage === datapdf.length - 1}
        >
          Next
        </button>
          { isCompleted == 1 && isRejected == 0 &&(
            <>
            {/* Actual print Button */}
            {/* <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2  border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={mergeAndPrintPDF}
          >
           Re-Merge
          </button> */}

            {/* Verify Signatures */}
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2  border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={Print_PDF_Merged_Valid}
          >
            Print
          </button>

          </>
          )}

          {documentStatusUser &&  isCompleted == 0 &&(
              <button
              className="bg-[#283C42] text-white px-4 py-2 cursor-not-allowed rounded border-2  border-transparent transition-colors duration-300"
              disabled={currentPage === datapdf.length - 1}
            >
              <svg
                data-name="Layer 1"
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1.7em"
                width="1.7em"
              >
                <path d="M7 10a1 1 0 101 1 1 1 0 00-1-1zM3.71 2.29a1 1 0 00-1.42 1.42L4.62 6A3 3 0 002 9v6a3 3 0 003 3h1v3a1 1 0 001 1h10a1 1 0 001-1v-1.59l2.29 2.3a1 1 0 001.42 0 1 1 0 000-1.42zM6 15v1H5a1 1 0 01-1-1V9a1 1 0 011-1h1.59l6 6H7a1 1 0 00-1 1zm10 5H8v-4h6.59L16 17.41zm3-14h-1V3a1 1 0 00-1-1H8.66a1 1 0 000 2H16v2h-3.34a1 1 0 000 2H19a1 1 0 011 1v6a.37.37 0 010 .11 1 1 0 00.78 1.18h.2a1 1 0 001-.8A2.84 2.84 0 0022 15V9a3 3 0 00-3-3z" />
              </svg>
            </button>
          )}
      </div>
  <div className="workspace" ref={workspaceRef} onClick={handleDeselect}>
    <PdfRenderer pdfData={datapdf[currentPage].data} />
      {components
    .filter((component) => component.pageNo === currentPage) 
    .map((component) => (
      <div
        key={component.id}
        data-id={component.id}
        className={` ${component.type} ${selectedId === component.id ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          top: component.position.top,
          left: component.position.left,
          width: component.size?.width ?? 0,
          height: component.size?.height ?? 0,
          border: selectedId === component.id ? '1px solid red' : 'none',
          fontSize: `${component.fontSize}px`,
          userSelect: 'none',
          overflow: 'hidden',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(component.id);
        }}
      >
        {component.type === 'text' && (
      <div
        style={{ width: '100%', height: '100%', overflow: 'hidden', fontSize: 'inherit', outline: 'none' }}
      >
        {component.value || 'Text Here'}
      </div>
    )}
    {component.type === 'image' && !component.content && (
      <div></div>
    )}
    {component.type === 'v_image' && !component.content && (
      <div></div>
    )}
    {(component.type === 'image'|| component.type === 'v_image' || component.type === 'signature' || component.type === 'v_signature') && component.content && (
      <img src={component.content} alt="Uploaded" style={{ width: '100%', height: '100%' }} />
    )}
    {component.type === 'checkbox' && (
      <input
        type="checkbox"
        checked={component.checked || false}
        readOnly
        // onChange={(e) => handleComponentChange(e, component.id)}
    
      />
    )}
    {component.type === 'm_date' && (
      <input
        type="date"
        value={component.content || ''}
        readOnly
        // onChange={(e) => handleComponentChange(e, component.id)}
      />
    )}
    {component.type === 'live_date' && (
      <input
        type="date"
        value={new Date().toISOString().split('T')[0]}
        readOnly
        // onChange={(e) => handleComponentChange(e, component.id)}
        // readOnly
        
      />
    )}
    {component.type === 'fix_date' && (
      <input
        type="date"
        value={component.content || ''}
        readOnly
        // onChange={(e) => handleComponentChange(e, component.id)}
      />
    )}
    {component.type === 'v_text' && (
      <div>{component.content || 'Editable Text'}</div>
    )}
      </div>
    ))}

      <Moveable
        ref={moveableRef}
        // target={target}
        bounds={{
          left: 0,
          top: 0,
          right: workspaceRef.current?.offsetWidth || 0,
          bottom: workspaceRef.current?.offsetHeight || 0,
        }}
   
      />
    </div>
  </div>

  <div className={`right-div-signer p-5 cursor-pointer ${documentStatusUser? "hidden":""}`}>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden ">
      <button 
  onClick={showConfirmModal}
  className="bg-[#283C42] text-white px-4 py-2 mb-4  border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
>
  Submit
</button>
<button 
  onClick={showRejectModal}
  className="bg-[#c93737] text-white px-4 py-2 mb-4 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 rounded-tr-lg"
>
  Reject
</button>

        <table className='w-full signer-table '>
          <thead>
            <tr className="bg-[#283C42] text-white">
              <th className="py-3 px-4 text-left">Sr.</th>
              <th className="py-3 px-4 text-left">Component</th>
              <th className="py-3 px-4 text-left">Page No.</th>
              <th className="py-3 px-4 text-left">Input</th>
            </tr>
          </thead>
          <tbody>
            {components
              .filter((component) => component.assign?.includes(email))
              .map((component, index) => (
                <tr
                  key={component.id}
                  className={`${selectedId === component.id ? 'selected-row bg-blue-100' : ''} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => {
                    setSelectedId(component.id)
                    setCurrentPage(component.pageNo)
                    handleModelSignComp()
                  }}
                >
                  <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                  <td
                    className="py-2 px-4 border-b border-gray-200"
                    onClick={() => {
                      setSelectedId(component.id)
                      // Note: This part would need adjustment in a real application
                      // const selectedElement = document.querySelector(`[data-id="${component.id}"]`);
                      // setTarget(selectedElement as HTMLElement);
                    }}
                  >
                    {component.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{component.pageNo + 1}</td>
                  <td className="py-2 px-4 border-b border-gray-200 max-w-[18vw]">
                    {component.type === 'signature' && ( <>
                      <SignInput onSelect={handleSelectSignComp} onClickbtn={handleModelSignComp} />
                      <button>Click</button>
                    </>
                    )}
                    {component.type === 'image' && (
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, component.id)} />
                    )}
                    {component.type === 'checkbox' && (
                      <input
                        type="checkbox"
                        checked={component.checked || false}
                        onChange={(e) => handleCheckboxChange(e, component.id)}
                      />
                    )}
                    {(component.type === 'm_date' || component.type === 'fix_date') && (
                      <input
                        type="date"
                        value={component.content || ''}
                        onChange={(e) => handleDateChange(e, component.id)}
                      />
                    )}
                    {component.type === 'live_date' && (
                      <input type="date" value={new Date().toISOString().split('T')[0]} readOnly />
                    )}
                    {component.type === 'text' && (
                      <input
                        className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        ref={textInputRef}
                        type="text"
                        value={component.content || ''}
                        onClick={() => {
                          setSelectedId(component.id)
                          setCurrentPage(component.pageNo)
                        }}
                        onChange={handleTextChange}
                        placeholder="Edit text here"
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        visible={isModalVisible}
        name={documentData.name} 
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        message={"Are you sure you want to submit this document? After That You Can't Change or Edit Document !"}
        module={"Document Submit"}
      />
      <RejectDoc
        visible={isRejectModalVisible}
        name={documentData.name} 
        owner_name = {documentData.owner_email}
        onCancel={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        message={"Are you sure you want to Reject this document? You Can't Revert The Action"}
        module={"Document Reject"}
      />
      
        
{/* <SignerInput/> */}

  </div>

</div>
<ToastContainer limit={1} />
    </>
  );
};

export default Signer;
/*

Your Name
Email

Company Name:
Department:
State:
Country:

Password
Verify Password
Key Passphrase
Verify Key Passphrase

*/