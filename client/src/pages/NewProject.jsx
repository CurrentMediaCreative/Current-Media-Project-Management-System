import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/Projects/ProjectForm";

const NewProject = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <div className="pt-16">
      <div className="flex justify-between items-center mb-6">
        <h1>Create New Project</h1>
      </div>
      <ProjectForm onCancel={handleCancel} />
    </div>
  );
};

export default NewProject;
