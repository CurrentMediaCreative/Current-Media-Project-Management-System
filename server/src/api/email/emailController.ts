import { Request, Response } from 'express';
import { storage } from '../../services/storageService';

interface EmailData {
  to: string;
  subject: string;
  content: string;
}

/**
 * Send project update email
 */
export const sendProjectUpdate = async (req: Request, res: Response) => {
  try {
    const emailData: EmailData = req.body;
    
    // For MVP, just log the email that would be sent
    console.log('Project Update Email:', {
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content
    });

    // Store notification
    const notifications = await storage.read<any[]>('notifications.json');
    const notification = {
      id: Date.now().toString(),
      type: 'project_update',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        emailSent: true,
        recipient: emailData.to,
        subject: emailData.subject
      }
    };
    
    notifications.push(notification);
    await storage.write('notifications.json', notifications);

    res.json({ message: 'Project update email logged successfully' });
  } catch (error) {
    console.error('Error sending project update email:', error);
    res.status(500).json({ message: 'Error sending project update email' });
  }
};

/**
 * Send contractor notification
 */
export const sendContractorNotification = async (req: Request, res: Response) => {
  try {
    const emailData: EmailData = req.body;
    
    // For MVP, just log the email that would be sent
    console.log('Contractor Notification Email:', {
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content
    });

    // Store notification
    const notifications = await storage.read<any[]>('notifications.json');
    const notification = {
      id: Date.now().toString(),
      type: 'contractor_notification',
      read: false,
      timestamp: new Date().toISOString(),
      details: {
        emailSent: true,
        recipient: emailData.to,
        subject: emailData.subject
      }
    };
    
    notifications.push(notification);
    await storage.write('notifications.json', notifications);

    res.json({ message: 'Contractor notification email logged successfully' });
  } catch (error) {
    console.error('Error sending contractor notification email:', error);
    res.status(500).json({ message: 'Error sending contractor notification email' });
  }
};
