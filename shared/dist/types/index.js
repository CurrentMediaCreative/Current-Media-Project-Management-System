"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStatus = exports.ContractorRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ContractorRole;
(function (ContractorRole) {
    ContractorRole["PRODUCER"] = "PRODUCER";
    ContractorRole["SHOOTER"] = "SHOOTER";
    ContractorRole["PHOTOGRAPHER"] = "PHOTOGRAPHER";
    ContractorRole["SOUND_ENGINEER"] = "SOUND_ENGINEER";
    ContractorRole["SENIOR_EDITOR"] = "SENIOR_EDITOR";
    ContractorRole["JUNIOR_EDITOR"] = "JUNIOR_EDITOR";
})(ContractorRole || (exports.ContractorRole = ContractorRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["NEW_NOT_SENT"] = "new_not_sent";
    ProjectStatus["NEW_SENT"] = "new_sent";
    ProjectStatus["PENDING_CLICKUP"] = "pending_clickup";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["ARCHIVED"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
//# sourceMappingURL=index.js.map