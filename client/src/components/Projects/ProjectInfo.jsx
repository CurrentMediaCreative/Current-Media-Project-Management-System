const ProjectInfo = ({ project }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "Not set";
    return `$${amount.toLocaleString()}`;
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

    if (days === null) return "No deadline set";

    let textColor = "text-gray-600";
    if (days < 0) textColor = "text-red-600";
    else if (days <= 7) textColor = "text-yellow-600";

    return (
      <span className={textColor}>
        {days < 0
          ? `${Math.abs(days)} days overdue`
          : days === 0
          ? "Due today"
          : `${days} days remaining`}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Project Details
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Client</h4>
              <p className="mt-1 text-sm text-gray-900">
                {project.client || "Not specified"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Budget</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatCurrency(project.budget)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Project Type
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {project.type || "Not specified"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Project Manager
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {project.manager || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Created Date
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(project.createdAt)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(project.startDate)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(project.deadline)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="mt-1 text-sm text-gray-900">
                {project.deadline && (
                  <DaysRemaining deadline={project.deadline} />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {project.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-900 whitespace-pre-line">
              {project.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInfo;
