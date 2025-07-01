import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

// Import services (to be implemented)
import { fetchProjectById } from "../services/projectService";
import { fetchDocumentsByProject } from "../services/documentService";

// Import components (to be implemented)
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import ProjectHeader from "../components/Projects/ProjectHeader";
import ProjectInfo from "../components/Projects/ProjectInfo";
import SubtasksList from "../components/Projects/SubtasksList";
import DocumentsList from "../components/Documents/DocumentsList";
import TabNavigation from "../components/UI/TabNavigation";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery(["project", projectId], () => fetchProjectById(projectId));

  // Fetch project documents
  const {
    data: documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useQuery(
    ["projectDocuments", projectId],
    () => fetchDocumentsByProject(projectId),
    {
      enabled: !!projectId,
    }
  );

  // Loading state
  if (projectLoading || documentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (projectError || documentsError) {
    return (
      <ErrorMessage
        message="Failed to load project details. Please try again later."
        error={projectError || documentsError}
      />
    );
  }

  // If project not found
  if (!project) {
    return (
      <div className="pt-16">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-4">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="btn btn-primary"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Tab configuration
  const tabs = [
    { id: "details", label: "Project Details" },
    { id: "subtasks", label: "Subtasks", count: project.subtasks?.length || 0 },
    {
      id: "documents",
      label: "Documents",
      count: documents?.length || 0,
    },
  ];

  return (
    <div className="pt-16">
      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === "details" && <ProjectInfo project={project} />}

        {activeTab === "subtasks" && (
          <SubtasksList subtasks={project.subtasks || []} />
        )}

        {activeTab === "documents" && (
          <DocumentsList documents={documents || []} projectId={projectId} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
