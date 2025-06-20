export const ALLOWED_DOCUMENT_TYPES = {
  agreements: ['.pdf', '.doc', '.docx'],
  invoices: ['.pdf', '.jpg', '.jpeg', '.png'],
  receipts: ['.pdf', '.jpg', '.jpeg', '.png']
} as const;

export type DocumentType = keyof typeof ALLOWED_DOCUMENT_TYPES;

export interface DocumentSection {
  type: DocumentType;
  label: string;
}
