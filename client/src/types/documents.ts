export type DocumentType = 'agreements' | 'invoices' | 'receipts';

export interface DocumentSection {
  type: DocumentType;
  label: string;
}

export const ALLOWED_DOCUMENT_TYPES: Record<DocumentType, string[]> = {
  agreements: ['.pdf', '.doc', '.docx'],
  invoices: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  receipts: ['.pdf', '.jpg', '.jpeg', '.png']
};
