// /***  
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dead Code --------------- ( PDF Page Referance )--------------------------------
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ***/
// import React, { useState, useEffect, useRef } from 'react';
// import { splitPDF } from './PdfLibOwn/GetPages';
// import { pdfToBase64 } from './PdfLibOwn/PDFtoBase64';
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import 'pdfjs-dist/build/pdf.worker.js';
// import { Divider } from 'antd';


function Templete() {
//   const [base64PDF, setBase64PDF] = useState<string | null>(null);
//   const [pages, setPages] = useState<Array<{ page: number; data: string }> | null>(null);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [zoomLevel, setZoomLevel] = useState<number>(0.5);
//   const [zoomStatus, setZoomStatus] = useState<boolean>(false);
//   const pageRefs = useRef<Array<HTMLDivElement | null>>([]);

//   useEffect(() => {
//     if (pages) {
//       renderPage(pages[currentPage - 1].data, pageRefs.current[currentPage - 1],currentPage);
//     }
//   }, [pages, currentPage, zoomLevel]);

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const base64String = await pdfToBase64(file);
//       setBase64PDF(base64String);
//       const result = await splitPDF(base64String);
//       setPages(result);
//       setCurrentPage(1);
//     }
//   };


//   const renderPage = async (pageData: string, container: HTMLDivElement | null , currentPage) => {
   
   
//     if (container) {
//       const pdf = await pdfjsLib.getDocument({ data: atob(pageData) }).promise;
//       const page = await pdf.getPage(1);
//       const viewport = page.getViewport({ scale: zoomLevel });
//       container.innerHTML = '';
//       container.style.width = `${viewport.width}px`;
//       container.style.height = `${viewport.height}px`;
//       container.style.position = 'relative';
//       // // console.log(pages); 
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
//       if (context) {
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;
//         container.appendChild(canvas);

//         const renderContext = {
//           canvasContext: context,
//           viewport: viewport,
//         };
//         await page.render(renderContext).promise;

//         // get element by id , 1st create the element , and here access and modify , and inside that add component 
        
//         const borderDiv:any = document.getElementById(`uniqueDiv1${currentPage+1}`);
//         // // console.log("this is green Border: ",borderDiv , `uniqueDiv1${currentPage+1}`);
//         borderDiv.style.position = 'absolute';
//         borderDiv.style.top = '0';
//         borderDiv.style.left = '0';
//         borderDiv.style.width = `${viewport.width}px`;
//         borderDiv.style.height = `${viewport.height}px`;
//         borderDiv.style.border = '2px solid green';  
//         container.appendChild(borderDiv);
//       }
//     }
//   };


  return (
    <>
    </>
//     <div className="h-screen w-full flex flex-col items-center justify-center">
//       <div className="flex flex-row w-full h-full">
//         <div id="editorDivArea" className="flex flex-col items-center justify-center gap-2 p-3 min-w-[100vh] max-w-[100vh] h-full border border-blue-500">
//           {!pages && (
//             <div className="flex flex-col items-center">
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handleFileChange}
//                 className="bg-gray-100 text-[#283C42] border-1 border-[#283C42] px-4 py-2 rounded hover:bg-[#283C42] hover:text-white hover:border-white transition-colors duration-300 mb-4"
//               />
//             </div>
//           )}
//           {pages && (
//             <>
//               {/* ================================================================================================================= */}
//               <div className="w-full h-full overflow-y-auto flex justify-center items-center px-4 py-2">  
                
//                 {pages.map((page, index) => (
//                   <div
//                     key={index}
//                     className={`page-container ${index + 1 === currentPage ? 'block' : 'hidden'}`}
//                     ref={(ref) => (pageRefs.current[index] = ref)}
//                   >
//                     <div className="pdf-page border-purple-900  ">
//                       {/* {// // console.log("Index ID of Page:"+index+1)} */}
//                     </div>
//                     <div id={`uniqueDiv1${index+1}`}></div>
//                   </div>
//                 ))}
                
//               </div>
//             </>
//           )}
//         </div>
//         <div className="w-2/5 border flex flex-col">
//           <div className="p-2 w-full h-2/5 border min-w-[50vh] border-purple-500">
//             <Divider 
//               orientation="left" 
//               style={{borderBlockColor : "#283C42" , color: "#283C42"}} 
//             >
//               Templete Control
//             </Divider>
//             <div className='pl-3 pr-3'>
//               <label className="block text-gray-700 text-xs font-bold mb-2">Name</label>
//               <div className="mt-2 flex space-x-1">
//               <input 
//                   className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-2 text-xs" 
//                   type="text" 
//               />
//                   <button className="bg-[#283C42] text-white font-bold py-1 px-2 text-xs rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300">
//                       Save
//                   </button>
//                   <button className="bg-[#283C42] text-white font-bold py-1 px-2 text-xs rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300">
//                       Load
//                   </button>
//                   <button className="bg-[#283C42] text-white font-bold py-1 px-2 text-xs rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300">
//                       Reset
//                   </button>
//               </div>
//           </div>

//           <Divider orientation="left" style={{borderBlockColor : "#283C42" , color: "#283C42"}} >Components</Divider>
//           <div className='mt-2 flex space-x-1 gap-2'>
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 3V21M9 21H15M19 6V3H5V6" stroke="#283C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
      
//           <svg width="26" height="25" viewBox="0 -2 20 20" version="1.1">
//             <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
//               <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -3881.000000)" fill="#283C42">
//                 <g id="icons" transform="translate(56.000000, 160.000000)">
//                   <path d="M336,3725.5 C336,3724.948 336.448,3724.5 337,3724.5 C337.552,3724.5 338,3724.948 338,3725.5 C338,3726.052 337.552,3726.5 337,3726.5 C336.448,3726.5 336,3726.052 336,3725.5 L336,3725.5 Z M340,3733 L328,3733 L332.518,3726.812 L335.354,3730.625 L336.75,3728.75 L340,3733 Z M326,3735 L342,3735 L342,3723 L326,3723 L326,3735 Z M324,3737 L344,3737 L344,3721 L324,3721 L324,3737 Z" id="image_picture-[#972]"></path>
//                 </g>
//               </g>
//             </g>
//           </svg>
//         </div>


//         </div>
//           <div className="p-2 w-full h-3/5 border border-yellow-500">
//           <Divider orientation="left" style={{borderBlockColor : "#283C42" , color: "#283C42"}} >Utility</Divider>
//           <div className='flex flex-row items-center'> 
//             <input 
//             placeholder='Enter Text'
//                 className="mr-2 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-2 text-xs" 
//                 type="text" 
//                 />
        
//             {/* <button
//               className={`bg-gray-100 text-[#283C42] border-2 border-[#283C42] px-4 py-2 rounded transition-colors duration-300 mr-2 ${
//                 zoomStatus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#283C42] hover:text-white hover:border-white group'
//               }`}
//             > */}
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-white">
//                 <circle cx="12" cy="12" r="10" stroke="#1C274C" strokeWidth="1.5" className="group-hover:stroke-white transition-colors duration-300"/>
//                 <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" className="transition-colors duration-300 group-hover:stroke-white"/>
//               </svg>
//             {/* </button> */}
//             <div className='ml-1 mr-1'>
//               <svg width="24" height="80" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-white">
//                 <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white"/>
//               </svg>
//             </div>
//             {/* <button
//               className={`bg-gray-100 text-[#283C42] border-2 border-[#283C42] px-4 py-2 rounded transition-colors duration-300 ${
//                 zoomStatus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#283C42] hover:text-white hover:border-white group'
//               }`}
//             > */}
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-white">
//                 <circle cx="12" cy="12" r="10" stroke="#1C274C" strokeWidth="1.5" className="group-hover:stroke-white transition-colors duration-300"/>
//                 <path d="M15 12H9" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" className="group-hover:stroke-white transition-colors duration-300"/>
//               </svg>
//             {/* </button> */}
//           </div>

//           </div>
//         </div>  
//       </div>
//     </div>
  );
}

export default Templete;
