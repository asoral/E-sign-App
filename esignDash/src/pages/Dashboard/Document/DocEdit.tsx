import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';
// import back canva from "./pdfsb";  
import Moveable from 'react-moveable';
import { MoveableManagerInterface, Renderer } from "react-moveable";
import { PDFDocument, rgb } from 'pdf-lib';
import { useDrag, useDrop, DragSourceMonitor} from 'react-dnd';
// Helper Custom ---
import PdfRenderer from '../helper/pdfsb/PdfRenderer';
import { datapdfDemo } from '../helper/DataPDF'
import { BlankDatapdf } from '../helper/BlankPDF'
import { initialComponents , DexcissTemplete , HelloDexciss } from '../helper/TemplateMaping';
import { ComponentData } from '../helper/Interface'
import { splitPDF } from '../helper/GetPages';
import { pdfToBase64 } from '../helper/PDFtoBase64';
import { ButtonType , buttonConfigs } from '../helper/ButtonUtilities';
import './document.css'
import SignInput from '../helper/SignInput';
import SendDoc from './utility/SendDoc'
import { extractUniqueElements } from '../helper/extractUniqueElements';
import dayjs from '../helper/dayjsConfig';

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

interface DraggableButtonProps {
  type: string;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}



const DocEdit = () => {
    
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectSignatureData, setSelectSignatureData] = useState<string | null>(null);
  const [datapdf , setdatapdf] = useState<BasePDFInterface[]>(BlankDatapdf);
  const [selectedComponent, setSelectedComponent] = useState<SelectedComponent>(null);
  const moveableRef = useRef<Moveable | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const [fileName, setFileName] = useState<string | null>(null)
  const [assignedUser , setAssignedUser] = useState<String[]>([])
  const { documentData } = location.state as { documentData?: DocumentList } || {};
  const navigate = useNavigate();
  if (!documentData) {

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
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_document_components_and_basepdf?document_name=${documentData?documentData.name:''}`);
        const result = await response.json();
        // // // console.log("documentData :" ,JSON.stringify(documentData));
        // // // console.log(result);
        if(result.message.document_json_data == null || result.message.base_pdf_datad == null)
        {
          return ;
        }
        if (result.message.status === 200) {
     
          const parsedData = typeof result.message.document_json_data === 'string'
          ? JSON.parse(result.message.document_json_data)
          : result.message.document_json_data;

          const BasePDFData = typeof result.message.base_pdf_datad === 'string'
          ? JSON.parse(result.message.base_pdf_datad)
          : result.message.base_pdf_datad;

          // // // console.log("Parseeee",parsedData)
          // // // console.log("Baseeee",BasePDFData)
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

  const Editable = {
    name: "editable",
    props: [],
    events: [],
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;
        const EditableViewer = moveable.useCSS("div", `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .custom-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #283C42;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
            `);
            
        return <EditableViewer key={"editable-viewer"} className={"moveable-editable"} style={{
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
        }}>
     
            <button className="w-6 h-6 mb-1 p-1 bg-[#283C42] rounded border-none text-white font-bold" onClick={deleteComponent} >
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
              </svg>
            </button>
            <button className="w-6 h-6 mb-1 p-1 bg-[#283C42] rounded border-none text-white font-bold" onClick={() => {
                  if (selectedId !== null) {
                      handleRemoveImage(selectedId);
                  }else
                  {
                    setTextFieldValue("")
                  }
              }}><svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <defs>
                      <style />
                    </defs>
                    <path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-.3 1.5-.4 3-.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-.1 4.4-.4 14.2-2.4 23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z" />
                  </svg>
            </button>

  
        </EditableViewer>;
    },
} as const;
const handleNextPage = () => {
  if (currentPage < datapdf.length - 1) {
    setCurrentPage(currentPage + 1); setTarget(null); setSelectedId(null);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1); setTarget(null); setSelectedId(null);
  }
};

const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUserInput(e.target.value);
};

const addUserToComponent = () => {
  if (selectedId !== null && userInput.trim() !== '') {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === selectedId
          ? {
              ...component,
              assign: [...(component.assign || []), userInput],
            }
          : component
      )
    );
    setUserInput('');
  }
};
const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
  const { type, value, files } = e.target;

  setComponents(prevComponents =>
    prevComponents.map(component => {
      if (component.id !== id) return component;

      switch (component.type) {
        case 'text':
          return { ...component, content: value, value };
        case 'image':
        case 'v_image':
          if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setComponents(prevComponents =>
                prevComponents.map(c =>
                  c.id === id ? { ...c, content: reader.result as string } : c
                )
              );
            };
            reader.readAsDataURL(files[0]);
          }
          return component;
        case 'checkbox':
          return { ...component, checked: e.target.checked };
        case 'm_date':
        case 'live_date':
        case 'fix_date':
          return { ...component, content: value };
        default:
          return component;
      }
    })
  );
};


const removeUserFromComponent = (user: string) => {
  if (selectedId !== null) {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === selectedId
          ? {
              ...component,
              assign: (component.assign || []).filter((u) => u !== user),
            }
          : component
      )
    );
  }
};

function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

const handleSelectSignComp = (SelectedDataUrl: string) => {
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === selectedId ? { ...component, content: SelectedDataUrl, value: SelectedDataUrl } : component
    )
  );
  setTarget(null);
  setSelectedId(null);
  setSelectedComponent(null);
  // setSelectSignatureData(SelectedDataUrl);
  // console.log(selectSignatureData,"orrrrr",SelectedDataUrl);
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


const DraggableButton: React.FC<DraggableButtonProps> = ({ type, onClick, children, title }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [type]);

  const [isHovered, setIsHovered] = useState(false);

  return (
     <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        ref={dragRef}
        className={`flex justify-center items-center w-[100%] h-[50px] bg-[#283C42] text-white px-4 py-2 cursor-grab rounded border-2 border-transparent transition-transform duration-500 ease-in-out ${isDragging ? 'shiny-button' : ''}`}
        onClick={onClick}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className={`flip-container ${isHovered ? 'hovered' : ''}`}>
            <div className="flip-front">
              {children}
            </div>
            <div className="flip-back">
              <span>{title}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
  
  
  
};

const [, drop] = useDrop(() => ({
  accept: 'component',
  drop: (item: { type: ButtonType }, monitor) => {
    const offset = monitor.getClientOffset();
    if (workspaceRef.current && offset) {
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const newPosition = {
        top: offset.y - workspaceRect.top - 20,
        left: offset.x - workspaceRect.left - 50,
      };
      setCurrentPage(prevPage => {
        console.log(prevPage, "WWWWWW");  
        addComponent(item.type, newPosition, prevPage);
        return prevPage;  });
    }
  },
}));
  
const addComponent = (type: ButtonType, position: { top: number; left: number }, pageNo: number) => {
  const defaultSizes = {
    text: { width: 100, height: 30 },
    v_text: { width: 100, height: 30 }, 
    signature: { width: 100, height: 50 },
    v_signature: { width: 100, height: 50 }, 
    image: { width: 80, height: 80 },
    v_image: { width: 80, height: 80 }, 
    checkbox: { width: 30, height: 30 },
    m_date: { width: 100, height: 30 },
    live_date: { width: 100, height: 30 },
    fix_date: { width: 100, height: 30 },
  };

  const newComponent: ComponentData = {
    id: Date.now(),
    type,
    pageNo,  // Use the pageNo passed as an argument
    name: `${type}-${Date.now()}`,
    position,
    size: defaultSizes[type] || { width: 0, height: 0 },
    fontSize: type === 'text' ? 14 : undefined,
    value: '',
    assign: [],
    content: type === 'text' ? '' : undefined,
    checked: false,
  };

  setComponents(prevComponents => [...prevComponents, newComponent]);
};

const updateComponentPosition = (id: number, top: number, left: number) => {
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === id
        ? { ...component, position: { top, left } }
        : component
    )
  );
};

