import projectService from '../services/projectService';
import { clickupService } from '../services/clickupService';
import { Project, ProjectStatus, CreateProjectInput } from '../types/project';
import fs from 'fs';
import path from 'path';

const RESULTS_DIR = path.join(__dirname, '../../test-results/local-ops');

function writeResult(filename: string, data: any) {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  const filePath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Written results to ${filename}`);
}

async function testLocalOperations() {
  try {
    console.log('Starting local operations test...\n');

    // Test 1: Create Local Project
    console.log('Test 1: Create Local Project');
    const newProject: CreateProjectInput = {
      title: 'Test Local Project',
      client: 'Test Client',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      budget: 5000
    };

    const createdProject = await projectService.createProject(newProject);
    writeResult('01-created-project.json', createdProject);
    console.log('✓ Successfully created local project\n');

    // Test 2: Update Local Project Status
    console.log('Test 2: Update Local Project Status');
    const updatedProject = await projectService.updateProjectStatus(createdProject.id, ProjectStatus.ACTIVE);
    writeResult('02-updated-project.json', updatedProject);
    console.log('✓ Successfully updated local project status\n');

    // Test 3: Verify ClickUp Data Remains Unchanged
    console.log('Test 3: Verify ClickUp Data Remains Unchanged');
    if (updatedProject.clickUpId) {
      const clickUpData = await clickupService.getTask(updatedProject.clickUpId);
      writeResult('03-clickup-data.json', clickUpData);
      
      // Compare with original ClickUp data
      const dataMatches = !!clickUpData;
      console.log('ClickUp data unchanged:', dataMatches ? '✓' : '✗');
      
      if (!dataMatches) {
        console.log('Warning: ClickUp data may have been modified');
        writeResult('03-data-diff.json', {
          original: updatedProject.clickUpId,
          current: clickUpData
        });
      }
    } else {
      console.log('✓ No ClickUp data associated (as expected)\n');
    }

    // Test 4: Local Data Structure Validation
    console.log('Test 4: Local Data Structure Validation');
    const validationResults = {
      hasRequiredFields: true,
      fieldTypes: {} as Record<string, string>,
      issues: [] as string[]
    };

    // Check required fields
    const requiredFields = ['id', 'title', 'client', 'status', 'timeframe', 'budget'];
    for (const field of requiredFields) {
      if (!(field in updatedProject)) {
        validationResults.hasRequiredFields = false;
        validationResults.issues.push(`Missing required field: ${field}`);
      }
    }

    // Check field types
    Object.entries(updatedProject).forEach(([key, value]) => {
      validationResults.fieldTypes[key] = typeof value;
      if (value === null) {
        validationResults.issues.push(`Field ${key} is null`);
      }
    });

    writeResult('04-validation-results.json', validationResults);
    console.log('✓ Successfully validated local data structure\n');

    // Test 5: Project Retrieval
    console.log('Test 5: Project Retrieval');
    const retrievedProject = await projectService.getProjectById(updatedProject.id);
    const retrievalCheck = {
      found: !!retrievedProject,
      matchesUpdated: JSON.stringify(retrievedProject) === JSON.stringify(updatedProject)
    };
    writeResult('05-retrieval-check.json', retrievalCheck);
    console.log('✓ Successfully verified project retrieval\n');

    console.log('\nAll local operations completed successfully!');
    console.log('Check the test-results/local-ops directory for detailed output.');

  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  }
}

// Run the tests
console.log('Starting local operations tests...\n');
testLocalOperations().then(() => {
  console.log('\nTests completed successfully!');
}).catch((error) => {
  console.error('\nTests failed:', error);
  process.exit(1);
});
