export interface LocalProject {
  id: string;
  name: string;
  status: string;
  description?: string;
  budget?: number;
  predictedCosts?: number;
  actualCosts?: number;
  startDate?: Date;
  endDate?: Date;
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  status: string;
  description?: string;
  budget?: number;
  predictedCosts?: number;
  actualCosts?: number;
  startDate?: Date;
  endDate?: Date;
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  status?: string;
  description?: string;
  budget?: number;
  predictedCosts?: number;
  actualCosts?: number;
  startDate?: Date;
  endDate?: Date;
  clickUpId?: string;
  folderPath?: string;
  documents?: string[];
}

export interface ProjectFilters {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: {
    min?: number;
    max?: number;
  };
}

export interface ProjectStats {
  totalProjects: number;
  projectsByStatus: Record<string, number>;
  totalBudget: number;
  totalPredictedCosts: number;
  totalActualCosts: number;
  averageProjectDuration: number;
  completionRate: number;
}
