import api from '../utils/api';
import { LocalProject } from '../types/project';

export class EmailService {
  async sendContractorAssignment(data: {
    to: string;
    contractorName: string;
    projectTitle: string;
    role: string;
    rate: number;
    isFixed: boolean;
  }): Promise<void> {
    try {
      await api.post('/api/email/contractor-assignment', data);
    } catch (error) {
      console.error('Failed to send contractor assignment email:', error);
      throw error;
    }
  }

  async sendProjectToJake(projectData: Partial<LocalProject>): Promise<void> {
    try {
      await api.post('/api/email/send-to-jake', {
        projectData,
        to: 'jake@currentmedia.ca'
      });
    } catch (error) {
      console.error('Failed to send project to Jake:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
