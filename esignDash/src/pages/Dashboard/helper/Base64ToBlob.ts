export async function Base64ToBlob(base64: string, mimeType: string = 'application/pdf'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const byteCharacters = atob(base64); // Decode Base64 string
        const byteNumbers = new Array(byteCharacters.length);
  
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers); // Create a typed array
        const blob = new Blob([byteArray], { type: mimeType }); // Create Blob with MIME type
        resolve(blob);
      } catch (error) {
        reject(new Error('Failed to convert Base64 to Blob: ' + error));
      }
    });
  }
  