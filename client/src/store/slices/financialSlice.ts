import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum InvoiceStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

interface Invoice {
  id: string;
  projectId: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContractorRate {
  id: string;
  role: string;
  baseRate: number;
  chargeOutRate: number;
  isFixed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FinancialState {
  invoices: Invoice[];
  contractorRates: ContractorRate[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  analytics: {
    totalRevenue: number;
    outstandingPayments: number;
    profitMargin: number;
    monthlyRevenue: {
      month: string;
      amount: number;
    }[];
  };
}

const initialState: FinancialState = {
  invoices: [],
  contractorRates: [],
  currentInvoice: null,
  loading: false,
  error: null,
  analytics: {
    totalRevenue: 0,
    outstandingPayments: 0,
    profitMargin: 0,
    monthlyRevenue: [],
  },
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    fetchInvoicesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInvoicesSuccess: (state, action: PayloadAction<Invoice[]>) => {
      state.loading = false;
      state.invoices = action.payload;
    },
    fetchInvoicesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentInvoice: (state, action: PayloadAction<Invoice>) => {
      state.currentInvoice = action.payload;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ invoiceId: string; status: InvoiceStatus }>) => {
      const invoice = state.invoices.find((i: Invoice) => i.id === action.payload.invoiceId);
      if (invoice) {
        invoice.status = action.payload.status as any;
      }
      if (state.currentInvoice?.id === action.payload.invoiceId) {
        state.currentInvoice.status = action.payload.status as any;
      }
    },
    fetchContractorRatesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContractorRatesSuccess: (state, action: PayloadAction<ContractorRate[]>) => {
      state.loading = false;
      state.contractorRates = action.payload;
    },
    fetchContractorRatesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAnalytics: (state, action: PayloadAction<{
      totalRevenue: number;
      outstandingPayments: number;
      profitMargin: number;
      monthlyRevenue: { month: string; amount: number; }[];
    }>) => {
      state.analytics = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchInvoicesStart,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  setCurrentInvoice,
  clearCurrentInvoice,
  updateInvoiceStatus,
  fetchContractorRatesStart,
  fetchContractorRatesSuccess,
  fetchContractorRatesFailure,
  updateAnalytics,
  clearError,
} = financialSlice.actions;

export default financialSlice.reducer;
