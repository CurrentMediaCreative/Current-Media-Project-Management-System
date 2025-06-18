export interface Attachment {
  type: 'receipt';
  path: string;
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface StorageConfig {
  uploadDir: string;
  maxFileSize: number;
  allowedTypes: string[];
}
