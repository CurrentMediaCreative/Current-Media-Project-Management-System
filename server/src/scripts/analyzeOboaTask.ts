import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

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

async function analyzeOboaTask() {
  try {
    // Load environment variables
    const envPath = path.join(process.cwd(), '.env.production');
    console.log('Loading environment variables from:', envPath);
    dotenv.config({ path: envPath });

    const apiKey = process.env.CLICKUP_API_KEY;
    if (!apiKey) {
      throw new Error('CLICKUP_API_KEY environment variable is not set');
    }

    console.log('\n=== Analyzing OBOA Task ===\n');

    // First get all tasks to find the ID
    const baseUrl = 'https://api.clickup.com/api/v2';
    const headers = {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    };

    // Get all tasks from the Edits list
    const listId = '901108619964'; // Edits list ID
    const tasksResponse = await axios.get(`${baseUrl}/list/${listId}/task?archived=false`, {
      headers,
      params: {
        subtasks: true,
        include_subtasks: true,
        include_closed: true
      }
    });

    // Find the OBOA task
    const tasks = tasksResponse.data.tasks;
    const task = tasks.find((t: any) => t.name.includes('OBOA - Jonathan - 2 Courses'));

    if (!task) {
      console.log('Task not found');
      return;
    }

    // Save complete raw task data
    writeAnalysis('oboa-task-raw.json', task);
    console.log('\nComplete task data saved to oboa-task-raw.json');

    // Find all tasks that have this task as their parent
    const subtasks = tasks.filter((t: any) => t.parent === task.id);
    
    // Log key fields for quick reference
    console.log('\nTask Overview:', {
      id: task.id,
      name: task.name,
      parent: task.parent,
      linkedTasks: task.linked_tasks,
      subtaskCount: subtasks.length,
      subtasks: subtasks.map((st: any) => ({
        id: st.id,
        name: st.name,
        parent: st.parent,
        status: st.status?.status
      }))
    });

    // If it has subtasks, save those too
    if (subtasks.length > 0) {
      writeAnalysis('oboa-subtasks-raw.json', subtasks);
      console.log('\nSubtasks Overview:', subtasks.map((st: any) => ({
        id: st.id,
        name: st.name,
        parent: st.parent,
        status: st.status?.status
      })));
    }

    console.log('\nAnalysis complete! Check the exploration-results/analysis directory.');

  } catch (error) {
    console.error('\nError during analysis:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the analysis
analyzeOboaTask();