const updateComponentSize = (id: number | null, width: number , height: number) => {
  setComponents((prevComponents) =>
    prevComponents.map((component) =>
      component.id === id
        ? { ...component, size: { width, height } }
        : component
    )
  );
};

const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newText = e.target.value;
  setTextFieldValue(newText);
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

const changeTextSize = (increment: boolean) => {
  if (selectedId !== null) {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === selectedId
          ? {
              ...component,
              fontSize: (component.fontSize || 16) + (increment ? 2 : -2),
            }
          : component
      )
    );
  }
};

const deleteComponent = () => {
  if (selectedId !== null) {
    setComponents((prevComponents) =>
      prevComponents.filter((component) => component.id !== selectedId)
    );
    setSelectedId(null);
    setTarget(null);
  }
};

const logComponentData = () => {
  const data = components.map(({ id, type, content,pageNo, value, position, size, name, fontSize, assign }) => ({
    id,
    type,
    content,
    pageNo,
    value,
    position,
    size,
    name,
    fontSize,
    assign,
  }));
  // // console.log(JSON.stringify(data, null, 2));
};


const handleSelectChange = (event:any) => {
  const selectedTemplate = event.target.value;

  switch (selectedTemplate) {
    case 'loadComponents':
      setComponents(initialComponents);
      break;
    case 'loadDexcissComponents':
      setComponents(DexcissTemplete);
      break;
    case 'loadHelloDexcissComponents':
      setComponents(HelloDexciss);
      break;
    case 'loadBlank':
      setComponents([]);
      break;
    default:
      setComponents([]);
  }
};

  const LoadBlankPage = async () => {
    try {
      setCurrentPage(0);
      setComponents([]);
      setdatapdf(BlankDatapdf);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64String = await pdfToBase64(file);
      // setBase64PDF(base64String);
      const result = await splitPDF(base64String);
      setdatapdf(result);
      setFileName(file ? file.name : null)
      setCurrentPage(0);
    }
  };

