import { useState } from "react";

const SubtasksList = ({ subtasks }) => {
  const [expandedSubtask, setExpandedSubtask] = useState(null);

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

  // Toggle expanded subtask
  const toggleSubtask = (id) => {
    if (expandedSubtask === id) {
      setExpandedSubtask(null);
    } else {
      setExpandedSubtask(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Subtasks ({subtasks.length})
        </h3>
        <button className="btn btn-primary text-sm">Add Subtask</button>
      </div>

      {subtasks.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No subtasks found for this project.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Subtask Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSubtask(subtask.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          expandedSubtask === subtask.id ? "rotate-90" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {subtask.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[subtask.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subtask.status}
                        </span>
                        {subtask.deadline && (
                          <span className="ml-2 text-xs text-gray-500">
                            Due {formatDate(subtask.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSubtask === subtask.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                  {subtask.description && (
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-500 mb-1">
                        Description
                      </h5>
                      <p className="text-sm text-gray-900">
                        {subtask.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 mb-1">
                        Assigned To
                      </h5>
                      <p className="text-sm text-gray-900">
                        {subtask.assignedTo || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 mb-1">
                        Created On
                      </h5>
                      <p className="text-sm text-gray-900">
                        {formatDate(subtask.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubtasksList;
