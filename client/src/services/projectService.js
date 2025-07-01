import api from "./authService";

/**
 * Fetch projects with optional filters
 * @param {Object} options - Filter options
 * @param {string} options.status - Filter by status
 * @param {string} options.sort - Sort by field
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} - Promise with projects array
 */
export const fetchProjects = async (options = {}) => {
  try {
    const { status = "all", sort = "deadline", limit } = options;

    // Build query parameters
    const params = new URLSearchParams();
    if (status !== "all") params.append("status", status);
    if (sort) params.append("sort", sort);
    if (limit) params.append("limit", limit);

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Fetch a project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Promise with project data
 */
export const fetchProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Fetch project metrics (active projects, revenue, etc.)
 * @returns {Promise<Object>} - Promise with metrics data
 */
export const fetchProjectMetrics = async () => {
  try {
    const response = await api.get("/projects/metrics");
    return response.data;
  } catch (error) {
    console.error("Error fetching project metrics:", error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} - Promise with created project
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Update a project
 * @param {string} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} - Promise with updated project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project ID
 * @returns {Promise<void>} - Promise that resolves when project is deleted
 */
export const deleteProject = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};
