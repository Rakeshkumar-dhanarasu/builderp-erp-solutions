import api from "@/utilities/connectAxios";

export interface QuotationTaskRequest {
  taskName: string;
  subTaskName?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  price: number;
}

export interface CreateQuotationRequest {
  customerId: number;
  draftDate: string;
  expiryDate: string;
  siteAddress: string;
  currencyCode: string;
  addComments?: string;
  tasks: QuotationTaskRequest[];
  marketPrice: number;
  taxPercent?: number;
  discountAmount: number;
  total: number;
}

export interface UpdateQuotationRequest {
  expiryDate: string;
  siteAddress: string;
  addComments?: string;
  tasks: QuotationTaskRequest[];
  marketPrice: number;
  taxPercent?: number; 
  discountAmount: number;
  total: number;
}

export interface QuotationTaskResponse {
  utid: number;
  taskId: number;
  taskName: string;
  subTaskId: number;
  subTaskName?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  price: number;
}

export interface QuotationResponse {
  quotationId: string;
  customerId: number;
  customer: string;
  draftDate: string;
  expiryDate: string;
  siteAddress: string;
  addComments?: string;
  versionNumber: number;
  quoteStatus: string;
  marketPrice: number;
  taxPercent?: number;
  discountAmount: number;
  total: number;
  currencyCode: string;
  tasks: QuotationTaskResponse[];
}

export interface QuotationListResponse {
  quotationId: string;
  customer: string;
  quoteStatus: string;
  versionNumber: number;
  total: number;
  currencyCode: string;
  draftedAt: string;
}

export interface QuotationVersionHistoryResponse {
  versionNumber: number;
  draftedAt: string;
  expiredAt: string;
  quoteStatus: string;
  marketPrice: number;
  discountAmount: number;
  taxPercent?: number;
  total: number;
  currencyCode: string;
  draftedBy: string;
  addComments?: string;
}

export interface BudgetResponse {
  quotationId: string;
  totalBudget: number;
  purchaseMaterial: number;
  subcontractor: number;
  labourForces: number;
  transportLogistics: number;
  miscellaneous: number;
  miscDetails?: string;
}

export interface BudgetEditRequest {
  purchaseMaterial: number;
  subcontractor: number;
  labourForces: number;
  transportLogistics: number;
  miscellaneous: number;
  miscDetails?: string;
}

export async function createQuotation(
  request: CreateQuotationRequest
): Promise<QuotationResponse> {
  const response = await api.post<QuotationResponse>(
    "/api/pms/quotations",
    request
  );

  return response.data;
}

export async function getQuotation(
  quotationId: string
): Promise<QuotationResponse> {
  const response = await api.get<QuotationResponse>(
    `/api/pms/quotations/${quotationId}`
  );

  return response.data;
}

export async function updateQuotation(
  quotationId: string,
  request: UpdateQuotationRequest
): Promise<QuotationResponse> {
  const response = await api.put<QuotationResponse>(
    `/api/pms/quotations/${quotationId}`,
    request
  );

  return response.data;
}

export async function sendQuotation(
  quotationId: string
): Promise<QuotationResponse> {
  const response = await api.patch<QuotationResponse>(
    `/api/pms/quotations/${quotationId}/send`
  );

  return response.data;
}

export async function acceptQuotation(
  quotationId: string
): Promise<QuotationResponse> {
  const response = await api.patch<QuotationResponse>(
    `/api/pms/quotations/${quotationId}/accept`
  );

  return response.data;
}

export async function rejectQuotation(
  quotationId: string
): Promise<QuotationResponse> {
  const response = await api.patch<QuotationResponse>(
    `/api/pms/quotations/${quotationId}/reject`
  );

  return response.data;
}

export async function getAllQuotations(): Promise<QuotationListResponse[]> {
  const response = await api.get<QuotationListResponse[]>(
    "/api/pms/quotations"
  );

  return response.data;
}

export async function createNewQuotationVersion(
  quotationId: string
): Promise<QuotationResponse> {
  const response = await api.post<QuotationResponse>(
    `/api/pms/quotations/${quotationId}/versions`
  );

  return response.data;
}

export async function getQuotationVersionHistory(
  quotationId: string
): Promise<QuotationVersionHistoryResponse[]> {
  const response = await api.get<QuotationVersionHistoryResponse[]>(
    `/api/pms/quotations/${quotationId}/versions`
  );

  return response.data;
}

export async function downloadQuotationPdf(
  quotationId: string
): Promise<Blob> {
  const response = await api.get(
    `/api/pms/quotations/${quotationId}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}

export async function getBudgetDetails(
  quotationId: string
): Promise<BudgetResponse> {
  const response = await api.get<BudgetResponse>(
    `/api/pms/budgeting/${quotationId}/budgetdetails`
  );

  return response.data;
}

export async function editBudget(
  quotationId: string,
  request: BudgetEditRequest
): Promise<BudgetResponse> {
  const response = await api.post<BudgetResponse>(
    `/api/pms/budgeting/${quotationId}/editBudget`,
    request
  );

  return response.data;
}
