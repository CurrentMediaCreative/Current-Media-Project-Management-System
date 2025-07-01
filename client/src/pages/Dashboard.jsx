import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

// Import services (to be implemented)
import { fetchProjects, fetchProjectMetrics } from "../services/projectService";

// Import components (to be implemented)
import ProjectCard from "../components/Projects/ProjectCard";
import MetricsCard from "../components/Dashboard/MetricsCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

const Dashboard = () => {
  // Fetch projects data
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery("featuredProjects", () => fetchProjects({ limit: 4 }));

  // Fetch metrics data
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery("projectMetrics", fetchProjectMetrics);

  // Loading state
  if (projectsLoading || metricsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (projectsError || metricsError) {
    return (
      <ErrorMessage
        message="Failed to load dashboard data. Please try again later."
        error={projectsError || metricsError}
      />
    );
  }

  return (
    <div className="pt-16">
      <h1>Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics && (
          <>
            <MetricsCard
              title="Active Projects"
              value={metrics.activeProjects}
              icon="projects"
              color="blue"
            />
            <MetricsCard
              title="Active Revenue"
              value={`$${metrics.activeRevenue.toLocaleString()}`}
              icon="money"
              color="green"
            />
            <MetricsCard
              title="Completed Revenue"
              value={`$${metrics.completedRevenue.toLocaleString()}`}
              icon="check"
              color="purple"
            />
          </>
        )}
      </div>

      {/* Featured Projects Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Projects
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No projects found</p>
            <Link
              to="/projects"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Create a new project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
