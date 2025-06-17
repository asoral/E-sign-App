import { KJUR, KEYUTIL } from 'jsrsasign';

/**
 * Generates a self-signed certificate using the provided public and private keys.
 * @param privateKey - The PEM formatted private key.
 * @param publicKey - The PEM formatted public key.
 * @returns The self-signed certificate in PEM format.
 */
export const generateSelfSignedCertificate = (privateKey: string, publicKey: string): string => {
  // Check if the X509 class exists
  if (typeof KJUR.asn1.x509.X509 === "undefined") {
    throw new Error("X509 class is not available. Please check the jsrsasign library.");
  }

  // Create a new X509 certificate object
  const cert = new KJUR.asn1.x509.X509();

  // Set certificate attributes
  cert.setSubjectByString("CN=My Self-Signed Certificate"); // Common Name
  cert.setNotBefore(new Date().toISOString().replace(/\..+/, '') + "Z"); // Valid from now
  cert.setNotAfter(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().replace(/\..+/, '') + "Z"); // Valid for 1 year
  cert.setPublicKey(publicKey); // Public key
  cert.sign(privateKey, { algorithm: 'SHA256withRSA' }); // Sign with the private key

  // Get the certificate in PEM format
  const pem = cert.getPEM();
  return pem;
};

/**
 * Validates a self-signed certificate using the provided public key.
 * @param certificate - The PEM formatted self-signed certificate.
 * @param publicKey - The PEM formatted public key.
 * @returns A boolean indicating whether the certificate is valid.
 */
export const validateSelfSignedCertificate = (certificate: string, publicKey: string): boolean => {
  return KJUR.asn1.x509.X509.verify(certificate, publicKey);
};
