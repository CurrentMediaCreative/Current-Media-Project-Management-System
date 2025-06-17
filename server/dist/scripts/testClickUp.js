"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickupService_1 = require("../services/clickupService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const RESULTS_DIR = path_1.default.join(__dirname, '../../exploration-results');
function writeResult(filename, data) {
    const filePath = path_1.default.join(RESULTS_DIR, filename);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Written results to ${filename}`);
}
async function exploreClickUpData() {
    try {
        // Get workspaces
        console.log('Fetching Workspaces...');
        const workspaces = await clickupService_1.clickupService.getWorkspaces();
        writeResult('01-workspaces.json', workspaces);
        if (workspaces.teams && workspaces.teams.length > 0) {
            const workspace = workspaces.teams[0];
            console.log(`Using workspace: ${workspace.name}`);
            // Get spaces
            console.log('Fetching Spaces...');
            const spaces = await clickupService_1.clickupService.getSpaces(workspace.id);
            writeResult('02-spaces.json', spaces);
            if (spaces.spaces && spaces.spaces.length > 0) {
                const space = spaces.spaces[0];
                console.log(`Using space: ${space.name}`);
                // Get lists
                console.log('Fetching Lists...');
                const lists = await clickupService_1.clickupService.getLists(space.id);
                writeResult('03-lists.json', lists);
                if (lists.lists && lists.lists.length > 0) {
                    const list = lists.lists[0];
                    console.log(`Using list: ${list.name}`);
                    // Get custom fields
                    console.log('Fetching Custom Fields...');
                    const customFields = await clickupService_1.clickupService.getCustomFields(list.id);
                    writeResult('04-custom-fields.json', customFields);
                    // Get tasks
                    console.log('Fetching Tasks...');
                    const mappedProjects = await clickupService_1.clickupService.getTasks(list.id);
                    writeResult('05-mapped-projects.json', mappedProjects);
                    if (mappedProjects.length > 0) {
                        const project = mappedProjects[0];
                        console.log(`Using project: ${project.name}`);
                        // Get detailed task info
                        console.log('Fetching Detailed Project Info...');
                        const projectDetails = await clickupService_1.clickupService.getTask(project.id);
                        writeResult('06-project-details.json', projectDetails);
                    }
                }
                // Get views
                console.log('Fetching Views...');
                const views = await clickupService_1.clickupService.getViews(space.id);
                writeResult('07-views.json', views);
            }
        }
    }
    catch (error) {
        console.error('Error exploring ClickUp data:', error);
    }
}
// Run the exploration
console.log('Starting ClickUp API exploration...');
exploreClickUpData().then(() => {
    console.log('ClickUp API exploration complete! Check the exploration-results directory for the data.');
}).catch((error) => {
    console.error('Error during exploration:', error);
    process.exit(1);
});
//# sourceMappingURL=testClickUp.js.map