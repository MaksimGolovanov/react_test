// src/features/protocols/utils/CertificateGenerator.js
import { pdf } from '@react-pdf/renderer';
import CertificateDocument from '../ui/GenerateCertificatesModal/CertificateDocument';

export const generateCertificatePDF = async (protocol, workers) => {
  const doc = <CertificateDocument data={[{ protocol, workers }]} />;
  const blob = await pdf(doc).toBlob();
  return blob;
};