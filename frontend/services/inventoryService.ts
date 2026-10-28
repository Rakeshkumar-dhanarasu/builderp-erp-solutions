import api from "@/utilities/connectAxios";

export interface ItemMasterRequest {
  itemName: string;
  itemCategory: string;
}

export interface ItemMasterResponse {
  itemId: number;
  itemName: string;
  itemCategory: string;
}

export interface ItemStockResponse {
  itemStockId: number;
  itemId: number;
  itemName: string;
  itemCategory: string;
  itemQuantity: number;
  stockedAt: string;
  stockedBy: number;
  projectId: string;
  poRequestId: string;
}

export interface ItemAvailabilityResponse {
  itemId: number;
  itemName: string;
  itemCategory: string;
  availableQuantity: number;
}

export async function createItem(
  request: ItemMasterRequest
): Promise<ItemMasterResponse> {
  const response = await api.post<ItemMasterResponse>(
    "/api/pms/item-master",
    request
  );

  return response.data;
}

export async function getAllItems(): Promise<ItemMasterResponse[]> {
  const response = await api.get<ItemMasterResponse[]>(
    "/api/pms/item-master"
  );

  return response.data;
}

export async function getItemById(
  itemId: number
): Promise<ItemMasterResponse> {
  const response = await api.get<ItemMasterResponse>(
    `/api/pms/item-master/${itemId}`
  );

  return response.data;
}

export async function updateItem(
  itemId: number,
  request: ItemMasterRequest
): Promise<ItemMasterResponse> {
  const response = await api.put<ItemMasterResponse>(
    `/api/pms/item-master/${itemId}`,
    request
  );

  return response.data;
}

export async function deleteItem(itemId: number): Promise<void> {
  await api.delete(`/api/pms/item-master/${itemId}`);
}

export async function getAllStockRecords(): Promise<ItemStockResponse[]> {
  const response = await api.get<ItemStockResponse[]>(
    "/api/pms/item-stock"
  );

  return response.data;
}

export async function getStockRecordById(
  itemStockId: number
): Promise<ItemStockResponse> {
  const response = await api.get<ItemStockResponse>(
    `/api/pms/item-stock/${itemStockId}`
  );

  return response.data;
}

export async function getItemAvailability(): Promise<
  ItemAvailabilityResponse[]
> {
  const response = await api.get<ItemAvailabilityResponse[]>(
    "/api/pms/item-stock/availability"
  );

  return response.data;
}

export async function getItemAvailabilityById(
  itemId: number
): Promise<ItemAvailabilityResponse> {
  const response = await api.get<ItemAvailabilityResponse>(
    `/api/pms/item-stock/availability/${itemId}`
  );

  return response.data;
}
