const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const axios = require("axios");

// Middleware
const auth = require("../middleware/auth");

// ClickUp API integration
const clickupListId = process.env.CLICKUP_LIST_ID;
const clickupApiKey = process.env.CLICKUP_API_KEY;
const clickupApiUrl =
  process.env.CLICKUP_API_URL || "https://api.clickup.com/api/v2";

// Local storage for projects created outside of ClickUp
let localProjects = [];
let nextLocalId = 1000; // Starting ID for local projects

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    // Get query parameters
    const status = req.query.status || "all";
    const sort = req.query.sort || "deadline";
    const limit = parseInt(req.query.limit) || 0;

    // Fetch projects from ClickUp
    let clickupProjects = [];
    if (clickupListId && clickupApiKey) {
      try {
        const response = await axios.get(
          `${clickupApiUrl}/list/${clickupListId}/task`,
          {
            headers: {
              Authorization: clickupApiKey,
            },
          }
        );

        // Transform ClickUp tasks to our project format
        clickupProjects = response.data.tasks.map((task) => {
          // Determine if this is a master project or a subtask
          const isMasterProject = !task.parent;

          // Safely convert dates to ISO strings
          let createdAt = null;
          let deadline = null;

          try {
            if (task.date_created) {
              createdAt = new Date(parseInt(task.date_created)).toISOString();
            }
          } catch (e) {
            console.log(
              `Invalid date_created for task ${task.id}: ${task.date_created}`
            );
          }

          try {
            if (task.due_date && task.due_date !== 0) {
              deadline = new Date(parseInt(task.due_date)).toISOString();
            }
          } catch (e) {
            console.log(
              `Invalid due_date for task ${task.id}: ${task.due_date}`
            );
          }

          // Map ClickUp status to our local status
          let mappedStatus = "active"; // Default status
          const clickupStatus = task.status.status.toLowerCase();

          if (clickupStatus === "done") {
            mappedStatus = "completed";
          } else if (clickupStatus === "on hold") {
            mappedStatus = "on-hold";
          } else if (
            clickupStatus === "active" ||
            clickupStatus === "in review"
          ) {
            mappedStatus = "active";
          }

          // Get budget value and ensure it's a number
          let budget = null;
          const budgetField = task.custom_fields?.find(
            (field) => field.name === "Budget"
          );
          if (budgetField && budgetField.value) {
            // Remove any non-numeric characters (like currency symbols)
            const budgetValue = budgetField.value
              .toString()
              .replace(/[^0-9.]/g, "");
            budget = parseFloat(budgetValue) || 0;
          }

          return {
            id: task.id,
            name: task.name,
            description: task.description,
            status: mappedStatus,
            originalStatus: clickupStatus,
            createdAt: createdAt,
            deadline: deadline,
            budget: budget,
            client:
              task.custom_fields?.find((field) => field.name === "Client")
                ?.value || null,
            type:
              task.custom_fields?.find((field) => field.name === "Project Type")
                ?.value || null,
            manager: task.assignees?.[0]?.username || null,
            isMasterProject,
            parentId: task.parent || null,
            source: "clickup",
          };
        });

        // Filter out subtasks if needed
        if (req.query.masterOnly === "true") {
          clickupProjects = clickupProjects.filter(
            (project) => project.isMasterProject
          );
        }
      } catch (error) {
        console.error("ClickUp API error:", error);

        // Log detailed error information
        if (error.response) {
          console.error("ClickUp API response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        }

        // Continue with local projects if ClickUp fails
      }
    }

    // Combine with local projects
    let allProjects = [...clickupProjects, ...localProjects];

    // Filter by status if specified
    if (status !== "all") {
      allProjects = allProjects.filter((project) => project.status === status);
    }

    // Sort projects
    allProjects.sort((a, b) => {
      if (sort === "deadline") {
        // Handle null deadlines
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sort === "name") {
        return a.name.localeCompare(b.name);
      } else if (sort === "status") {
        return a.status.localeCompare(b.status);
      } else if (sort === "budget") {
        const aBudget = a.budget || 0;
        const bBudget = b.budget || 0;
        return bBudget - aBudget;
      } else if (sort === "created") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    // Limit results if specified
    if (limit > 0) {
      allProjects = allProjects.slice(0, limit);
    }

    // Group subtasks with their parent projects
    const projectsWithSubtasks = allProjects
      .filter((project) => project.isMasterProject)
      .map((project) => {
        const subtasks = allProjects.filter(
          (task) => task.parentId === project.id
        );
        return {
          ...project,
          subtasks: subtasks,
        };
      });

    res.json(projectsWithSubtasks);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects/metrics
 * @desc    Get project metrics (active projects, revenue, etc.)
 * @access  Private
 */
router.get("/metrics", auth, async (req, res) => {
  try {
    // Get all projects first
    let allProjects = [];

    // Fetch from ClickUp
    if (clickupListId && clickupApiKey) {
      try {
        const response = await axios.get(
          `${clickupApiUrl}/list/${clickupListId}/task`,
          {
            headers: {
              Authorization: clickupApiKey,
            },
          }
        );

        // Transform ClickUp tasks to our project format
        const clickupProjects = response.data.tasks.map((task) => {
          // Map ClickUp status to our local status
          let mappedStatus = "active"; // Default status
          const clickupStatus = task.status.status.toLowerCase();

          if (clickupStatus === "done") {
            mappedStatus = "completed";
          } else if (clickupStatus === "on hold") {
            mappedStatus = "on-hold";
          } else if (
            clickupStatus === "active" ||
            clickupStatus === "in review"
          ) {
            mappedStatus = "active";
          }

          // Get budget value and ensure it's a number
          let budget = null;
          const budgetField = task.custom_fields?.find(
            (field) => field.name === "Budget"
          );
          if (budgetField && budgetField.value) {
            // Remove any non-numeric characters (like currency symbols)
            const budgetValue = budgetField.value
              .toString()
              .replace(/[^0-9.]/g, "");
            budget = parseFloat(budgetValue) || 0;
          }

          return {
            id: task.id,
            name: task.name,
            status: mappedStatus,
            originalStatus: clickupStatus,
            budget: budget,
            isMasterProject: !task.parent,
          };
        });

        // Only include master projects
        allProjects = [
          ...clickupProjects.filter((p) => p.isMasterProject),
          ...localProjects,
        ];
      } catch (error) {
        console.error("ClickUp API error:", error);

        // Log detailed error information
        if (error.response) {
          console.error("ClickUp API response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        }

        allProjects = [...localProjects];
      }
    } else {
      allProjects = [...localProjects];
    }

    // Calculate metrics
    const activeProjects = allProjects.filter(
      (project) => project.status === "active" || project.status === "Active"
    );
    const completedProjects = allProjects.filter(
      (project) =>
        project.status === "completed" || project.status === "Completed"
    );

    // Calculate revenue
    const activeRevenue = activeProjects.reduce((total, project) => {
      const budget = project.budget ? parseFloat(project.budget) : 0;
      return total + budget;
    }, 0);
    const completedRevenue = completedProjects.reduce((total, project) => {
      const budget = project.budget ? parseFloat(project.budget) : 0;
      return total + budget;
    }, 0);

    console.log("Metrics calculation:", {
      totalProjects: allProjects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      activeRevenue,
      completedRevenue,
      allProjects: allProjects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        budget: p.budget,
      })),
    });

    res.json({
      totalProjects: allProjects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      activeRevenue,
      completedRevenue,
      totalRevenue: activeRevenue + completedRevenue,
    });
  } catch (err) {
    console.error("Error fetching project metrics:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const projectId = req.params.id;

    console.log(`Fetching project with ID: ${projectId}`);

    // Check local projects first
    const localProject = localProjects.find(
      (project) => project.id.toString() === projectId
    );

    if (localProject) {
      console.log(`Found local project: ${localProject.name}`);
      return res.json(localProject);
    }

    // If not found locally and ClickUp is configured, check there
    if (clickupApiKey) {
      try {
        console.log(
          `Fetching from ClickUp API: https://api.clickup.com/api/v2/task/${projectId}?include_subtasks=true`
        );
        const response = await axios.get(
          `https://api.clickup.com/api/v2/task/${projectId}?include_subtasks=true`,
          {
            headers: {
              Authorization: clickupApiKey,
              accept: "application/json",
            },
          }
        );

        const task = response.data;
        console.log(`Found ClickUp task: ${task.name}`);

        // Process subtasks from the response
        let subtasks = [];
        if (task.subtasks && task.subtasks.length > 0) {
          subtasks = task.subtasks.map((subtask) => {
            // Safely convert dates to ISO strings
            let createdAt = null;
            let deadline = null;

            try {
              if (subtask.date_created) {
                createdAt = new Date(
                  parseInt(subtask.date_created)
                ).toISOString();
              }
            } catch (e) {
              console.log(
                `Invalid date_created for subtask ${subtask.id}: ${subtask.date_created}`
              );
            }

            try {
              if (subtask.due_date && subtask.due_date !== 0) {
                deadline = new Date(parseInt(subtask.due_date)).toISOString();
              }
            } catch (e) {
              console.log(
                `Invalid due_date for subtask ${subtask.id}: ${subtask.due_date}`
              );
            }

            return {
              id: subtask.id,
              name: subtask.name,
              description: subtask.description,
              status: subtask.status.status.toLowerCase(),
              createdAt: createdAt,
              deadline: deadline,
              assignedTo: subtask.assignees?.[0]?.username || null,
              parentId: projectId,
              source: "clickup",
            };
          });
        }

        // Safely convert dates to ISO strings
        let createdAt = null;
        let startDate = null;
        let deadline = null;

        try {
          if (task.date_created) {
            createdAt = new Date(parseInt(task.date_created)).toISOString();
          }
        } catch (e) {
          console.log(
            `Invalid date_created for task ${task.id}: ${task.date_created}`
          );
        }

        try {
          if (task.start_date && task.start_date !== 0) {
            startDate = new Date(parseInt(task.start_date)).toISOString();
          }
        } catch (e) {
          console.log(
            `Invalid start_date for task ${task.id}: ${task.start_date}`
          );
        }

        try {
          if (task.due_date && task.due_date !== 0) {
            deadline = new Date(parseInt(task.due_date)).toISOString();
          }
        } catch (e) {
          console.log(`Invalid due_date for task ${task.id}: ${task.due_date}`);
        }

        // Map ClickUp status to our local status
        let mappedStatus = "active"; // Default status
        const clickupStatus = task.status.status.toLowerCase();

        if (clickupStatus === "done") {
          mappedStatus = "completed";
        } else if (clickupStatus === "on hold") {
          mappedStatus = "on-hold";
        } else if (
          clickupStatus === "active" ||
          clickupStatus === "in review"
        ) {
          mappedStatus = "active";
        }

        // Get budget value and ensure it's a number
        let budget = null;
        const budgetField = task.custom_fields?.find(
          (field) => field.name === "Budget"
        );
        if (budgetField && budgetField.value) {
          // Remove any non-numeric characters (like currency symbols)
          const budgetValue = budgetField.value
            .toString()
            .replace(/[^0-9.]/g, "");
          budget = parseFloat(budgetValue) || 0;
        }

        // Transform to our project format
        const project = {
          id: task.id,
          name: task.name,
          description: task.description,
          status: mappedStatus,
          originalStatus: clickupStatus,
          createdAt: createdAt,
          startDate: startDate,
          deadline: deadline,
          budget: budget,
          client:
            task.custom_fields?.find((field) => field.name === "Client")
              ?.value || null,
          type:
            task.custom_fields?.find((field) => field.name === "Project Type")
              ?.value || null,
          manager: task.assignees?.[0]?.username || null,
          notes: task.text_content || null,
          isMasterProject: !task.parent,
          parentId: task.parent || null,
          subtasks: subtasks,
          source: "clickup",
        };

        return res.json(project);
      } catch (error) {
        console.error("ClickUp API error:", error);

        // Provide more detailed error information
        const errorResponse = {
          message: "Error fetching project from ClickUp",
          details: error.message,
        };

        // If there's a response from the API, include it in the error
        if (error.response) {
          errorResponse.status = error.response.status;
          errorResponse.statusText = error.response.statusText;
          errorResponse.data = error.response.data;
          console.error("ClickUp API response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        }

        return res.status(error.response?.status || 500).json(errorResponse);
      }
    }

    // If we get here, the project wasn't found
    return res.status(404).json({ message: "Project not found" });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project (local only)
 * @access  Private
 */
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("status", "Status is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        description,
        status,
        deadline,
        budget,
        client,
        type,
        manager,
        notes,
      } = req.body;

      // Create new project
      const newProject = {
        id: nextLocalId++,
        name,
        description,
        status,
        createdAt: new Date().toISOString(),
        startDate: req.body.startDate || null,
        deadline: deadline || null,
        budget: budget || null,
        client: client || null,
        type: type || null,
        manager: manager || null,
        notes: notes || null,
        isMasterProject: true,
        subtasks: [],
        source: "local",
      };

      // Add to local projects
      localProjects.push(newProject);

      res.status(201).json(newProject);
    } catch (err) {
      console.error("Error creating project:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project (local only)
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find project index
    const projectIndex = localProjects.findIndex(
      (project) => project.id.toString() === projectId
    );

    // If project not found
    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project
    const updatedProject = {
      ...localProjects[projectIndex],
      ...req.body,
      id: localProjects[projectIndex].id, // Ensure ID doesn't change
      source: "local", // Ensure source doesn't change
    };

    localProjects[projectIndex] = updatedProject;

    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project (local only)
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find project index
    const projectIndex = localProjects.findIndex(
      (project) => project.id.toString() === projectId
    );

    // If project not found
    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove project
    localProjects.splice(projectIndex, 1);

    res.json({ message: "Project removed" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
