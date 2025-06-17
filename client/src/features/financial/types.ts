import { Project, Contractor } from '../../../../shared/src/types';

export interface BudgetVariance {
  estimated: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: string;
  estimated: number;
  actual: number;
  variance: number;
}

export interface TeamPerformanceMetric {
  contractor: Contractor;
  projectsCompleted: number;
  onTimeDelivery: number;
  averageBudgetVariance: number;
  clientSatisfaction: number;
}

export interface ProjectAnalytics {
  project: Project;
  budgetVariance: BudgetVariance;
  categoryBreakdown: CategoryBreakdown[];
  timeline: {
    plannedDuration: number;
    actualDuration: number;
    variance: number;
  };
  team: TeamPerformanceMetric[];
}

export interface ProfitTrend {
  producer: string;
  projects: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  trend: {
    month: string;
    profit: number;
  }[];
}

export interface AnalyticsData {
  projects: ProjectAnalytics[];
  teamPerformance: TeamPerformanceMetric[];
  profitTrends: ProfitTrend[];
  recommendations: {
    type: 'process' | 'resource' | 'risk' | 'growth';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}
