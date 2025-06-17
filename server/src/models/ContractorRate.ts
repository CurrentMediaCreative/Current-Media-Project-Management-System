import { PrismaClient, ContractorRate as PrismaContractorRate } from '@prisma/client';

const prisma = new PrismaClient();

export type ContractorRate = PrismaContractorRate;

type CreateContractorRateInput = {
  role: string;
  baseRate: number;
  chargeOutRate?: number;
  isFixed?: boolean;
};

type UpdateContractorRateInput = Partial<CreateContractorRateInput>;

export const ContractorRateModel = {
  async create(data: CreateContractorRateInput): Promise<ContractorRate> {
    return prisma.contractorRate.create({
      data: {
        role: data.role,
        baseRate: data.baseRate,
        chargeOutRate: data.chargeOutRate ?? data.baseRate * 1.5,
        isFixed: data.isFixed ?? false
      }
    });
  },

  async findById(id: string): Promise<ContractorRate | null> {
    return prisma.contractorRate.findUnique({
      where: { id }
    });
  },

  async findByRole(role: string): Promise<ContractorRate | null> {
    return prisma.contractorRate.findUnique({
      where: { role }
    });
  },

  async findAll(): Promise<ContractorRate[]> {
    return prisma.contractorRate.findMany({
      orderBy: { role: 'asc' }
    });
  },

  async update(id: string, data: UpdateContractorRateInput): Promise<ContractorRate> {
    const updateData: any = {};
    
    if (data.role) {
      updateData.role = data.role;
    }
    
    if (typeof data.baseRate === 'number') {
      updateData.baseRate = data.baseRate;
      // Update chargeOutRate if not fixed and not explicitly provided
      if (!data.isFixed && typeof data.chargeOutRate !== 'number') {
        updateData.chargeOutRate = data.baseRate * 1.5;
      }
    }

    if (typeof data.chargeOutRate === 'number') {
      updateData.chargeOutRate = data.chargeOutRate;
    }

    if (typeof data.isFixed === 'boolean') {
      updateData.isFixed = data.isFixed;
    }

    return prisma.contractorRate.update({
      where: { id },
      data: updateData
    });
  },

  async updateRate(role: string, baseRate: number, chargeOutRate?: number): Promise<ContractorRate> {
    return prisma.contractorRate.update({
      where: { role },
      data: {
        baseRate,
        chargeOutRate: chargeOutRate ?? baseRate * 1.5
      }
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.contractorRate.delete({
      where: { id }
    });
  }
};
