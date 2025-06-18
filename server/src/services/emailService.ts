import nodemailer from 'nodemailer';
import { EmailData } from '../types';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Send project creation notification to Jake
   */
  async sendProjectCreationNotification(data: {
    to: string;
    projectTitle: string;
    projectDetails: any;
  }): Promise<void> {
    const emailData: EmailData = {
      to: data.to,
      subject: `New Project Created: ${data.projectTitle}`,
      text: `A new project "${data.projectTitle}" has been created.\n\nProject Details:\n${JSON.stringify(data.projectDetails, null, 2)}`,
      html: `
        <h1>New Project Created: ${data.projectTitle}</h1>
        <p>A new project has been created with the following details:</p>
        <pre>${JSON.stringify(data.projectDetails, null, 2)}</pre>
      `
    };

    await this.sendEmail(emailData);
  }

  /**
   * Send contractor assignment notification
   */
  async sendContractorAssignment(data: {
    to: string;
    projectTitle: string;
    role: string;
    startDate: string;
    endDate: string;
  }): Promise<void> {
    const emailData: EmailData = {
      to: data.to,
      subject: `Project Assignment: ${data.projectTitle}`,
      text: `
        You have been assigned to the project "${data.projectTitle}" as ${data.role}.
        Project Duration: ${data.startDate} to ${data.endDate}
        
        Please confirm your availability for this project.
      `,
      html: `
        <h1>Project Assignment: ${data.projectTitle}</h1>
        <p>You have been assigned to the project "${data.projectTitle}" as <strong>${data.role}</strong>.</p>
        <p>Project Duration: ${data.startDate} to ${data.endDate}</p>
        <p>Please confirm your availability for this project.</p>
      `
    };

    await this.sendEmail(emailData);
  }

  /**
   * Send project status update
   */
  async sendProjectStatusUpdate(data: {
    to: string;
    projectTitle: string;
    status: string;
    updates: string[];
  }): Promise<void> {
    const emailData: EmailData = {
      to: data.to,
      subject: `Project Status Update: ${data.projectTitle}`,
      text: `
        Project Status Update for "${data.projectTitle}"
        Current Status: ${data.status}
        
        Updates:
        ${data.updates.join('\n')}
      `,
      html: `
        <h1>Project Status Update: ${data.projectTitle}</h1>
        <p>Current Status: <strong>${data.status}</strong></p>
        <h2>Updates:</h2>
        <ul>
          ${data.updates.map(update => `<li>${update}</li>`).join('')}
        </ul>
      `
    };

    await this.sendEmail(emailData);
  }

  /**
   * Send generic email
   */
  private async sendEmail(data: EmailData): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}

export default new EmailService();
