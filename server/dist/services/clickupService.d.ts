declare class ClickUpService {
    private api;
    constructor();
    /**
     * Get all accessible workspaces
     */
    getWorkspaces(): Promise<any>;
    /**
     * Get all spaces in a workspace
     */
    getSpaces(workspaceId: string): Promise<any>;
    /**
     * Get all lists in a space
     */
    getLists(spaceId: string): Promise<any>;
    /**
     * Get all tasks in a list
     */
    getTasks(listId: string): Promise<import("../../../shared/src/types/clickup").MappedProject[]>;
    /**
     * Get detailed task information
     */
    getTask(taskId: string): Promise<import("../../../shared/src/types/clickup").MappedProject>;
    /**
     * Get custom fields for a list
     */
    getCustomFields(listId: string): Promise<any>;
    /**
     * Get all views in a space
     */
    getViews(spaceId: string): Promise<any>;
}
export declare const clickupService: ClickUpService;
export default clickupService;
