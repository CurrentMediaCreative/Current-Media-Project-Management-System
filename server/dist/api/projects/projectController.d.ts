import { Request, Response } from 'express';
/**
 * Create a new project
 * @route POST /api/projects
 */
export declare const createProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get all projects
 * @route GET /api/projects
 */
export declare const getProjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
export declare const getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update project
 * @route PUT /api/projects/:id
 */
export declare const updateProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
export declare const deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
