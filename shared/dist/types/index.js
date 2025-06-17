"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorRole = exports.InvoiceStatus = exports.InvoiceType = exports.ClickUpStatus = exports.ProjectStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["NEW"] = "new";
    ProjectStatus["PENDING"] = "pending";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["ARCHIVED"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ClickUpStatus;
(function (ClickUpStatus) {
    ClickUpStatus["NOT_SENT"] = "not_sent";
    ClickUpStatus["PENDING"] = "pending";
    ClickUpStatus["SYNCED"] = "synced";
    ClickUpStatus["ERROR"] = "error";
})(ClickUpStatus || (exports.ClickUpStatus = ClickUpStatus = {}));
var InvoiceType;
(function (InvoiceType) {
    InvoiceType["CLIENT"] = "CLIENT";
    InvoiceType["CONTRACTOR"] = "CONTRACTOR";
})(InvoiceType || (exports.InvoiceType = InvoiceType = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["PENDING"] = "PENDING";
    InvoiceStatus["SENT"] = "SENT";
    InvoiceStatus["RECEIVED"] = "RECEIVED";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["VOID"] = "VOID";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var ContractorRole;
(function (ContractorRole) {
    ContractorRole["PRODUCER"] = "PRODUCER";
    ContractorRole["STORY_BOARD_ARTIST"] = "STORY_BOARD_ARTIST";
    ContractorRole["SHOOTER"] = "SHOOTER";
    ContractorRole["JUNIOR_SHOOTER"] = "JUNIOR_SHOOTER";
    ContractorRole["SOUND_CAPTURE"] = "SOUND_CAPTURE";
    ContractorRole["SOUND_ENGINEER"] = "SOUND_ENGINEER";
    ContractorRole["DRONE_OPERATOR"] = "DRONE_OPERATOR";
    ContractorRole["ON_SITE_PRODUCER"] = "ON_SITE_PRODUCER";
    ContractorRole["ALL_IN_ONE"] = "ALL_IN_ONE";
    ContractorRole["PHOTOGRAPHER"] = "PHOTOGRAPHER";
    ContractorRole["JUNIOR_EDITOR"] = "JUNIOR_EDITOR";
    ContractorRole["SENIOR_EDITOR"] = "SENIOR_EDITOR";
    ContractorRole["SFX_ARTIST"] = "SFX_ARTIST";
    ContractorRole["GRAPHIC_ARTIST"] = "GRAPHIC_ARTIST";
    ContractorRole["CONTRACTED_SHOOTER"] = "CONTRACTED_SHOOTER";
    ContractorRole["GEAR_RENTAL"] = "GEAR_RENTAL";
    ContractorRole["MILEAGE"] = "MILEAGE";
})(ContractorRole || (exports.ContractorRole = ContractorRole = {}));
//# sourceMappingURL=index.js.map