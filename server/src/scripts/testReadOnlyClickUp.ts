import { clickupService } from '../services/clickupService';
import { ProjectPageData } from '../types/project';
import fs from 'fs';
import path from 'path';

const RESULTS_DIR = path.join(__dirname, '../../test-results');

function writeResult(filename: string, data: any) {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  const filePath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Written results to ${filename}`);
}

async function testReadOperations() {
  try {
    console.log('Starting ClickUp read-only operations test...\n');

    // Test 1: Get Workspaces
    console.log('Test 1: Get Workspaces');
    const workspaces = await clickupService.getWorkspaces();
    writeResult('01-workspaces.json', workspaces);
    console.log('✓ Successfully fetched workspaces\n');

    if (workspaces.teams && workspaces.teams.length > 0) {
      const workspace = workspaces.teams[0];
      
      // Test 2: Get Spaces
      console.log('Test 2: Get Spaces');
      const spaces = await clickupService.getSpaces(workspace.id);
      writeResult('02-spaces.json', spaces);
      console.log('✓ Successfully fetched spaces\n');

      if (spaces.spaces && spaces.spaces.length > 0) {
        const space = spaces.spaces[0];
        
        // Test 3: Get Lists
        console.log('Test 3: Get Lists');
        const lists = await clickupService.getLists(space.id);
        writeResult('03-lists.json', lists);
        console.log('✓ Successfully fetched lists\n');

        if (lists.lists && lists.lists.length > 0) {
          const list = lists.lists[0];
          
          // Test 4: Get Tasks
          console.log('Test 4: Get Tasks');
          const tasks = await clickupService.getTasks(list.id);
          writeResult('04-tasks.json', tasks);
          console.log('✓ Successfully fetched tasks\n');

          if (tasks.length > 0) {
            const task = tasks[0];
            
            // Test 5: Get Single Task
            console.log('Test 5: Get Single Task');
            const taskDetails = await clickupService.getTask(task.clickUp?.id || '');
            writeResult('05-task-details.json', taskDetails);
            console.log('✓ Successfully fetched single task\n');

            // Test 6: Get Subtasks
            console.log('Test 6: Get Subtasks');
            const subtasks = await clickupService.getSubTasks(task.clickUp?.id || '');
            writeResult('06-subtasks.json', subtasks);
            console.log('✓ Successfully fetched subtasks\n');

            // Test 7: Verify Project Data Structure
            console.log('Test 7: Verify Project Data Structure');
            const projectData = tasks[0] as ProjectPageData;
            
            // Check local data structure
            if (projectData.local) {
              console.log('✓ Local data structure is valid');
              console.log('  - Has ID:', !!projectData.local.id);
              console.log('  - Has title:', !!projectData.local.title);
              console.log('  - Has status:', !!projectData.local.status);
              console.log('  - Has budget:', !!projectData.local.budget);
            }

            // Check ClickUp data structure
            if (projectData.clickUp) {
              console.log('✓ ClickUp data structure is valid');
              console.log('  - Has ID:', !!projectData.clickUp.id);
              console.log('  - Has name:', !!projectData.clickUp.name);
              console.log('  - Has status:', !!projectData.clickUp.status);
              console.log('  - Has customFields:', !!projectData.clickUp.customFields);
            }

            writeResult('07-data-structure.json', {
              hasLocal: !!projectData.local,
              hasClickUp: !!projectData.clickUp,
              localFields: projectData.local ? Object.keys(projectData.local) : [],
              clickUpFields: projectData.clickUp ? Object.keys(projectData.clickUp) : []
            });
            console.log('\n✓ Successfully verified data structure\n');
          }
        }
      }
    }

    console.log('\nAll read-only operations completed successfully!');
    console.log('Check the test-results directory for detailed output.');

  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  }
}

// Run the tests
console.log('Starting ClickUp read-only integration tests...\n');
testReadOperations().then(() => {
  console.log('\nTests completed successfully!');
}).catch((error) => {
  console.error('\nTests failed:', error);
  process.exit(1);
});
