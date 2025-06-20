import { ProjectPageData } from '../types/project';

export function getClientName(project: ProjectPageData): string {
  if (project.local?.client) {
    return project.local.client;
  }
  
  if (project.clickUp?.customFields) {
    const clientField = project.clickUp.customFields['client'];
    if (typeof clientField === 'string') {
      return clientField;
    }
  }
  
  return 'Unknown Client';
}
