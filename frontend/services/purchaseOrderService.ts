import api from "@/utilities/connectAxios";

export interface PoItemRequest {
  itemId: number;
  quantity: number;
  unitPrice: number;
}

export interface PoQuotationRequest {
  vendorId: number;
  quotationAmount: number;
  receipt?: string | null;
  selected: boolean;
}

export interface PurchaseOrderSubmitRequest {
  projectId: string;
  items: PoItemRequest[];
  quotations: PoQuotationRequest[];
}

export interface PoItemResponse {
  itemRequestId: number;
  itemId: number;
  itemQuantity: number;
  itemUnitPrice: number;
  itemTotalPrice: number;
}

export interface PoQuotationResponse {
  poQuotationId: string;
  vendorId: number;
  quotationAmount: number;
  creationDate: string;
  createdBy: number;
  status: string;
  receiptAttached: string | null;
}

export interface PurchaseOrderDetailResponse {
  poRequestId: string;
  projectId: string;
  createdBy: number;
  createdAt: string;
  modifiedBy: number | null;
  modifiedAt: string | null;
  status: string;
  items: PoItemResponse[];
  quotations: PoQuotationResponse[];
}

export interface PurchaseOrderSummaryResponse {
  poRequestId: string;
  projectId: string;
  createdBy: number;
  createdAt: string;
  modifiedBy: number | null;
  modifiedAt: string | null;
  status: string;
}

export interface VendorLookupResponse {
  vendorId: number;
  vendorName: string;
}

export interface ItemLookupResponse {
  itemId: number;
  itemName: string;
  itemCategory: string;
}


export interface PoReceiptRequest {
  itemRequestId: number;
  quantityReceived: number;
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

export interface StockRequestItemRequest {
  itemId: number;
  requestedQuantity: number;
}

export interface CreateStockRequestRequest {
  projectId: string;
  projectProgressId: number;
  workQuantity: number;
  items: StockRequestItemRequest[];
}

export interface StockRequestResponse {
  stockAllocationRequestId: number;
  projectId: string;
  projectProgressId: number;
  workQuantity: number;
  requestStatus: number;
  requestedBy: number;
  requestedAt: string;
}


export async function createPurchaseOrder(
  request: PurchaseOrderSubmitRequest
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.post<PurchaseOrderDetailResponse>(
    "/api/pms/purchase-orders",
    request
  );

  return response.data;
}

export async function updateRejectedPurchaseOrder(
  poRequestId: string,
  request: PurchaseOrderSubmitRequest
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.put<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}`,
    request
  );

  return response.data;
}

export async function getAllPurchaseOrders(): Promise<PurchaseOrderSummaryResponse[]> {
  const response = await api.get<PurchaseOrderSummaryResponse[]>(
    "/api/pms/purchase-orders"
  );

  return response.data;
}

export async function getPurchaseOrderDetails(
  poRequestId: string
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.get<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}`
  );

  return response.data;
}

export async function approvePurchaseOrder(
  poRequestId: string
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.patch<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}/approve`
  );

  return response.data;
}

export async function rejectPurchaseOrder(
  poRequestId: string
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.patch<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}/reject`
  );

  return response.data;
}

export async function getPurchaseOrderVendors(): Promise<VendorLookupResponse[]> {
  const response = await api.get<VendorLookupResponse[]>(
    "/api/pms/purchase-orders/vendors"
  );

  return response.data;
}

export async function getPurchaseOrderItems(): Promise<ItemLookupResponse[]> {
  const response = await api.get<ItemLookupResponse[]>(
    "/api/pms/purchase-orders/items"
  );

  return response.data;
}

export async function financeApprovePurchaseOrder(
  poRequestId: string
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.patch<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}/finance-approve`
  );

  return response.data;
}

export async function placePurchaseOrder(
  poRequestId: string
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.patch<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}/place-order`
  );

  return response.data;
}


export async function receivePurchaseOrder(
  poRequestId: string,
  requests: PoReceiptRequest[]
): Promise<PurchaseOrderDetailResponse> {
  const response = await api.post<PurchaseOrderDetailResponse>(
    `/api/pms/purchase-orders/${poRequestId}/receive`,
    requests
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

export async function getProgressAvailableForStockRequest(
  projectId: string
): Promise<ProjectProgressItem[]> {
  const response = await api.get<ProjectProgressItem[]>(
    `/api/pms/projects/${projectId}/progress/stock-request`
  );

  return response.data;
}

export async function createStockRequest(
  request: CreateStockRequestRequest
): Promise<StockRequestResponse> {
  const response = await api.post<StockRequestResponse>(
    "/api/pms/stock-allocation/requests",
    request
  );

  return response.data;
}

export async function getPendingStockRequests(): Promise<StockRequestResponse[]> {
  const response = await api.get<StockRequestResponse[]>(
    "/api/pms/stock-allocation/requests/pending"
  );

  return response.data;
}

export async function allocateStockRequest(
  requestId: number
): Promise<StockRequestResponse> {
  const response = await api.post<StockRequestResponse>(
    `/api/pms/stock-allocation/requests/${requestId}/allocate`
  );

  return response.data;
}