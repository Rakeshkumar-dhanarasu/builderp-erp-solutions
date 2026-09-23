import api from "@/utilities/connectAxios";

export type StakeholderCategory =
  | "CUSTOMER"
  | "SUPPLIER"
  | "SUB_CONTRACTOR"
  | "EMPLOYEE";

export type EmployeeDesignation =
  | "OPERATIONAL_MANAGER"
  | "STOREKEEPER"
  | "FOREMAN"
  | "PROJECT_ENGINEER"
  | "ACCOUNTANT";

export type EmployeeDepartment =
  | "ADMINISTRATION"
  | "FINANCE"
  | "PURCHASE"
  | "SALES"
  | "PROJECT_MANAGEMENT";

export type EmployeePayroll =
  | "MONTHLY_SALARY"
  | "HOURLY_WAGES"
  | "PIECE_RATE_PAY";

export interface EmployeeDetailRequest {
  employeeRole: EmployeeDesignation;
  employeeDept: EmployeeDepartment;
  payrollStructure: EmployeePayroll;
  salary: number;
}

export interface CreateStakeholderRequest {
  stakeholderCategory: StakeholderCategory;

  firstName: string;
  lastName: string;

  primaryPhoneCode: number;
  primaryPhoneNum: number;

  secondaryPhoneCode?: number;
  secondaryPhoneNum?: number;

  email: string;

  primaryAddress: string;
  secondaryAddress?: string;

  city: string;
  stateOrProvince?: string;
  country: string;
  postalCode?: string;

  extraComments?: string;

  employeeDetails?: EmployeeDetailRequest;
}

/*
 * Create and Update currently have the same editable fields.
 */
export type UpdateStakeholderRequest =
  CreateStakeholderRequest;

export interface CreateStakeholderResponse {
  stakeholderId: number;
  stakeholderCategory: StakeholderCategory;

  firstName: string;
  lastName: string;

  email: string;

  primaryPhoneCode: number;
  primaryPhoneNum: number;

  createdBy: string;
  modifiedBy: string;

  createdDate: string;
  modifiedDate: string;

  active: boolean;
}

export interface StakeholderListResponse {
  stakeholderId: number;
  stakeholderCategory: StakeholderCategory;

  firstName: string;
  lastName: string;

  primaryPhoneCode: number;
  primaryPhoneNum: number;

  email: string;

  city: string;
  stateOrProvince?: string;
  country: string;
  postalCode?: string;

  active: boolean;
}

export interface StakeholderDetailResponse {
  stakeholderId: number;
  stakeholderCategory: StakeholderCategory;

  firstName: string;
  lastName: string;

  primaryPhoneCode: number;
  primaryPhoneNum: number;

  secondaryPhoneCode?: number;
  secondaryPhoneNum?: number;

  email: string;

  primaryAddress: string;
  secondaryAddress?: string;

  city: string;
  stateOrProvince?: string;
  country: string;
  postalCode?: string;

  extraComments?: string;

  /*
   * Audit information is returned by backend.
   * The UI intentionally does not display it.
   */
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;

  active: boolean;

  /*
   * Employee-only information.
   */
  employeeRole?: EmployeeDesignation;
  employeeDept?: EmployeeDepartment;
  payrollStructure?: EmployeePayroll;
  salary?: number;
}

export interface UpdateStakeholderStatusRequest {
  active: boolean;
} 
/* =========================================================
   CREATE
   ========================================================= */

export async function createStakeholder(
  request: CreateStakeholderRequest
): Promise<CreateStakeholderResponse> {

  const response =
    await api.post<CreateStakeholderResponse>(
      "/api/pms/stakeholders",
      request
    );

  return response.data;
}


/* =========================================================
   LIST
   ========================================================= */

export async function getStakeholdersByType(
  type: StakeholderCategory
): Promise<StakeholderListResponse[]> {

  const response =
    await api.get<StakeholderListResponse[]>(
      "/api/pms/stakeholders",
      {
        params: { type },
      }
    );

  return response.data;
}


/* =========================================================
   DETAIL
   ========================================================= */

export async function getStakeholderById(
  stakeholderId: number
): Promise<StakeholderDetailResponse> {

  const response =
    await api.get<StakeholderDetailResponse>(
      `/api/pms/stakeholders/${stakeholderId}`
    );

  return response.data;
}


/* =========================================================
   UPDATE
   ========================================================= */

export async function updateStakeholder(
  stakeholderId: number,
  request: UpdateStakeholderRequest
): Promise<StakeholderDetailResponse> {

  const response =
    await api.put<StakeholderDetailResponse>(
      `/api/pms/stakeholders/${stakeholderId}`,
      request
    );

  return response.data;
}


/* =========================================================
   ACTIVATE / DEACTIVATE
   ========================================================= */

export async function updateStakeholderStatus(
  stakeholderId: number,
  active: boolean
): Promise<StakeholderDetailResponse> {

  const request: UpdateStakeholderStatusRequest = {
    active,
  };

  const response =
    await api.patch<StakeholderDetailResponse>(
      `/api/pms/stakeholders/${stakeholderId}/status`,
      request
    );

  return response.data;
}


/* =========================================================
   DELETE
   ========================================================= */

export async function deleteStakeholder(
  stakeholderId: number
): Promise<void> {

  await api.delete(
    `/api/pms/stakeholders/${stakeholderId}`
  );
}