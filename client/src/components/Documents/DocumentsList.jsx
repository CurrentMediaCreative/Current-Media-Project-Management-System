import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const DocumentsList = ({ documents, projectId }) => {
  const [expandedDocument, setExpandedDocument] = useState(null);
  const navigate = useNavigate();

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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    const iconMap = {
      pdf: (
        <svg
          className="w-8 h-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      doc: (
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      image: (
        <svg
          className="w-8 h-8 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    };

    return (
      iconMap[fileType] || (
        <svg
          className="w-8 h-8 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          ></path>
        </svg>
      )
    );
  };

  // Toggle expanded document
  const toggleDocument = (id) => {
    if (expandedDocument === id) {
      setExpandedDocument(null);
    } else {
      setExpandedDocument(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Documents ({documents.length})
        </h3>
        <Link
          to={`/projects/${projectId}/documents/new`}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Document
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500">No documents found for this project.</p>
          <Link
            to={`/projects/${projectId}/documents/new`}
            className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
          >
            Create a document
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Document Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDocument(document.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
                    </h4>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{formatFileSize(document.size)}</span>
                      <span className="mx-1">•</span>
                      <span>Uploaded {formatDate(document.createdAt)}</span>
                      {document.uploadedBy && (
                        <>
                          <span className="mx-1">•</span>
                          <span>by {document.uploadedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedDocument === document.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                  {document.description && (
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-500 mb-1">
                        Description
                      </h5>
                      <p className="text-sm text-gray-900">
                        {document.description}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button className="btn btn-secondary text-xs">
                      Replace
                    </button>
                    <button className="btn btn-primary text-xs">
                      Download
                    </button>
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

export default DocumentsList;
