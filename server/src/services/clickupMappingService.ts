import { ClickUpTask, CLICKUP_FIELD_MAPPING, MappedProject } from '../../../shared/src/types/clickup';

export class ClickUpMappingService {
  static mapTaskToProject(task: ClickUpTask): MappedProject {
    return {
      id: task.id || '',
      name: task.name || '',
      status: task.status?.status || '',
      statusColor: task.status?.color || '',
      client: this.extractCustomFieldValue(task, 'CLIENT'),
      taskType: this.extractCustomFieldValue(task, 'TASK_TYPE'),
      invoiceStatus: this.extractCustomFieldValue(task, 'INVOICE_STATUS'),
      invoiceNumber: this.extractCustomFieldValue(task, 'INVOICE_NUMBER'),
      createdAt: task.date_created ? new Date(parseInt(task.date_created)) : new Date(),
      updatedAt: task.date_updated ? new Date(parseInt(task.date_updated)) : new Date(),
      clickUpUrl: task.url || ''
    };
  }

  private static extractCustomFieldValue(task: ClickUpTask, fieldKey: keyof typeof CLICKUP_FIELD_MAPPING): string | null {
    const fieldId = CLICKUP_FIELD_MAPPING[fieldKey];
    if (!task.custom_fields) return null;
    
    const field = task.custom_fields.find((f: any) => f.id === fieldId);
    if (!field || field.value === undefined || field.value === null) return null;

    console.log(`Extracting ${fieldKey}:`, {
      fieldId,
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
          const optionByOrderIndex = field.type_config.options.find(opt => opt.orderindex === field.value);
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
      case 'currency':
        const stringValue = typeof field.value === 'string' ? field.value : String(field.value);
        console.log(`Extracted string value:`, stringValue);
        return stringValue;
      default:
        const defaultValue = String(field.value);
        console.log(`Extracted default value:`, defaultValue);
        return defaultValue;
    }
  }
}

export default new ClickUpMappingService();
