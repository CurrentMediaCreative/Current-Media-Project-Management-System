"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
class EmailService {
    // MVP: Only implementing essential project creation notification
    async sendProjectToJake(data) {
        const { projectData, to } = data;
        const { title, client, startDate, endDate, budget } = projectData;
        const emailContent = `
New Project Overview

Project: ${title}
Client: ${client}

Timeline:
- Start Date: ${startDate.toLocaleDateString()}
- End Date: ${endDate.toLocaleDateString()}

Budget: $${budget.toLocaleString()}
    `;
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@currentmedia.ca',
            to,
            subject: `New Project: ${title} - ${client}`,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>')
        });
    }
    // TODO: Implement in future iterations
    async sendContractorAssignment(data) {
        console.log('TODO: Implement sendContractorAssignment', data);
    }
    // TODO: Implement in future iterations
    async sendClientInvoice(data) {
        console.log('TODO: Implement sendClientInvoice', data);
    }
    // TODO: Implement in future iterations
    async sendContractorInvoice(data) {
        console.log('TODO: Implement sendContractorInvoice', data);
    }
    // TODO: Implement in future iterations
    async sendClientInvoiceReminder(data) {
        console.log('TODO: Implement sendClientInvoiceReminder', data);
    }
    // TODO: Implement in future iterations
    async sendContractorInvoiceReminder(data) {
        console.log('TODO: Implement sendContractorInvoiceReminder', data);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=emailService.js.map