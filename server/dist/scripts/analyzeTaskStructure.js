"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const RESULTS_DIR = path_1.default.join(__dirname, '../../exploration-results');
const ANALYSIS_DIR = path_1.default.join(RESULTS_DIR, 'analysis');
// Create analysis directory if it doesn't exist
if (!fs_1.default.existsSync(ANALYSIS_DIR)) {
    fs_1.default.mkdirSync(ANALYSIS_DIR, { recursive: true });
}
function writeAnalysis(filename, data) {
    const filePath = path_1.default.join(ANALYSIS_DIR, filename);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Written analysis to ${filename}`);
}
function analyzeTaskStructure() {
    const tasksPath = path_1.default.join(RESULTS_DIR, '05-tasks.json');
    const tasksData = JSON.parse(fs_1.default.readFileSync(tasksPath, 'utf8'));
    if (tasksData.tasks && tasksData.tasks.length > 0) {
        // Get just the first task
        const sampleTask = tasksData.tasks[0];
        // Extract the structure (field names and their types)
        const structure = {};
        for (const [key, value] of Object.entries(sampleTask)) {
            structure[key] = {
                type: Array.isArray(value) ? 'array' : typeof value,
                isNull: value === null,
                sample: value === null ? null :
                    typeof value === 'object' ? '[Object]' :
                        String(value).substring(0, 100) // Limit string length
            };
        }
        // Write the structure analysis
        writeAnalysis('task-structure.json', {
            totalTasks: tasksData.tasks.length,
            sampleTaskId: sampleTask.id,
            sampleTaskName: sampleTask.name,
            fieldStructure: structure
        });
        console.log(`Analyzed structure of ${tasksData.tasks.length} tasks`);
    }
    else {
        console.log('No tasks found in the data');
    }
}
// Run the analysis
console.log('Starting task structure analysis...');
analyzeTaskStructure();
console.log('Analysis complete! Check the exploration-results/analysis directory.');
//# sourceMappingURL=analyzeTaskStructure.js.map