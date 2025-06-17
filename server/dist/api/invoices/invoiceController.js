"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAttachment = exports.sendPaymentReminder = exports.markInvoiceAsReceived = exports.markInvoiceAsSent = exports.updateInvoiceStatus = exports.getUnpaidClientInvoices = exports.getPendingContractorInvoices = exports.getProjectInvoices = exports.getInvoiceById = exports.createInvoice = void 0;
const types_1 = require("@shared/types");
const invoiceService_1 = __importDefault(require("../../services/invoiceService"));
const utils_1 = require("../../utils");
const createInvoice = async (req, res) => {
    try {
        if (!req.user) {
            throw new utils_1.ApiError(401, 'Authentication required');
        }
        const invoice = await invoiceService_1.default.createInvoice(req.body, req.user.userId);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error creating invoice:', error);
            res.status(500).json({ success: false, error: 'Failed to create invoice' });
        }
    }
};
exports.createInvoice = createInvoice;
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await invoiceService_1.default.getInvoiceById(req.params.id);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error getting invoice:', error);
            res.status(500).json({ success: false, error: 'Failed to get invoice' });
        }
    }
};
exports.getInvoiceById = getInvoiceById;
const getProjectInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService_1.default.getProjectInvoices(req.params.projectId);
        res.json({ success: true, data: invoices });
    }
    catch (error) {
        console.error('Error getting project invoices:', error);
        res.status(500).json({ success: false, error: 'Failed to get project invoices' });
    }
};
exports.getProjectInvoices = getProjectInvoices;
const getPendingContractorInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService_1.default.getPendingContractorInvoices();
        res.json({ success: true, data: invoices });
    }
    catch (error) {
        console.error('Error getting pending contractor invoices:', error);
        res.status(500).json({ success: false, error: 'Failed to get pending contractor invoices' });
    }
};
exports.getPendingContractorInvoices = getPendingContractorInvoices;
const getUnpaidClientInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService_1.default.getUnpaidClientInvoices();
        res.json({ success: true, data: invoices });
    }
    catch (error) {
        console.error('Error getting unpaid client invoices:', error);
        res.status(500).json({ success: false, error: 'Failed to get unpaid client invoices' });
    }
};
exports.getUnpaidClientInvoices = getUnpaidClientInvoices;
const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !Object.values(types_1.InvoiceStatus).includes(status)) {
            throw new utils_1.ApiError(400, 'Valid invoice status is required');
        }
        const invoice = await invoiceService_1.default.updateInvoiceStatus(req.params.id, status);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error updating invoice status:', error);
            res.status(500).json({ success: false, error: 'Failed to update invoice status' });
        }
    }
};
exports.updateInvoiceStatus = updateInvoiceStatus;
const markInvoiceAsSent = async (req, res) => {
    try {
        const invoice = await invoiceService_1.default.markInvoiceAsSent(req.params.id);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error marking invoice as sent:', error);
            res.status(500).json({ success: false, error: 'Failed to mark invoice as sent' });
        }
    }
};
exports.markInvoiceAsSent = markInvoiceAsSent;
const markInvoiceAsReceived = async (req, res) => {
    try {
        const invoice = await invoiceService_1.default.markInvoiceAsReceived(req.params.id);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error marking invoice as received:', error);
            res.status(500).json({ success: false, error: 'Failed to mark invoice as received' });
        }
    }
};
exports.markInvoiceAsReceived = markInvoiceAsReceived;
const sendPaymentReminder = async (req, res) => {
    try {
        const invoice = await invoiceService_1.default.sendPaymentReminder(req.params.id);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error sending payment reminder:', error);
            res.status(500).json({ success: false, error: 'Failed to send payment reminder' });
        }
    }
};
exports.sendPaymentReminder = sendPaymentReminder;
const addAttachment = async (req, res) => {
    try {
        // Note: This assumes file upload is handled by middleware
        if (!req.file) {
            throw new utils_1.ApiError(400, 'No file uploaded');
        }
        const invoice = await invoiceService_1.default.addAttachment(req.params.id, req.file.path);
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            res.status(error.statusCode).json({ success: false, error: error.message });
        }
        else {
            console.error('Error adding attachment:', error);
            res.status(500).json({ success: false, error: 'Failed to add attachment' });
        }
    }
};
exports.addAttachment = addAttachment;
//# sourceMappingURL=invoiceController.js.map