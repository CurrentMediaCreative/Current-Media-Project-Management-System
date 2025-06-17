import { PrismaClient, ProjectStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface Timeframe {
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
}

export interface Budget {
  estimated: number;
  actual: number;
}

export interface Contractor {
  name: string;
  email: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  timeframe: Timeframe;
  budget: Budget;
  contractors: Contractor[];
  createdAt: Date;
  updatedAt: Date;
}

// Type guards
function isTimeframe(json: any): json is Timeframe {
  return typeof json === 'object' 
    && typeof json.startDate === 'string'
    && typeof json.endDate === 'string';
}

function isBudget(json: any): json is Budget {
  return typeof json === 'object'
    && typeof json.estimated === 'number'
    && typeof json.actual === 'number';
}

function isContractor(json: any): json is Contractor {
  return typeof json === 'object'
    && typeof json.name === 'string'
    && typeof json.email === 'string'
    && typeof json.role === 'string'
    && typeof json.baseRate === 'number'
    && typeof json.chargeOutRate === 'number'
    && typeof json.isFixed === 'boolean';
}

// Convert Prisma Project to our Project interface
function toDomainProject(prismaProject: any): Project {
  return {
    id: prismaProject.id,
    title: prismaProject.title,
    client: prismaProject.client,
    status: prismaProject.status,
    timeframe: prismaProject.timeframe as Timeframe,
    budget: prismaProject.budget as Budget,
    contractors: prismaProject.contractors as Contractor[],
    createdAt: prismaProject.createdAt,
    updatedAt: prismaProject.updatedAt
  };
}

export const ProjectModel = {
  async create(data: {
    title: string;
    client: string;
    timeframe: Timeframe;
    budget: Budget;
    contractors: Contractor[];
  }): Promise<Project> {
    const [project] = await prisma.$queryRaw<[Project]>`
      INSERT INTO "Project" (
        id,
        title,
        client,
        status,
        timeframe,
        budget,
        contractors,
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${data.title},
        ${data.client},
        'new',
        ${JSON.stringify(data.timeframe)}::jsonb,
        ${JSON.stringify(data.budget)}::jsonb,
        ${JSON.stringify(data.contractors)}::jsonb[],
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING *;
    `;

    return toDomainProject(project);
  },

  async findById(id: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { id }
    });
    return project ? toDomainProject(project) : null;
  },

  async findAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return projects.map(toDomainProject);
  },

  async update(id: string, data: Partial<{
    title: string;
    client: string;
    status: ProjectStatus;
    timeframe: Timeframe;
    budget: Budget;
    contractors: Contractor[];
  }>): Promise<Project> {
    const setClause = [];
    const values = [id];
    let paramCount = 2;

    if (data.title) {
      setClause.push(`title = $${paramCount}`);
      values.push(data.title);
      paramCount++;
    }
    if (data.client) {
      setClause.push(`client = $${paramCount}`);
      values.push(data.client);
      paramCount++;
    }
    if (data.status) {
      setClause.push(`status = $${paramCount}`);
      values.push(data.status);
      paramCount++;
    }
    if (data.timeframe) {
      setClause.push(`timeframe = $${paramCount}::jsonb`);
      values.push(JSON.stringify(data.timeframe));
      paramCount++;
    }
    if (data.budget) {
      setClause.push(`budget = $${paramCount}::jsonb`);
      values.push(JSON.stringify(data.budget));
      paramCount++;
    }
    if (data.contractors) {
      setClause.push(`contractors = $${paramCount}::jsonb[]`);
      values.push(JSON.stringify(data.contractors));
      paramCount++;
    }

    setClause.push(`"updatedAt" = CURRENT_TIMESTAMP`);

    const [project] = await prisma.$queryRaw<[Project]>`
      UPDATE "Project"
      SET ${Prisma.raw(setClause.join(', '))}
      WHERE id = $1
      RETURNING *;
    `;

    return toDomainProject(project);
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<Project> {
    const project = await prisma.project.update({
      where: { id },
      data: { status }
    });
    return toDomainProject(project);
  },

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
    return projects.map(toDomainProject);
  }
};
