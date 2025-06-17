import { PDFDocument } from 'pdf-lib';
import { encode } from 'base64-arraybuffer';

/**
 * Splits a base64 encoded PDF into individual pages and returns an array of base64 strings for each page.
 * @param {string} base64PDF - The base64 encoded PDF.
 * @returns {Promise<Array<{ page: number, data: string }>>} - An array of objects with page number and base64 data.
 */
export async function splitPDF(base64PDF: string): Promise<Array<{ page: number, data: string }>> {
  const pdfDoc = await PDFDocument.load(base64PDF);
  const pageCount = pdfDoc.getPageCount();
  const pagesBase64: Array<{ page: number, data: string }> = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);

    const newPdfBytes = await newPdf.save();
    const newPdfBase64 = encode(newPdfBytes.buffer);

    pagesBase64.push({ page: i+1, data: newPdfBase64 });
  }

  return pagesBase64;
}
