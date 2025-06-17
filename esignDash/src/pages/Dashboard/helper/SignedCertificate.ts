interface Attribute {
    name: string;
    value: string;
    type: string;
    shortName: string;
  }
  
  interface IssuerAttributes {
    attributes: Attribute[];
    hash: string | null;
  }
  
  interface PublicKeyData {
    data: number[];
    t: number;
    s: number;
  }
  
  interface PublicKey {
    n: PublicKeyData;
    e: PublicKeyData;
  }
  
  interface Validity {
    notBefore: string;
    notAfter: string;
  }
  
  interface MD {
    algorithm: string;
    blockLength: number;
    digestLength: number;
    messageLength: number;
    fullMessageLength: number[];
    messageLengthSize: number;
    messageLength64: number[];
  }
  
  export interface CertificateSigned {
    version: number;
    serialNumber: string;
    signatureOid: string;
    signature: string;
    siginfo: { algorithmOid: string };
    validity: Validity;
    issuer: { attributes: IssuerAttributes; hash: string | null };
    subject: { attributes: Attribute[]; hash: string | null };
    extensions: any[];
    publicKey: PublicKey;
    md: MD;
    validFrom: string;
    validTo: string;
    tbsCertificate: any; 
  }
  