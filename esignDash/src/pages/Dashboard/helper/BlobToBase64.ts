export function BlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]); 
        } else {
          reject(new Error('FileReader did not return a string result'));
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  