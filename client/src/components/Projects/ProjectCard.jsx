import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
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

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Days remaining component
  const DaysRemaining = ({ deadline }) => {
    const days = getDaysRemaining(deadline);

    if (days === null) return null;

    let textColor = "text-gray-600";
    if (days < 0) textColor = "text-red-600";
    else if (days <= 7) textColor = "text-yellow-600";

    return (
      <div className={`text-sm font-medium ${textColor}`}>
        {days < 0
          ? `${Math.abs(days)} days overdue`
          : days === 0
          ? "Due today"
          : `${days} days remaining`}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {project.name}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[project.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {project.description || "No description provided"}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium">
              {project.budget
                ? `$${project.budget.toLocaleString()}`
                : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="text-sm font-medium">
              {formatDate(project.deadline)}
            </p>
          </div>
        </div>

        {project.deadline && (
          <div className="mt-3">
            <DaysRemaining deadline={project.deadline} />
          </div>
        )}

        {project.subtasks && project.subtasks.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">Subtasks</p>
            <p className="text-sm font-medium">{project.subtasks.length}</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <Link
          to={`/projects/${project.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
