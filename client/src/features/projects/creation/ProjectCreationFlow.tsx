import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper, 
  Typography,
  Alert,
  CircularProgress} from '@mui/material';
import { projectService } from '../../../services/projectService';
import { 
  ProjectScope,
  ProjectStatus
} from '../../../shared/types';
import {
  ProjectFormData,
  Budget,
  BudgetScenario,
  ContractorAssignment,
  ProjectCreationStep
} from './types';
import {
  InitialProjectInfo,
  ScopeDefinition,
  SmartBudgetSystem,
  ContractorManagement,
  ProductionOverview,
  PROJECT_CREATION_STEPS
} from './';

const initialFormData: ProjectFormData = {
  title: '',
  client: '',
  timeframe: {
    startDate: '',
    endDate: ''
  },
  budget: {
    estimated: 0,
    actual: 0,
    profitTarget: 20,
    contingencyPercentage: 10
  },
  contractors: [],
  selectedScenario: undefined
};

const STORAGE_KEY = 'project_creation_state';

const ProjectCreationFlow: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialFormData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNext = async () => {
    if (validateStep()) {
      const currentStep = PROJECT_CREATION_STEPS[activeStep].id;
      
      // Save progress for initial-info and scope-definition steps
      if (currentStep === 'initial-info' || currentStep === 'scope-definition') {
        setLoading(true);
        try {
          // Save progress to backend
          // Generate a temporary ID for saving progress
          const tempId = 'temp_' + Date.now();
          await projectService.saveProgress(tempId, formData);
          // Show success message
          setSuccessMessage('Progress saved successfully');
          setApiError(null);
        } catch (error) {
          setApiError(error instanceof Error ? error.message : 'Failed to save progress');
          console.error('Error saving progress:', error);
          return; // Don't proceed if save failed
        } finally {
          setLoading(false);
        }
      }
      
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (): boolean => {
    const currentStep = PROJECT_CREATION_STEPS[activeStep].id;
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'initial-info':
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.client) newErrors.client = 'Client is required';
        if (!formData.timeframe.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.timeframe.endDate) newErrors.endDate = 'End date is required';
        break;
      case 'scope-definition':
        if (!formData.scope?.requirements?.length) newErrors.requirements = 'At least one requirement is needed';
        if (!formData.scope?.deliverables?.length) newErrors.deliverables = 'At least one deliverable is needed';
        break;
      case 'budget-system':
        if (formData.budget.estimated <= 0) newErrors.estimated = 'Estimated budget must be greater than 0';
        if (!formData.selectedScenario) newErrors.scenario = 'A budget scenario must be selected';
        break;
      case 'contractor-management':
        if (formData.contractors.length === 0) newErrors.contractors = 'At least one contractor is required';
        break;
      case 'production-overview':
        // Comprehensive validation before final submission
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.client) newErrors.client = 'Client is required';
        if (!formData.timeframe.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.timeframe.endDate) newErrors.endDate = 'End date is required';
        if (!formData.scope?.requirements?.length) newErrors.requirements = 'At least one requirement is needed';
        if (!formData.scope?.deliverables?.length) newErrors.deliverables = 'At least one deliverable is needed';
        if (formData.budget.estimated <= 0) newErrors.estimated = 'Estimated budget must be greater than 0';
        if (!formData.selectedScenario) newErrors.scenario = 'A budget scenario must be selected';
        if (formData.contractors.length === 0) newErrors.contractors = 'At least one contractor is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormUpdate = (stepData: Partial<ProjectFormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...stepData
    }));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async () => {
    if (validateStep()) {
      setLoading(true);
      setApiError(null);
      try {
        const projectData = {
          ...formData,
          status: ProjectStatus.NEW_NOT_SENT
        };
        const newProject = await projectService.createProject(projectData);
        localStorage.removeItem(STORAGE_KEY);
        navigate(`/projects/${newProject.id}`, { 
          state: { 
            message: 'Project created successfully',
            severity: 'success'
          }
        });
      } catch (error) {
        setApiError(error instanceof Error ? error.message : 'Failed to create project');
        console.error('Error creating project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Mapping functions for each step's data
  const mapScopeToFormData = (scope: ProjectScope): Partial<ProjectFormData> => ({
    scope: {
      requirements: scope.requirements,
      deliverables: scope.deliverables,
      technicalRequirements: scope.technicalRequirements,
      additionalNotes: scope.additionalNotes
    }
  });

  const mapBudgetToFormData = (budgetData: { 
    selectedScenario: BudgetScenario; 
    profitTarget: number; 
    contingencyPercentage: number; 
  }): Partial<ProjectFormData> => ({
    selectedScenario: budgetData.selectedScenario,
    budget: {
      estimated: budgetData.selectedScenario.totalCost,
      actual: formData.budget.actual,
      profitTarget: budgetData.profitTarget,
      contingencyPercentage: budgetData.contingencyPercentage
    }
  });

  const mapContractorsToFormData = (assignments: ContractorAssignment[]): Partial<ProjectFormData> => ({
    contractors: assignments
      .filter(assignment => assignment.status === 'confirmed')
      .map(assignment => ({
        ...assignment.contractor,
        role: assignment.role,
        baseRate: assignment.baseRate,
        chargeOutRate: assignment.chargeOutRate,
        isFixed: assignment.isFixed
      }))
  });

  const renderStepContent = (step: ProjectCreationStep) => {
    const commonProps = {
      errors,
      loading,
      onNext: handleNext,
      onBack: handleBack
    };

    const handleStepUpdate = (stepData: Partial<ProjectFormData>, shouldAdvance = true) => {
      handleFormUpdate(stepData);
      if (shouldAdvance && validateStep()) {
        handleNext();
      }
    };

    switch (step) {
      case 'initial-info':
        return (
          <InitialProjectInfo
            {...commonProps}
            onSave={handleStepUpdate}
            initialData={formData}
          />
        );
      case 'scope-definition':
        return (
          <ScopeDefinition
            {...commonProps}
            onSave={(scope) => handleStepUpdate(mapScopeToFormData(scope))}
            initialData={formData.scope}
          />
        );
      case 'budget-system':
        return (
          <SmartBudgetSystem
            {...commonProps}
            onComplete={(budgetData) => handleStepUpdate(mapBudgetToFormData(budgetData))}
            initialData={{
              estimatedBudget: formData.budget.estimated,
              timeframe: formData.timeframe,
              selectedScenario: formData.selectedScenario
            }}
          />
        );
      case 'contractor-management':
        return (
          <ContractorManagement
            {...commonProps}
            onComplete={(assignments) => handleStepUpdate(mapContractorsToFormData(assignments))}
            initialData={{
              contractors: formData.contractors,
              budget: formData.budget
            }}
          />
        );
      case 'production-overview':
        return (
          <ProductionOverview
            {...commonProps}
            onComplete={() => {
              if (validateStep()) {
                handleSubmit();
              }
            }}
            projectData={formData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Project
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {PROJECT_CREATION_STEPS.map((step, index) => (
            <Step key={step.id} completed={index < activeStep}>
              <StepLabel error={Object.keys(errors).length > 0 && index === activeStep}>
                <Typography variant="body2">{step.label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {renderStepContent(PROJECT_CREATION_STEPS[activeStep].id)}
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                if (window.confirm('Are you sure you want to save your progress and exit? You can continue later.')) {
                  navigate('/projects');
                }
              }}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Save & Exit
            </Button>
            
          <Button
            variant="contained"
            onClick={activeStep === PROJECT_CREATION_STEPS.length - 1 ? handleSubmit : handleNext}
            disabled={loading || Object.keys(errors).length > 0}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {activeStep === PROJECT_CREATION_STEPS.length - 1 ? 'Create Project' : 
             (PROJECT_CREATION_STEPS[activeStep].id === 'initial-info' || 
              PROJECT_CREATION_STEPS[activeStep].id === 'scope-definition') ? 
              'Save & Continue' : 'Next'}
          </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProjectCreationFlow;
