import { ContractorRate as PrismaContractorRate } from '@prisma/client';
export type ContractorRate = PrismaContractorRate;
type CreateContractorRateInput = {
    role: string;
    baseRate: number;
    chargeOutRate?: number;
    isFixed?: boolean;
};
type UpdateContractorRateInput = Partial<CreateContractorRateInput>;
export declare const ContractorRateModel: {
    create(data: CreateContractorRateInput): Promise<ContractorRate>;
    findById(id: string): Promise<ContractorRate | null>;
    findByRole(role: string): Promise<ContractorRate | null>;
    findAll(): Promise<ContractorRate[]>;
    update(id: string, data: UpdateContractorRateInput): Promise<ContractorRate>;
    updateRate(role: string, baseRate: number, chargeOutRate?: number): Promise<ContractorRate>;
    delete(id: string): Promise<void>;
};
export {};
