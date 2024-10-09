/**
 * Converts a PDF file to a base64 encoded string.
 * @param {File} file - The PDF file to be converted.
 * @returns {Promise<string>} - A promise that resolves to a base64 encoded string of the PDF file.
 */
export async function pdfToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  