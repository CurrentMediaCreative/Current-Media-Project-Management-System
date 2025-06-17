export interface ContractorRate {
    id: string;
    role: string;
    rate: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ContractorRateModel: {
    create(data: {
        role: string;
        rate: number;
    }): Promise<ContractorRate>;
    findById(id: string): Promise<ContractorRate | null>;
    findByRole(role: string): Promise<ContractorRate | null>;
    findAll(): Promise<ContractorRate[]>;
    update(id: string, data: Partial<{
        role: string;
        rate: number;
    }>): Promise<ContractorRate>;
    updateRate(role: string, rate: number): Promise<ContractorRate>;
    delete(id: string): Promise<void>;
};
