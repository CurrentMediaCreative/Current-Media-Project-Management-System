import { 
  ClickUpTask, 
  ClickUpCustomField,
  ClickUpCustomFieldOption 
} from '../types/clickup';
import { ProjectStatus, CombinedProject } from '@shared/types';
import { CLICKUP_FIELD_NAMES } from '@shared/utils/projectHelpers';

// Alias CombinedProject as MappedProject for backward compatibility
type MappedProject = CombinedProject;

export class ClickUpMappingService {
  static mapTaskToProject(task: ClickUpTask): MappedProject {
    // Map ClickUp status to our system status
    const mapStatus = (status: string): ProjectStatus => {
      const lowerStatus = status.toLowerCase();
      
      // Active statuses
      if (['to do', 'media needed', 'in progress', 'revision'].includes(lowerStatus)) {
        return ProjectStatus.ACTIVE;
      }
      
      // Completed status
      if (lowerStatus === 'done') {
        return ProjectStatus.COMPLETED;
      }

      // For local statuses, validate and return if they match our ProjectStatus type
      if (status === ProjectStatus.NEW_NOT_SENT) {
        return ProjectStatus.NEW_NOT_SENT;
      }
      if (status === ProjectStatus.NEW_SENT) {
        return ProjectStatus.NEW_SENT;
      }
      if (status === ProjectStatus.ARCHIVED) {
        return ProjectStatus.ARCHIVED;
      }

      // Default to ACTIVE if we don't recognize the status
      return ProjectStatus.ACTIVE;
    };

    // Map all custom fields
    const customFields: { [key: string]: string | number | null } = {};
    if (task.custom_fields) {
      task.custom_fields.forEach(field => {
        const fieldValue = this.extractCustomFieldValue(field);
        if (fieldValue !== null) {
          customFields[field.name] = fieldValue;
        }
      });
    }

    // Extract client name from custom fields
    const clientName = customFields[CLICKUP_FIELD_NAMES.CLIENT] as string || 'No Client';

    // Get status information
    const rawStatus = task.status?.status || '';
    const mappedStatus = mapStatus(rawStatus);
    console.log('Raw ClickUp status:', rawStatus);
    console.log('Mapped status:', mappedStatus);

    // Create the combined project
    return {
      id: task.id || '',
      title: task.name || '',
      client: clientName,
      status: mappedStatus,
      timeframe: {
        startDate: new Date().toISOString(), // TODO: Map from ClickUp dates
        endDate: new Date().toISOString()    // TODO: Map from ClickUp dates
      },
      budget: {
        estimated: 0, // TODO: Map from ClickUp custom fields
        actual: 0     // TODO: Map from ClickUp custom fields
      },
      contractors: [], // TODO: Map from ClickUp assignees
      metadata: {
        category: customFields[CLICKUP_FIELD_NAMES.TASK_TYPE] as string || undefined,
        notes: ''
      },
      createdAt: task.date_created ? new Date(parseInt(task.date_created)) : new Date(),
      updatedAt: task.date_updated ? new Date(parseInt(task.date_updated)) : new Date(),
      clickUp: {
        id: task.id || '',
        name: task.name || '',
        status: rawStatus,  // Store original ClickUp status
        statusColor: task.status?.color || '',
        url: task.url || '',
        customFields
      }
    };
  }

  private static extractCustomFieldValue(field: ClickUpCustomField): string | number | null {
    if (field.value === undefined || field.value === null) return null;

    console.log(`Extracting ${field.name}:`, {
      fieldType: field.type,
      fieldValue: field.value,
      options: field.type_config.options
    });

    // Handle different field types
    switch (field.type) {
      case 'drop_down':
        if (field.type_config.options && typeof field.value === 'number') {
          // For dropdown fields, try direct array index first
          const optionByIndex = field.type_config.options[field.value];
          if (optionByIndex) {
            console.log(`Found option by index:`, optionByIndex);
            return optionByIndex.name || null;
          }
          // If no match by index, try finding by orderindex
          const optionByOrderIndex = field.type_config.options.find((opt: ClickUpCustomFieldOption) => opt.orderindex === field.value);
          if (optionByOrderIndex) {
            console.log(`Found option by orderindex:`, optionByOrderIndex);
            return optionByOrderIndex.name || null;
          }
          console.log(`No matching option found for value:`, field.value);
        }
        return null;
      case 'short_text':
      case 'text':
      case 'url':
        return String(field.value);
      case 'currency':
        return typeof field.value === 'number' ? field.value : parseFloat(String(field.value));
      default:
        return String(field.value);
    }
  }
}

export default new ClickUpMappingService();