// const loadComponents = () => {
//   setComponents(initialComponents);
// };

// const loadDexcissComponents = () => {
//   setComponents(DexcissTemplete);
// };
// const loadHelloDexcissComponents = () => {
//   setComponents(HelloDexciss);
// };

// sel the cmpt, set target , 
useEffect(() => {
  if (selectedId !== null) {
    const selectedElement = document.querySelector(`[data-id="${selectedId}"]`);
    setTarget(selectedElement as HTMLElement);
    const selectedComponent = components.find((c) => c.id === selectedId);
    if (selectedComponent?.type === 'text') {
      setTextFieldValue(selectedComponent.content || '');
      // textInputRef.current?.focus();
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

const mergeAndPrintPDF = async () => {
  const pdfDoc = await PDFDocument.create(); // Create a new PDF document
  
  for (let i = 0; i < datapdf.length; i++) {
    const pdfBytes = base64ToUint8Array(datapdf[i].data);
    const pdfToMerge = await PDFDocument.load(pdfBytes);

    const pages = await pdfDoc.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
    pages.forEach(page => pdfDoc.addPage(page));
  }

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
        });
      } else if ((component.type === 'image' || component.type === 'v_image'  || component.type === 'v_signature'  || component.type === 'signature' ) && component.content) {
        const imageData = component.content.split(',')[1];
        if (!imageData) {
          console.error('Invalid image data');
          continue;
        }

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
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
 const varName = `esignDoc-${documentData.document_title}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `${varName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};




const handleRemoveImage = (componentId: number) => {
  setComponents((prevComponents) =>
    prevComponents.map((c) =>
      c.id === componentId
        ? { ...c, content: undefined, value: undefined }
        : c
    )
  );
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


const handleSaveDocument = async() => {
    if (!documentData || !documentData.document_title) {
      // msg error
     return;
    }
    const Componentdata = components.map(({ id, type, content, pageNo, value, position, size, name, fontSize, assign, checked }) => ({
        id,
        type,
        pageNo,
        assign,
        size,
        name,
        fontSize,
        position,
        content,
        value,
        checked, 
      }));
      
    // // // console.log(JSON.stringify(Componentdata, null, 2));
  
    const formattedEmails = assignedUser.reduce((acc, email, index) => {
      const emailStr = String(email);
      acc[index] = { email: emailStr, status: 'unseen' };
      return acc;
    }, {} as { [key: number]: { email: string; status: string } });

    // // // console.log("--------format---------",formattedEmails);
    const templeteObject = {
      document_title: documentData.name,
      document_json_data : JSON.stringify(JSON.stringify(Componentdata, null, 2)),
      base_pdf_datad: JSON.stringify(JSON.stringify(datapdf, null, 2)),
      assigned_user_list : JSON.stringify(formattedEmails, null, 2)
    };
    try {
      const response = await fetch('/api/method/esign_app.api.update_document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templeteObject)
      });
  
      const result = await response.json();
      // // // console.log(result);
      if (result.message.status < 300) {
        toast.success('Document Updated Successfully', {
          position: 'top-right',
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Flip
        });
      } else {
        toast.error('Error while updating template', {
          position: 'top-right',
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Flip
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the template');
    }
    setTarget(null);
   }
  

if (!documentData) {
  return <div>No Doc data available</div>;
}
//-------------------------------------------React UI part -------------------------------------------------
return (
    <>
    


<div className="text-xs flex items-center gap-3 relative p-6 bg-[#283C42] text-white border-2 border-transparent hover:border-[#283C42] transition-colors duration-300">

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
      
          <div>
          <h1 className="text-lg font-bold">{documentData.document_title}</h1>
          <p className='text-sm'>{documentData.template_title}</p>
          <p className='text-sm'>Created by: {documentData.owner_email}</p>
          <p className='text-sm'>
            Created At: {dayjs(documentData.document_created_at).format('DD/MM/YYYY - HH:mm')} ({dayjs().to(dayjs(documentData.document_created_at))})
          </p>
          </div>
          
</div>
<div className='templete-main-div relative'>
  <div className='left-area-div h-fit sticky top-0'>
    <div className="control-buttons gap-2 text-xs">

    <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="items-center content-center space-x-2 bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer grid place-items-center"
      >
     
        <span>{fileName ? 'Change File' : 'Upload PDF'}</span>
      </label>

      <button className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
      onClick={LoadBlankPage}>Load Blank Page</button>

      {/* <button className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
      onClick={mergeAndPrintPDF}>Merge and Print PDF</button>    */}

      <button className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
       onClick={handleSaveDocument}>Save Document</button>   
        <SendDoc setTarget={setTarget} onClickSaveDoc={handleSaveDocument} owner_email={documentData.owner_email} assigned_user={assignedUser.map(String)} template_tite={documentData.template_title} document_title = {documentData.name }/>
    </div>
    <div className="control-buttons-utilities gap-2 text-xs">
      {buttonConfigs.map(({ type, icon , title }) => (
        <DraggableButton
          key={type}
          type={type}
          title={title}
          onClick={() => addComponent(type, { top: 100, left: 100 },currentPage)}
        >
          {icon}
        </DraggableButton>
      ))}
    </div>
  </div>

  <div className="templete-app text-xs">
      <div className='flex gap-3 mb-2'>
        <button 
          className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <h1 className='mt-2'>{currentPage + 1} / {datapdf.length}</h1>
        <button
          className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={handleNextPage}
          disabled={currentPage === datapdf.length - 1}
        >
          Next
        </button>
      </div>
  <div className="workspace" ref={mergeRefs(workspaceRef, drop)} onClick={handleDeselect}>
    <PdfRenderer pdfData={datapdf[currentPage].data} />
      {components
    .filter((component) => component.pageNo === currentPage) 
    .map((component) => (
      <div
        key={component.id}
        data-id={component.id}
        className={`component ${component.type} ${selectedId === component.id ? 'selected' : ''}`}
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
        // contentEditable
        // // onChange={handleTextChange}
        // onInput={() => handleTextChange}
        style={{ width: '100%', height: '100%', overflow: 'hidden', fontSize: 'inherit', outline: 'none' }}
      >
        {component.value || 'Editable Text'}
      </div>
    )}
    {component.type === 'image' && !component.content && (
      // <input
      //   type="file"
      //   accept="image/*"
      //   onChange={(e) => handleComponentChange(e, component.id)}
       
      // />
      <div></div>
    )}
    {component.type === 'v_image' && !component.content && (
      // <input
      //   type="file"
      //   accept="image/*"
      //   onChange={(e) => handleComponentChange(e, component.id)}
      // />
      <div></div>
    )}
    {(component.type === 'image'|| component.type === 'v_image' || component.type === 'signature' || component.type === 'v_signature') && component.content && (
      <img src={component.content} alt="Uploaded" style={{ width: '100%', height: '100%' }} />
    )}
    {component.type === 'checkbox' && (
      <input
        type="checkbox"
        checked={component.checked || false}
        onChange={(e) => handleComponentChange(e, component.id)}
    
      />
    )}
    {component.type === 'm_date' && (
      <input
        type="date"
        value={component.content || ''}
        onChange={(e) => handleComponentChange(e, component.id)}
        readOnly
      />
    )}
    {component.type === 'live_date' && (
      <input
        type="date"
        value={new Date().toISOString().split('T')[0]}
        onChange={(e) => handleComponentChange(e, component.id)}
        readOnly
        
      />
    )}
    {component.type === 'fix_date' && (
      <input
        type="date"
        value={component.content || ''}
        onChange={(e) => handleComponentChange(e, component.id)}
      />
    )}
    {component.type === 'v_text' && (
      <div>{component.content || 'Editable Text'}</div>
    )}
      </div>
    ))}

      <Moveable
        ref={moveableRef}
        target={target}
        resizable
        draggable
        ables={[Editable]}
              props={{
                  editable: true,
              }}
        bounds={{
          left: 0,
          top: 0,
          right: workspaceRef.current?.offsetWidth || 0,
          bottom: workspaceRef.current?.offsetHeight || 0,
        }}
        onDrag={(e) => {
          const workspaceWidth = workspaceRef.current?.offsetWidth || 0;
          const workspaceHeight = workspaceRef.current?.offsetHeight || 0;
          const elementWidth = e.target.clientWidth || 0;
          const elementHeight = e.target.clientHeight || 0;

          const top = Math.max(0, Math.min(e.top, workspaceHeight - elementHeight));
          const left = Math.max(0, Math.min(e.left, workspaceWidth - elementWidth));
          if (selectedId !== null) {
            updateComponentPosition(selectedId, top, left);
          }
        }}
        onResize={(e) => {
          const workspaceWidth = workspaceRef.current?.offsetWidth || 0;
          const workspaceHeight = workspaceRef.current?.offsetHeight || 0;

          const width = Math.max(0, Math.min(e.width, workspaceWidth));
          const height = Math.max(0, Math.min(e.height, workspaceHeight));
          e.target.style.width = `${width}px`;
          e.target.style.height = `${height}px`;
          if (selectedId !== null) {
            updateComponentSize(selectedId, width, height);
          }
        }}
        onScale={(e) => {
          const workspaceWidth = workspaceRef.current?.offsetWidth || 0;
          const workspaceHeight = workspaceRef.current?.offsetHeight || 0;

          const component = components.find((c) => c.id === selectedId);
          if (component) {
            const newWidth = Math.max(0, Math.min(component.size?.width ?? 1 * e.scale[0], workspaceWidth));
            const newHeight = Math.max(0, Math.min(component.size?.height ?? 1 * e.scale[1], workspaceHeight));
            updateComponentSize(selectedId, newWidth, newHeight);
          }
        }}
      />
    </div>
  </div>

  <div className='right-templete h-fit sticky top-14'>
      <div className='templete-utility-btn mt-2 text-xs pr-20'>
      {/* {selectedId && (selectedComponent?.type === 'signature' || selectedComponent?.type === 'v_signature') && (
        <SignInput onSelect={handleSelectSignComp} onClickbtn={handleModelSignComp}/>
      )} */}

      {selectedId && (selectedComponent?.type === 'image' || selectedComponent?.type === 'v_image') && (
        <div className="flex items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, selectedId)}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center space-x-2 bg-[#283C42] text-white px-4 py-1 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Upload Image</span>
        </label>
      </div>
      )} 
      {/* {selectedId && selectedComponent?.type === 'checkbox' && (
      <input type="checkbox" checked={selectedComponent.checked || false} onChange={(e) => handleCheckboxChange(e, selectedId)} />
      )} */}
      {selectedId && selectedComponent?.type === 'm_date' && (
        <input type="date" value={selectedComponent.content || ''} onChange={(e) => handleDateChange(e, selectedId)} />
      )}
      {selectedId && selectedComponent?.type === 'live_date' && (
        <input type="date" value={new Date().toISOString().split('T')[0]} readOnly />
      )}
      {selectedId && selectedComponent?.type === 'fix_date' && (
        <input type="date" value={selectedComponent.content || ''} onChange={(e) => handleDateChange(e, selectedId)} />
      )}
      {selectedId && (selectedComponent?.type === 'text' || selectedComponent?.type === 'v_text') && (
      <>
        <button 
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
        onClick={() => changeTextSize(true)}
        >Increase Text Size</button>
        
        <button 
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
        onClick={() => changeTextSize(false)}
        >Decrease Text Size</button>
        
        <button 
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
        onClick={deleteComponent}
        >Delete Component</button>
  
        <input
          className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" 
          ref={textInputRef}
          type="text"
          value={textFieldValue}
          onChange={handleTextChange}
          placeholder="Edit text here"
        />
      </>
      )}


      </div>
      {selectedId && selectedComponent?.type !== 'v_text' && selectedComponent?.type !== 'v_signature' && selectedComponent?.type !== 'v_image' && selectedComponent?.type !== 'fix_date' && (
     <>
      <div className='templete-utility-btn-add-user flex m-3 gap-3 text-xs pr-10 ml-0'>
        <input
          className="mt-3 bg-[#d1e0e4]  text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" 
          type="text"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Add user"
        />
        <button 
        className="mt-3  bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" 
        onClick={addUserToComponent}>
          Add
        </button>
      </div>
      <div>
        <ul className="list-none p-0 m-0 pr-10">
          {components
            .find((component) => component.id === selectedId)
            ?.assign?.map((user, index) => (
              <li key={index} className="mr-3 flex items-center justify-between p-2 border-b border-gray-200 hover:bg-gray-100">
                <span className="text-xs text-gray-800 overflow-hidden ">{user}</span>
                <button
                  onClick={() => removeUserFromComponent(user)}
                  className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600"
                  aria-label="Remove user"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M678.3 655.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 00-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 518 759.6 444.7 759.6 362c0-137-110.8-248-247.5-248S264.7 225 264.7 362c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00137 901.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 641.2 432.2 610 512.2 610c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 008.1.3zM512.2 534c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 01340.5 362c0-45.9 17.9-89.1 50.3-121.6S466.3 190 512.2 190s88.9 17.9 121.4 50.4A171.2 171.2 0 01683.9 362c0 45.9-17.9 89.1-50.3 121.6C601.1 516.1 558 534 512.2 534zM880 772H640c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          </div>
        </>
        )}
      </div>  
</div>
<ToastContainer limit={1} />
    </>
  );
};

export default DocEdit;
