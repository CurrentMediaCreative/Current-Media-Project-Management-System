import { useState } from "react";

const ErrorMessage = ({ message, error }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>

          {error && (
            <div className="mt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-red-700 underline"
              >
                {showDetails ? "Hide details" : "Show details"}
              </button>

              {showDetails && (
                <div className="mt-2 text-sm text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-40">
                  <pre>{error.toString()}</pre>
                  {error.response && (
                    <pre>{JSON.stringify(error.response.data, null, 2)}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
