import dotenv from 'dotenv';
import path from 'path';
import type { ClickUpTask } from '../types/clickup';
import { clickupService as clickupServiceInstance } from '../services/clickupService';

interface ClickUpList {
  id: string;
  name: string;
  task_count: number;
}

async function main() {
  try {
    // Load environment variables first
    const envPath = path.resolve(__dirname, '../../.env.production');
    console.log('Loading environment variables from:', envPath);
    dotenv.config({ path: envPath });

    // Verify environment variables
    console.log('\n=== Environment Variables ===');
    console.log('CLICKUP_API_KEY:', process.env.CLICKUP_API_KEY ? '✓ Present' : '✗ Missing');
    console.log('CLICKUP_WORKSPACE_ID:', process.env.CLICKUP_WORKSPACE_ID ? '✓ Present' : '✗ Missing');

    if (!process.env.CLICKUP_API_KEY || !process.env.CLICKUP_WORKSPACE_ID) {
      throw new Error('Required environment variables are missing');
    }

    // Only import ClickUpService after environment variables are loaded
    const { clickupService } = await import('../services/clickupService');
    await testClickUpConnection(clickupService);
  } catch (error) {
    console.error('\n✗ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function testClickUpConnection(clickupService: typeof clickupServiceInstance) {
  console.log('\n=== Testing ClickUp API Connection ===\n');
  
  try {
    // Test 1: Get teams
    console.log('Test 1: Getting teams...');
    const teams = await clickupService.getTeams();
    console.log('✓ Successfully retrieved teams:', teams.length, 'teams found');
    console.log('First team:', {
      id: teams[0].id,
      name: teams[0].name
    });

    // Test 2: Get spaces for first team
    console.log('\nTest 2: Getting spaces for first team...');
    const spaces = await clickupService.getSpaces(teams[0].id);
    console.log('✓ Successfully retrieved spaces:', spaces.length, 'spaces found');
    if (spaces.length > 0) {
      console.log('First space:', {
        id: spaces[0].id,
        name: spaces[0].name,
        private: spaces[0].private
      });

      // Test 3: Get lists from first space
      console.log('\nTest 3: Getting lists from first space...');
      const lists = await clickupService.getLists(spaces[0].id);
      console.log('✓ Successfully retrieved lists:', lists.length, 'lists found');
      console.log('Lists:', lists.map((list: ClickUpList) => ({
        id: list.id,
        name: list.name,
        taskCount: list.task_count
      })));
    }

    // Test 4: Get tasks
    console.log('\nTest 4: Getting all tasks...');
    const tasks = await clickupService.getTasks();
    console.log('✓ Successfully retrieved tasks:', tasks.length, 'tasks found');
    
    // Display task status distribution
    const statusCount = tasks.reduce((acc: Record<string, number>, task: ClickUpTask) => {
      const status = task.status.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    console.log('\nTask status distribution:', statusCount);

    // Display sample task
    if (tasks.length > 0) {
      const sampleTask = tasks[0];
      console.log('\nSample task structure:', {
        id: sampleTask.id,
        name: sampleTask.name,
        list: sampleTask.list?.name,
        status: sampleTask.status,
        dateCreated: new Date(parseInt(sampleTask.date_created)).toLocaleString(),
        dateUpdated: new Date(parseInt(sampleTask.date_updated)).toLocaleString(),
        assignees: sampleTask.assignees?.map((a: { username: string }) => a.username),
        tags: sampleTask.tags?.map((t: { name: string }) => t.name)
      });
    }

    console.log('\n✓ All tests completed successfully');
  } catch (error) {
    console.error('\n✗ Error during testing:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the main function
main();
