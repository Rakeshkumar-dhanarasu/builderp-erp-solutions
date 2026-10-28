import api from "@/utilities/connectAxios";

export interface CreateProjectRequest {
  projectName: string;
  projectManagerId: number;
  quotationId: string;
  quotationVersion: number;
  startDate: string;
  expectedEndDate: string;
}

export interface ProjectResponse {
  projectId: string;
  projectName: string;
  projectManagerId: number;
  quotationId: string;
  quotationVersion: number;
  startDate: string;
  expectedEndDate: string;
  completionPercent: number;
  status: string;
  customer: string;
}

export interface ProjectListResponse {
  projectId: string;
  projectName: string;
  customer: string;
  budgetAllocated: number;
  status: string;
}

export interface ProjectDetailResponse {
  projectId: string;
  projectName: string;
  customer: string;
  siteAddress: string;
  projectManagerId: number;
  quotationId: string;
  quotationVersion: number;
  startDate: string;
  expectedEndDate: string;
  completionPercent: number;
  budgetAllocated: number;
  status: string;
}

export interface EmployeeLookupResponse {
  employeeId: number;
  employeeName: string;
  hourlyRate: number;
}

export interface ProjectProgressItem {
  projectProgressId: number;
  projectId: string;
  taskId: number;
  taskName: string;
  subTaskId: number;
  subTaskName: string;
  targetQuantity: number;
  quantityCompleted: number;
  pendingWorkQuantity: number;
  remainingWorkQuantity: number;
  status: number;
}

export interface ProjectProgressTrackingResponse {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  totalSubTasks: number;
  completedSubTasks: number;
  inProgressSubTasks: number;
  initiatedSubTasks: number;
  overallCompletionPercentage: number;
  subTasks: ProjectProgressItem[];
}

export interface StockAllocationItemRequest {
  itemId: number;
  requestedQuantity: number;
}


export interface CreateStockAllocationRequest {
  projectId: string;
  projectProgressId: number;
  items: StockAllocationItemRequest[];
}

export interface StockAllocationRequestResponse {
  stockAllocationRequestId: number;
  jobNumber: string;
  projectId: string;
  projectProgressId: number;
  requestStatus: number;
  requestedBy: number;
  requestedAt: string;
  items: {
    itemId: number;
    itemName: string;
    itemCategory: string;
    requestedQuantity: number;
    availableQuantity: number;
  }[];
}


export interface BudgetCategoryTracking {
  category: string;
  allocated: number;
  used: number;
  remaining: number;
}

export interface BudgetTransactionTracking {
  budgetTransactionId: number;
  category: string;
  transactionTypeId: number;
  transactionTypeName: string;
  amountChange: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string | null;
  description: string | null;
  performedBy: number;
  performedAt: string;
}

export interface BudgetTrackingResponse {
  budgetId: number;
  totalCategoryAllocated: number;
  totalCategoryUsed: number;
  totalCategoryRemaining: number;
  categories: BudgetCategoryTracking[];
  transactions: BudgetTransactionTracking[];
}

export interface LabourSlipEmployeeRequest {
  employeeId: number;
  hoursWorked: number;
}

export interface LabourSlipRequest {
  jobNumber: string;
  workDate: string;
  employees: LabourSlipEmployeeRequest[];
  markSubTaskCompleted: boolean;
}

export interface UpdateLabourSlipRequest {
  employees: LabourSlipEmployeeRequest[];
  markSubTaskCompleted: boolean;
}

export interface LabourSlipEmployeeResponse {
  employeeId: number;
  hoursWorked: number;
  hourlyRate: number;
  totalPay: number;
}

export interface LabourSlipResponse {
  labourSlipId: number;
  jobNumber: string;
  workDate: string;
  totalWages: number;
  employees: LabourSlipEmployeeResponse[];
}

export async function createProject(
  request: CreateProjectRequest
): Promise<ProjectResponse> {
  const response = await api.post<ProjectResponse>(
    "/api/pms/projects",
    request
  );

  return response.data;
}

