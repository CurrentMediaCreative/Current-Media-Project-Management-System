import { LocalProject, CreateProjectInput, UpdateProjectInput } from '../types/project';
import { db } from '../../config/database';
import fs from 'fs';
import path from 'path';

class ProjectService {
  async createProject(data: CreateProjectInput): Promise<LocalProject> {
    // Start a transaction
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Create project in database
      const project = await client.query(
        'INSERT INTO "Projects" (name, status, description, budget, "predictedCosts", "actualCosts", "startDate", "endDate", "clickUpId", "folderPath") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [
          data.name,
          data.status,
          data.description,
          data.budget,
          data.predictedCosts,
          data.actualCosts,
          data.startDate,
          data.endDate,
          data.clickUpId,
          data.folderPath
        ]
      );

      let updatedProject = project;

      // Only handle file operations in development
      if (process.env.NODE_ENV !== 'production') {
        try {
          // Create project folder if it doesn't exist
          const projectFolderPath = path.join(process.cwd(), 'data', 'projects', project.rows[0].id);
          if (!fs.existsSync(projectFolderPath)) {
            fs.mkdirSync(projectFolderPath, { recursive: true });
          }

          // Create project page
          const pageContent = this.generateProjectPage(project.rows[0]);
          const pagePath = path.join(projectFolderPath, 'index.html');
          fs.writeFileSync(pagePath, pageContent);

          // Update folder path in database
          updatedProject = await client.query(
            'UPDATE "Projects" SET "folderPath" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [projectFolderPath, project.rows[0].id]
          );
        } catch (fileError) {
          console.error('File operation error:', fileError);
          // Continue without file operations in case of error
        }
      }

      await client.query('COMMIT');
      return this.mapToLocalProject(updatedProject.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getProjects(filters?: { status?: string }): Promise<LocalProject[]> {
    let query = 'SELECT * FROM "Projects"';
    const values: any[] = [];

    if (filters?.status) {
      query += ' WHERE status = $1';
      values.push(filters.status);
    }

    query += ' ORDER BY "createdAt" DESC';

    const result = await db.query(query, values);
    return result.rows.map(this.mapToLocalProject);
  }

  async getProjectById(id: string): Promise<LocalProject | null> {
    const result = await db.query('SELECT * FROM "Projects" WHERE id = $1', [id]);
    return result.rows.length ? this.mapToLocalProject(result.rows[0]) : null;
  }

  async checkProjectExists(name: string): Promise<boolean> {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM "Projects" WHERE name = $1)', [name]);
    return result.rows[0].exists;
  }

  async updateProject(id: string, data: UpdateProjectInput): Promise<LocalProject> {
    const updates: string[] = [];
    const values: any[] = [id];
    let paramCount = 2;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.budget !== undefined) {
      updates.push(`budget = $${paramCount++}`);
      values.push(data.budget);
    }
    if (data.predictedCosts !== undefined) {
      updates.push(`"predictedCosts" = $${paramCount++}`);
      values.push(data.predictedCosts);
    }
    if (data.actualCosts !== undefined) {
      updates.push(`"actualCosts" = $${paramCount++}`);
      values.push(data.actualCosts);
    }
    if (data.startDate !== undefined) {
      updates.push(`"startDate" = $${paramCount++}`);
      values.push(data.startDate);
    }
    if (data.endDate !== undefined) {
      updates.push(`"endDate" = $${paramCount++}`);
      values.push(data.endDate);
    }
    if (data.clickUpId !== undefined) {
      updates.push(`"clickUpId" = $${paramCount++}`);
      values.push(data.clickUpId);
    }
    if (data.folderPath !== undefined) {
      updates.push(`"folderPath" = $${paramCount++}`);
      values.push(data.folderPath);
    }

    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE "Projects" 
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, values);
    const updatedProject = this.mapToLocalProject(result.rows[0]);

    // Only handle file operations in development
    if (process.env.NODE_ENV !== 'production' && updatedProject.folderPath) {
      try {
        const pagePath = path.join(updatedProject.folderPath, 'index.html');
        const pageContent = this.generateProjectPage(result.rows[0]);
        fs.writeFileSync(pagePath, pageContent);
      } catch (fileError) {
        console.error('File operation error:', fileError);
        // Continue without file operations in case of error
      }
    }

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.getProjectById(id);
    if (project?.folderPath && fs.existsSync(project.folderPath)) {
      fs.rmSync(project.folderPath, { recursive: true, force: true });
    }
    await db.query('DELETE FROM "Projects" WHERE id = $1', [id]);
  }

  async linkClickUpTask(projectId: string, taskName: string): Promise<LocalProject> {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Get the project
      const projectResult = await client.query('SELECT * FROM "Projects" WHERE id = $1', [projectId]);
      if (!projectResult.rows.length) {
        throw new Error('Project not found');
      }

      // Get the ClickUp task ID from the task name
      const clickupService = (await import('./clickupService')).clickupService;
      const taskId = await clickupService.findTaskIdByName(taskName);
      if (!taskId) {
        throw new Error('ClickUp task not found');
      }

      // Link the task
      const result = await client.query(
        'UPDATE "Projects" SET "clickUpId" = $1, status = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [taskId, 'ACTIVE', projectId]
      );

      await client.query('COMMIT');
      return this.mapToLocalProject(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async unlinkClickUpTask(projectId: string): Promise<LocalProject> {
    const result = await db.query(
      'UPDATE "Projects" SET "clickUpId" = NULL, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [projectId]
    );
    return this.mapToLocalProject(result.rows[0]);
  }

  private mapToLocalProject(row: any): LocalProject {
    return {
      id: row.id,
      name: row.name,
      status: row.status,
      description: row.description,
      budget: row.budget,
      predictedCosts: row.predictedCosts,
      actualCosts: row.actualCosts,
      startDate: row.startDate,
      endDate: row.endDate,
      clickUpId: row.clickUpId,
      folderPath: row.folderPath,
      documents: row.documents || [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  private generateProjectPage(project: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name} - Project Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            border-bottom: 2px solid #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            background-color: #f0f0f0;
        }
        .details {
            margin: 20px 0;
        }
        .financial {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${project.name}</h1>
            <div class="status">${project.status}</div>
        </div>
        
        <div class="details">
            <h2>Project Details</h2>
            <p>${project.description || 'No description available.'}</p>
            
            <h3>Timeline</h3>
            <p>Start Date: ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
            <p>End Date: ${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</p>
        </div>

        <div class="financial">
            <h2>Financial Overview</h2>
            <p>Budget: $${project.budget || 0}</p>
            <p>Predicted Costs: $${project.predictedCosts || 0}</p>
            <p>Actual Costs: $${project.actualCosts || 0}</p>
        </div>

        ${project.clickUpId ? `
        <div class="integration">
            <h2>ClickUp Integration</h2>
            <p>ClickUp Task ID: ${project.clickUpId}</p>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
  }
}

export const projectService = new ProjectService();
