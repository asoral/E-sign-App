import React, {useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.js';
import { PdfRendererProps } from '../Interface'
  
  const PdfRenderer: React.FC<PdfRendererProps> = ({ pdfData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMounted = useRef(true);
    // const [scalvalue, setScaleValue] = useState();
    useEffect(() => {
      isMounted.current = true;
      const renderPdfPage = async () => {
        const canvas = canvasRef.current;
        // setScaleValue(value);
        if (canvas) {
          const pdf = await pdfjsLib.getDocument({ data: atob(pdfData) }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1 });
          const context = canvas.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Set the canvas dimensions to match the viewport
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            // Render the PDF page into the canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
  
            await page.render(renderContext).promise;
          }
        } else {
          console.error('Canvas not found.');
        }
      };
  
      renderPdfPage();
      return () => {
        isMounted.current = false;
      };
    }, [pdfData]);
  
    return (
      <canvas
        ref={canvasRef}
        width={297}  // Width of A4 size paper in pixels
        height={420}  // Height of A4 size paper in pixels
      />
    );
  };

export default PdfRenderer
