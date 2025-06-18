/**
 * Create a new project
 * @route POST /api/projects
 */
export declare const createProject: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Get all projects
 * @route GET /api/projects
 */
export declare const getProjects: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
export declare const getProjectById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Update project
 * @route PUT /api/projects/:id
 */
export declare const updateProject: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
export declare const deleteProject: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
