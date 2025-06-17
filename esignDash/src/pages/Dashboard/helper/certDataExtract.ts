import * as asn1js from 'asn1js';
import { Certificate } from 'pkijs';
import { fromBER } from 'asn1js';

// Convert PEM to ArrayBuffer
function pemToArrayBuffer(pem:any) {
  const base64 = pem
    .replace(/-----BEGIN CERTIFICATE-----/, '')
    .replace(/-----END CERTIFICATE-----/, '')
    .replace(/\s+/g, '');
  const binaryString = atob(base64);
  const buffer = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
}

export async function parseCertificate(pem:any) {
  const certBuffer = pemToArrayBuffer(pem);
  const asn1 = fromBER(certBuffer);
  const cert = new Certificate({ schema: asn1.result });

  const issuer = cert.issuer.typesAndValues.map(t => `${t.type}: ${t.value.valueBlock.value}`).join(', ');
  const subject = cert.subject.typesAndValues.map(t => `${t.type}: ${t.value.valueBlock.value}`).join(', ');
  const validFrom = cert.notBefore.value.toISOString().split('T')[0];
  const validTo = cert.notAfter.value.toISOString().split('T')[0];
  const serialNumber = cert.serialNumber.valueBlock.toString();

  return {
    subject,
    issuer,
    validFrom,
    validTo,
    serialNumber,
  };
}
