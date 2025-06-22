import fs from 'fs';
import path from 'path';

const RESULTS_DIR = path.join(__dirname, '../../exploration-results');
const ANALYSIS_DIR = path.join(RESULTS_DIR, 'analysis');

// Create analysis directory if it doesn't exist
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

function writeAnalysis(filename: string, data: any) {
  const filePath = path.join(ANALYSIS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Written analysis to ${filename}`);
}

function analyzeTaskStructure() {
  const tasksPath = path.join(RESULTS_DIR, '05-tasks.json');
  const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

  if (tasksData.tasks && tasksData.tasks.length > 0) {
    // Get just the first task
    const sampleTask = tasksData.tasks[0];

    interface FieldStructure {
      type: string;
      isNull: boolean;
      sample: string | null;
    }

    // Extract the structure (field names and their types)
    const structure: Record<string, FieldStructure> = {};
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
  } else {
    console.log('No tasks found in the data');
  }
}

// Run the analysis
console.log('Starting task structure analysis...');
analyzeTaskStructure();
console.log('Analysis complete! Check the exploration-results/analysis directory.');
