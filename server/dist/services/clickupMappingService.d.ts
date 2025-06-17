import { ClickUpTask, MappedProject } from '../../../shared/src/types/clickup';
export declare class ClickUpMappingService {
    static mapTaskToProject(task: ClickUpTask): MappedProject;
    private static extractCustomFieldValue;
}
declare const _default: ClickUpMappingService;
export default _default;
