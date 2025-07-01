import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

// Import services (to be implemented)
import { fetchProjects } from "../services/projectService";

// Import components (to be implemented)
import ProjectCard from "../components/Projects/ProjectCard";
import SearchBar from "../components/UI/SearchBar";
import FilterDropdown from "../components/UI/FilterDropdown";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";

const ProjectsList = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  // Fetch projects data
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["projects", statusFilter, sortBy],
    () => fetchProjects({ status: statusFilter, sort: sortBy }),
    {
      keepPreviousData: true,
    }
  );

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Handle sort change
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Filter projects based on search term
  const filteredProjects = projects
    ? projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Status options for filter
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
  ];

  // Sort options
  const sortOptions = [
    { value: "deadline", label: "Deadline (Closest)" },
    { value: "name", label: "Name (A-Z)" },
    { value: "budget", label: "Budget (Highest)" },
    { value: "created", label: "Recently Created" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message="Failed to load projects. Please try again later."
        error={error}
      />
    );
  }

  return (
    <div className="pt-16">
      <div className="flex justify-between items-center mb-6">
        <h1>Projects</h1>
        <button className="btn btn-primary">New Project</button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No projects found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
