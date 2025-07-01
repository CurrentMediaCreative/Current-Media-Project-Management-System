import { Link } from "react-router-dom";

const ProjectHeader = ({ project }) => {
  // Status badge color mapping
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    "on-hold": "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <Link
              to="/projects"
              className="mr-2 text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          </div>
          <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[project.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status}
            </span>
            <span className="mx-2">•</span>
            <span>Created on {formatDate(project.createdAt)}</span>
            {project.deadline && (
              <>
                <span className="mx-2">•</span>
                <span>Due {formatDate(project.deadline)}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="btn btn-secondary">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
            Edit
          </button>
          <button className="btn btn-primary">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                clipRule="evenodd"
              ></path>
            </svg>
            Add Document
          </button>
        </div>
      </div>

      {project.description && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-sm text-gray-900">{project.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
