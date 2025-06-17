export interface PdfRendererProps {
    pdfData: string;
  }

export interface ComponentData {
    id: number;
    type: string;
    content?: string;
    pageNo: number;
    value?: string; 
    position: { top: number; left: number };
    size?: { width: number; height: number };
    name: string;
    fontSize?: number;
    assign?: string[];
    checked?: boolean;
    cert?: string;
    cert_pem?:string;
  }

  export interface ApiResponse {
    message: {
      status: number;
      data: OpenSSLList[];
    };
  }
  
  export interface OpenSSLList {
    name: string;
    openssl_name: string;
    country: string;
  }