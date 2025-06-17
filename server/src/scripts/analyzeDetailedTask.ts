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

function analyzeDetailedTask() {
  const tasksPath = path.join(RESULTS_DIR, '05-tasks.json');
  const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

  if (tasksData.tasks && tasksData.tasks.length > 0) {
    const sampleTask = tasksData.tasks[0];
    
    // Create a detailed analysis of important nested objects
    const detailedAnalysis = {
      taskName: sampleTask.name,
      taskId: sampleTask.id,
      status: sampleTask.status,
      customFields: sampleTask.custom_fields,
      list: sampleTask.list,
      project: sampleTask.project,
      folder: sampleTask.folder,
      space: sampleTask.space,
      dates: {
        created: new Date(parseInt(sampleTask.date_created)).toISOString(),
        updated: new Date(parseInt(sampleTask.date_updated)).toISOString(),
        due: sampleTask.due_date,
        start: sampleTask.start_date
      },
      assignees: sampleTask.assignees,
      tags: sampleTask.tags,
      timeTracking: {
        estimate: sampleTask.time_estimate,
        points: sampleTask.points
      }
    };

    // Write the detailed analysis
    writeAnalysis('detailed-task.json', detailedAnalysis);
    console.log('Analyzed detailed task structure');
  } else {
    console.log('No tasks found in the data');
  }
}

// Run the analysis
console.log('Starting detailed task analysis...');
analyzeDetailedTask();
console.log('Analysis complete! Check the exploration-results/analysis directory.');
