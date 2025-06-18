export interface ContractorRate {
  id: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateContractorRateInput {
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed?: boolean;
}

export interface UpdateContractorRateInput {
  baseRate?: number;
  chargeOutRate?: number;
  isFixed?: boolean;
}
