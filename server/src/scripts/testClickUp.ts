import { clickupService } from '../services/clickupService';
import { ClickUpData } from '../types/project';
import fs from 'fs';
import path from 'path';

const RESULTS_DIR = path.join(__dirname, '../../exploration-results');

function writeResult(filename: string, data: any) {
  const filePath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Written results to ${filename}`);
}

async function exploreClickUpData() {
  try {
    // Get workspaces
    console.log('Fetching Workspaces...');
    const workspaces = await clickupService.getWorkspaces();
    writeResult('01-workspaces.json', workspaces);

    if (workspaces.teams && workspaces.teams.length > 0) {
      const workspace = workspaces.teams[0];
      console.log(`Using workspace: ${workspace.name}`);

      // Get spaces
      console.log('Fetching Spaces...');
      const spaces = await clickupService.getSpaces(workspace.id);
      writeResult('02-spaces.json', spaces);

      if (spaces.spaces && spaces.spaces.length > 0) {
        const space = spaces.spaces[0];
        console.log(`Using space: ${space.name}`);

        // Get lists
        console.log('Fetching Lists...');
        const lists = await clickupService.getLists(space.id);
        writeResult('03-lists.json', lists);

        if (lists.lists && lists.lists.length > 0) {
          const list = lists.lists[0];
          console.log(`Using list: ${list.name}`);

          // Get tasks
          console.log('Fetching Tasks...');
          const clickupProjects = await clickupService.getTasks(list.id) as ClickUpData[];
          writeResult('04-mapped-projects.json', clickupProjects);

          if (clickupProjects.length > 0) {
            const project = clickupProjects[0];
            console.log(`Using project: ${project.name}`);

            // Get detailed task info
            console.log('Fetching Detailed Project Info...');
            const projectDetails = await clickupService.getTask(project.id);
            writeResult('05-project-details.json', projectDetails);
          }
        }
      }
    }
  } catch (error) {
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
