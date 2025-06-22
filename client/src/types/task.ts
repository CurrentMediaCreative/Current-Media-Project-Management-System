/**
 * Simplified task type for client-side display
 * Contains only the fields we need to show in the UI
 */
export interface TaskDetails {
  id: string;
  name: string;
  status: {
    label: string;
    color: string;
  };
  dateCreated: string;
  dateUpdated: string;
  url?: string;
  customFields: Array<{
    id: string;
    name: string;
    value: string | number | null;
  }>;
}
