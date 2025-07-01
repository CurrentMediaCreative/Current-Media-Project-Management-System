import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "react-query";

// Import services
import { fetchProjectById } from "../services/projectService";
import { createDocument } from "../services/documentService";

// Import components
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import ProjectOverviewForm from "../components/Documents/ProjectOverviewForm";
import BudgetBreakdownForm from "../components/Documents/BudgetBreakdownForm";
import ProductionBreakdownForm from "../components/Documents/ProductionBreakdownForm";

const NewDocument = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const [documentType, setDocumentType] = useState(
    location.state?.documentType || "project-overview"
  );
  const [emailMode, setEmailMode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Fetch project data if projectId is provided
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery(["project", projectId], () => fetchProjectById(projectId), {
    enabled: !!projectId,
  });

  // Handle document type selection
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (documentData) => {
    try {
      if (projectId) {
        // If projectId exists, create document and attach to project
        const newDocument = await createDocument({
          ...documentData,
          projectId,
        });
        navigate(`/projects/${projectId}?tab=documents`);
        return newDocument;
      } else if (emailMode) {
        // If in email mode, prepare email with document data
        // This would typically send an email with the document data
        // For now, we'll just simulate this
        console.log("Sending email with document data:", documentData);
        setEmailSent(true);
        return documentData;
      } else {
        // If no projectId and not in email mode, save document locally
        const newDocument = await createDocument(documentData);
        // Redirect to documents list or another appropriate page
        navigate("/documents");
        return newDocument;
      }
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (projectId) {
      navigate(`/projects/${projectId}?tab=documents`);
    } else {
      navigate("/projects");
    }
  };

  // Toggle email mode
  const toggleEmailMode = () => {
    setEmailMode(!emailMode);
    setEmailSent(false);
  };

  // If project is loading
  if (projectId && projectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // If there's an error loading the project
  if (projectId && projectError) {
    return (
      <ErrorMessage
        message="Failed to load project details. Please try again later."
        error={projectError}
      />
    );
  }

  // If email was sent successfully
  if (emailSent) {
    return (
      <div className="pt-16">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-green-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Document Sent Successfully</h2>
          <p className="text-gray-500 mb-4">
            The document information has been sent via email. The project will
            be created in ClickUp based on this information.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Projects
            </button>
            <button
              onClick={() => {
                setEmailSent(false);
                setDocumentType("project-overview");
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Another Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {projectId
            ? `Add Document to ${project?.name || "Project"}`
            : "Create New Document"}
        </h1>
        {!projectId && (
          <button
            onClick={toggleEmailMode}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              emailMode
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-gray-300 text-gray-700 bg-white"
            } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {emailMode ? "Creating for Email" : "Create for Email"}
          </button>
        )}
      </div>

      {/* Document Type Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <label
            htmlFor="documentType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Type
          </label>
          <select
            id="documentType"
            name="documentType"
            value={documentType}
            onChange={handleDocumentTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="project-overview">Project Overview</option>
            <option value="budget-breakdown">Budget Breakdown</option>
            <option value="production-breakdown">Production Breakdown</option>
          </select>
        </div>
      </div>

      {/* Document Form */}
      {documentType === "project-overview" && (
        <ProjectOverviewForm
          initialData={project ? { title: project.name } : {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {documentType === "budget-breakdown" && (
        <BudgetBreakdownForm
          initialData={project ? { title: `${project.name} Budget` } : {}}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {documentType === "production-breakdown" && (
        <ProductionBreakdownForm
          initialData={
            project ? { title: `${project.name} Production Plan` } : {}
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default NewDocument;