export async function getAllProjects(): Promise<ProjectListResponse[]> {
  const response = await api.get<ProjectListResponse[]>(
    "/api/pms/projects"
  );

  return response.data;
}

export async function getProjectDetails(
  projectId: string
): Promise<ProjectDetailResponse> {
  const response = await api.get<ProjectDetailResponse>(
    `/api/pms/projects/${projectId}`
  );

  return response.data;
}

export async function getEmployees(): Promise<EmployeeLookupResponse[]> {
  const response = await api.get<EmployeeLookupResponse[]>(
    "/api/pms/employees"
  );
  return response.data;
}

export async function getProgressAvailableForStockRequest(
  projectId: string
): Promise<ProjectProgressItem[]> {
  const response = await api.get<ProjectProgressItem[]>(
    `/api/pms/projects/${projectId}/progress/stock-request`
  );
  return response.data;
}

export async function getProjectProgress(
  projectId: string
): Promise<ProjectProgressTrackingResponse> {
  const response = await api.get<ProjectProgressTrackingResponse>(
    `/api/pms/projects/${projectId}/progress`
  );
  return response.data;
}

export async function createStockAllocationRequest(
  request: CreateStockAllocationRequest
): Promise<StockAllocationRequestResponse> {
  const response = await api.post<StockAllocationRequestResponse>(
    "/api/pms/stock-allocation/requests",
    request
  );

  return response.data;
}

export async function allocateStockRequest(
  requestId: number
): Promise<StockAllocationRequestResponse> {
  const response = await api.post<StockAllocationRequestResponse>(
    `/api/pms/stock-allocation/requests/${requestId}/allocate`
  );

  return response.data;
}

export async function allocateStockRequestByJobNumber(
  jobNumber: string
): Promise<StockAllocationRequestResponse> {
  const response = await api.post<StockAllocationRequestResponse>(
    `/api/pms/stock-allocation/jobs/${encodeURIComponent(jobNumber)}/allocate`
  );

  return response.data;
}

export async function getPendingStockRequests(): Promise<
  StockAllocationRequestResponse[]
> {
  const response = await api.get<StockAllocationRequestResponse[]>(
    "/api/pms/stock-allocation/requests/pending"
  );

  return response.data;
}

export const getBudgetTracking = async (
  quotationId: string
): Promise<BudgetTrackingResponse> => {
  const response = await api.get<BudgetTrackingResponse>(
    `/api/pms/budgeting/${quotationId}/tracking`
  );

  return response.data;
};


export async function createLabourSlip(
  request: LabourSlipRequest
): Promise<LabourSlipResponse> {
  const response = await api.post<LabourSlipResponse>(
    "/api/pms/labour-slips",
    request
  );

  return response.data;
}

export async function updateLabourSlip(
  labourSlipId: number,
  request: UpdateLabourSlipRequest
): Promise<LabourSlipResponse> {
  const response = await api.put<LabourSlipResponse>(
    `/api/pms/labour-slips/${labourSlipId}`,
    request
  );

  return response.data;
}

export async function getLabourSlip(
  labourSlipId: number
): Promise<LabourSlipResponse> {
  const response = await api.get<LabourSlipResponse>(
    `/api/pms/labour-slips/${labourSlipId}`
  );

  return response.data;
}

export async function getLabourSlips(
  jobNumber?: string
): Promise<LabourSlipResponse[]> {
  const response = await api.get<LabourSlipResponse[]>(
    "/api/pms/labour-slips",
    {
      params: jobNumber ? { jobNumber } : undefined,
    }
  );

  return response.data;
}

export const getAllocatedStockRequests = async (): Promise<
  StockAllocationRequestResponse[]
> => {
  const response = await api.get<StockAllocationRequestResponse[]>(
    "/api/pms/stock-allocation/requests/allocated"
  );

  return response.data;
};