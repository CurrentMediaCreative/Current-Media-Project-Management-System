"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickupService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const clickupMappingService_1 = require("./clickupMappingService");
dotenv_1.default.config();
const CLICKUP_API_TOKEN = 'pk_120182095_6E7D5HG4B6EEB62Z50KZI1BHGO4G1NSS';
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';
class ClickUpService {
    constructor() {
        this.api = axios_1.default.create({
            baseURL: CLICKUP_API_URL,
            headers: {
                'Authorization': CLICKUP_API_TOKEN,
                'Content-Type': 'application/json'
            }
        });
    }
    /**
     * Get all accessible workspaces
     */
    async getWorkspaces() {
        try {
            const response = await this.api.get('/team');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching ClickUp workspaces:', error);
            throw error;
        }
    }
    /**
     * Get all spaces in a workspace
     */
    async getSpaces(workspaceId) {
        try {
            const response = await this.api.get(`/team/${workspaceId}/space`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching ClickUp spaces:', error);
            throw error;
        }
    }
    /**
     * Get all lists in a space
     */
    async getLists(spaceId) {
        try {
            const response = await this.api.get(`/space/${spaceId}/list`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching ClickUp lists:', error);
            throw error;
        }
    }
    /**
     * Get all tasks in a list
     */
    async getTasks(listId) {
        try {
            const response = await this.api.get(`/list/${listId}/task`);
            if (!response.data || !response.data.tasks || !Array.isArray(response.data.tasks)) {
                throw new Error('Invalid response format from ClickUp API');
            }
            const tasks = response.data.tasks;
            // Log the first task for debugging
            if (tasks.length > 0) {
                console.log('Raw task data:', JSON.stringify(tasks[0], null, 2));
            }
            return tasks.map(task => clickupMappingService_1.ClickUpMappingService.mapTaskToProject(task));
        }
        catch (error) {
            console.error('Error fetching ClickUp tasks:', error);
            throw error;
        }
    }
    /**
     * Get detailed task information
     */
    async getTask(taskId) {
        try {
            const response = await this.api.get(`/task/${taskId}`);
            const task = response.data;
            return clickupMappingService_1.ClickUpMappingService.mapTaskToProject(task);
        }
        catch (error) {
            console.error('Error fetching ClickUp task:', error);
            throw error;
        }
    }
    /**
     * Get custom fields for a list
     */
    async getCustomFields(listId) {
        try {
            const response = await this.api.get(`/list/${listId}/field`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching ClickUp custom fields:', error);
            throw error;
        }
    }
    /**
     * Get all views in a space
     */
    async getViews(spaceId) {
        try {
            const response = await this.api.get(`/space/${spaceId}/view`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching ClickUp views:', error);
            throw error;
        }
    }
}
exports.clickupService = new ClickUpService();
exports.default = exports.clickupService;
//# sourceMappingURL=clickupService.js.map