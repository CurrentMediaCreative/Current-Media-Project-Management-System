export interface ClickUpTask {
    id: string;
    name: string;
    status: {
        status: string;
        color: string;
        type: string;
    };
    date_created: string;
    date_updated: string;
    date_closed: string | null;
    date_done: string | null;
    due_date: string | null;
    start_date: string | null;
    custom_fields: Array<{
        id: string;
        name: string;
        type: string;
        type_config: {
            precision?: number;
            currency_type?: string;
            options?: Array<{
                id: string;
                name?: string;
                label?: string;
                color?: string;
                orderindex?: number;
            }>;
        };
        date_created: string;
        hide_from_guests: boolean;
        value?: string | number | string[] | null;
        required: boolean;
    }>;
    url: string;
}
export interface ClickUpSpace {
    id: string;
    name: string;
    statuses: {
        id: string;
        status: string;
        type: string;
        orderindex: number;
        color: string;
    }[];
}
export interface ClickUpList {
    id: string;
    name: string;
    task_count: number;
    space: {
        id: string;
        name: string;
    };
}
export interface ClickUpCustomField {
    id: string;
    name: string;
    type: 'currency' | 'drop_down' | 'labels' | 'date' | 'short_text' | 'url' | 'checkbox';
    type_config: {
        precision?: number;
        currency_type?: string;
        options?: {
            id: string;
            name?: string;
            label?: string;
            color?: string;
            orderindex?: number;
        }[];
    };
    required: boolean;
}
export interface MappedProject {
    id: string;
    name: string;
    status: string;
    statusColor: string;
    client: string | null;
    taskType: string | null;
    invoiceStatus: string | null;
    invoiceNumber: string | null;
    clickUpUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CLICKUP_FIELD_MAPPING: {
    readonly CLIENT: "fdab03c4-bf5a-4269-a957-faa9bd58b4fb";
    readonly TASK_TYPE: "047652d9-831f-4da0-9112-c9f5286df5c3";
    readonly INVOICE_STATUS: "67b16232-45cc-43bc-98dd-693d32f9c2f1";
    readonly INVOICE_NUMBER: "08cd5c39-b63b-4038-82f7-44d6bfde8365";
};
//# sourceMappingURL=clickup.d.ts.map