import { Request, Response } from 'express';
import { InvoiceStatus, InvoiceType } from '@shared/types';
import invoiceService from '../../services/invoiceService';
import { ApiError } from '../../utils';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const invoice = await invoiceService.createInvoice(req.body, req.user.userId);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, error: 'Failed to create invoice' });
    }
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error getting invoice:', error);
      res.status(500).json({ success: false, error: 'Failed to get invoice' });
    }
  }
};

export const getProjectInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await invoiceService.getProjectInvoices(req.params.projectId);
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error getting project invoices:', error);
    res.status(500).json({ success: false, error: 'Failed to get project invoices' });
  }
};

export const getPendingContractorInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await invoiceService.getPendingContractorInvoices();
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error getting pending contractor invoices:', error);
    res.status(500).json({ success: false, error: 'Failed to get pending contractor invoices' });
  }
};

export const getUnpaidClientInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await invoiceService.getUnpaidClientInvoices();
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error getting unpaid client invoices:', error);
    res.status(500).json({ success: false, error: 'Failed to get unpaid client invoices' });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !Object.values(InvoiceStatus).includes(status)) {
      throw new ApiError(400, 'Valid invoice status is required');
    }

    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, status);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ success: false, error: 'Failed to update invoice status' });
    }
  }
};

export const markInvoiceAsSent = async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.markInvoiceAsSent(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error marking invoice as sent:', error);
      res.status(500).json({ success: false, error: 'Failed to mark invoice as sent' });
    }
  }
};

export const markInvoiceAsReceived = async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.markInvoiceAsReceived(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error marking invoice as received:', error);
      res.status(500).json({ success: false, error: 'Failed to mark invoice as received' });
    }
  }
};

export const sendPaymentReminder = async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.sendPaymentReminder(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error sending payment reminder:', error);
      res.status(500).json({ success: false, error: 'Failed to send payment reminder' });
    }
  }
};

export const addAttachment = async (req: Request, res: Response) => {
  try {
    // Note: This assumes file upload is handled by middleware
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const invoice = await invoiceService.addAttachment(req.params.id, req.file.path);
    res.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      console.error('Error adding attachment:', error);
      res.status(500).json({ success: false, error: 'Failed to add attachment' });
    }
  }
};
