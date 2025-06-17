import nodemailer from 'nodemailer';
import { ProjectContractor } from '../models/Project';
import { ContractorRole } from '@shared/types';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export const EmailService = {
  /**
   * Send contractor assignment email
   */
  sendContractorAssignment: async (
    projectName: string,
    contractor: ProjectContractor,
    contactEmail: string
  ) => {
    const emailOptions: EmailOptions = {
      to: contactEmail,
      subject: `Project Assignment: ${projectName}`,
      html: `
        <h1>Project Assignment: ${projectName}</h1>
        <p>You have been assigned to the following role:</p>
        <ul>
          <li>Role: ${contractor.role}</li>
          <li>Rate: $${contractor.rate}/hour</li>
          ${contractor.estimatedHours ? `<li>Estimated Hours: ${contractor.estimatedHours}</li>` : ''}
          ${contractor.estimatedDays ? `<li>Estimated Days: ${contractor.estimatedDays}</li>` : ''}
        </ul>
        <p>Please confirm your availability for this project.</p>
      `,
    };

    return transporter.sendMail(emailOptions);
  },

  /**
   * Send invoice reminder email
   */
  sendInvoiceReminder: async (
    invoiceNumber: string,
    dueDate: Date,
    amount: number,
    recipientEmail: string
  ) => {
    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject: `Invoice Reminder: ${invoiceNumber}`,
      html: `
        <h1>Invoice Payment Reminder</h1>
        <p>This is a reminder that invoice ${invoiceNumber} is due on ${dueDate.toLocaleDateString()}.</p>
        <p>Amount due: $${amount.toFixed(2)}</p>
        <p>Please ensure payment is made by the due date.</p>
      `,
    };

    return transporter.sendMail(emailOptions);
  },

  /**
   * Send invoice to client
   */
  sendInvoice: async (
    invoiceNumber: string,
    clientEmail: string,
    amount: number,
    dueDate: Date,
    attachments: any[]
  ) => {
    const emailOptions: EmailOptions = {
      to: clientEmail,
      subject: `Invoice ${invoiceNumber}`,
      html: `
        <h1>Invoice ${invoiceNumber}</h1>
        <p>Please find attached invoice ${invoiceNumber} for the amount of $${amount.toFixed(2)}.</p>
        <p>Due date: ${dueDate.toLocaleDateString()}</p>
        <p>Thank you for your business!</p>
      `,
      attachments,
    };

    return transporter.sendMail(emailOptions);
  },

  /**
   * Send project status update
   */
  sendProjectUpdate: async (
    projectName: string,
    status: string,
    recipientEmail: string,
    details: string
  ) => {
    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject: `Project Update: ${projectName}`,
      html: `
        <h1>Project Update: ${projectName}</h1>
        <p>Status: ${status}</p>
        <p>${details}</p>
      `,
    };

    return transporter.sendMail(emailOptions);
  },
};

export default EmailService;
