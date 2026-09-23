"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  Title,
  Grid,
  Container,
  Card,
  Group,
  Text,
  Badge,
  Stack,
  TextInput,
  Tabs,
  Button,
  Table,
  ActionIcon,
  Select,
  Avatar,
  SimpleGrid,
  Alert,
  Divider,
  Modal,
  Menu,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconUsers,
  IconBuildingStore,
  IconCone2,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconBan,
  IconPhone,
  IconMail,
  IconMapPin,
  IconFilter,
  IconDotsVertical,
  IconNotes,
  IconAlertCircle,
  IconBadge,
  IconCheck,
} from "@tabler/icons-react";

import {
  StakeholderForm,
  initialStakeholderFormData,
  StakeholderFormData,
} from "@/components/CreationForms/StakeholderForm";
import { DocumentUpload } from "@/components/FilesUpload";
import {
  createStakeholder,
  getStakeholdersByType,
  getStakeholderById,
  updateStakeholder,
  updateStakeholderStatus,
  deleteStakeholder,
  CreateStakeholderRequest,
  StakeholderCategory,
  StakeholderListResponse,
  StakeholderDetailResponse,
  EmployeeDesignation,
  EmployeeDepartment,
  EmployeePayroll,
} from "@/services/stakeholderService";

/* =========================================================
   UI TYPES
   ========================================================= */

interface Stakeholder {
  id: string;
  type: "Customer" | "Supplier" | "Sub-contractor" | "Employee";
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: "Active" | "Inactive";
}

/* =========================================================
   TYPE MAPPINGS
   ========================================================= */

const uiTypeToBackend: Record<Stakeholder["type"], StakeholderCategory> = {
  Customer: "CUSTOMER",
  Supplier: "SUPPLIER",
  "Sub-contractor": "SUB_CONTRACTOR",
  Employee: "EMPLOYEE",
};

const backendTypeToUi: Record<StakeholderCategory, Stakeholder["type"]> = {
  CUSTOMER: "Customer",
  SUPPLIER: "Supplier",
  SUB_CONTRACTOR: "Sub-contractor",
  EMPLOYEE: "Employee",
};

/* =========================================================
   EMPLOYEE LABELS
   ========================================================= */

const designationLabels: Record<string, string> = {
  OPERATIONAL_MANAGER: "Operational Manager",
  STOREKEEPER: "Storekeeper",
  FOREMAN: "Foreman",
  PROJECT_ENGINEER: "Project Engineer",
  ACCOUNTANT: "Accountant",
};

const departmentLabels: Record<string, string> = {
  ADMINISTRATION: "Administration",
  FINANCE: "Finance",
  PURCHASE: "Purchase",
  SALES: "Sales",
  PROJECT_MANAGEMENT: "Project Management",
};

const payrollLabels: Record<string, string> = {
  MONTHLY_SALARY: "Monthly Salary",
  HOURLY_WAGES: "Hourly Wages",
  PIECE_RATE_PAY: "Piece-rate Pay",
};

/* =========================================================
   HELPERS
   ========================================================= */

function formatPhone(code: number | string, phoneNumber: number | string) {
  return `+${code} ${phoneNumber}`;
}

/* =========================================================
   LIST RESPONSE → UI
   ========================================================= */

function mapStakeholderToUi(stakeholder: StakeholderListResponse): Stakeholder {
  const type = backendTypeToUi[stakeholder.stakeholderCategory];

  return {
    id: String(stakeholder.stakeholderId),
    type,
    name: `${stakeholder.firstName} ${stakeholder.lastName}`.trim(),
    firstName: stakeholder.firstName,
    lastName: stakeholder.lastName,
    phone: formatPhone(stakeholder.primaryPhoneCode, stakeholder.primaryPhoneNum),
    altPhone: "",
    email: stakeholder.email,
    city: stakeholder.city,
    state: stakeholder.stateOrProvince || "",
    country: stakeholder.country,
    postalCode: stakeholder.postalCode || "",
    status: stakeholder.active ? "Active" : "Inactive",
  };
}

/* =========================================================
   CREATE / UPDATE REQUEST BUILDER
   ========================================================= */

function buildCreateRequest(formData: StakeholderFormData): CreateStakeholderRequest {
  const category = formData.stakeholderCategory as StakeholderCategory;

  const request: CreateStakeholderRequest = {
    stakeholderCategory: category,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    primaryPhoneCode: Number(formData.primaryPhoneCode),
    primaryPhoneNum: Number(formData.primaryPhoneNum),
    email: formData.email.trim(),
    primaryAddress: formData.primaryAddress.trim(),
    city: formData.city.trim(),
    country: formData.country.trim(),
  };

  if (formData.secondaryPhoneCode.trim() && formData.secondaryPhoneNum.trim()) {
    request.secondaryPhoneCode = Number(formData.secondaryPhoneCode);
    request.secondaryPhoneNum = Number(formData.secondaryPhoneNum);
  }

  if (formData.secondaryAddress.trim()) {
    request.secondaryAddress = formData.secondaryAddress.trim();
  }

  if (formData.stateOrProvince.trim()) {
    request.stateOrProvince = formData.stateOrProvince.trim();
  }

  if (formData.postalCode.trim()) {
    request.postalCode = formData.postalCode.trim();
  }

  if (formData.extraComments.trim()) {
    request.extraComments = formData.extraComments.trim();
  }

  if (category === "EMPLOYEE") {
    const details = formData.employeeDetails;

    if (
      details.employeeRole &&
      details.employeeDept &&
      details.payrollStructure &&
      details.salary !== null
    ) {
    request.employeeDetails = {
      employeeRole: details.employeeRole as EmployeeDesignation,
      employeeDept: details.employeeDept as EmployeeDepartment,
      payrollStructure: details.payrollStructure as EmployeePayroll,
      salary: Number(details.salary),
    };
  }
  }

  console.log("FINAL REQUEST OBJECT:", request);

  return request;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function StakeholdersManagement() {
  /* -------------------------------------------------------
     LIST STATE
     ------------------------------------------------------- */

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("Customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("All");
  const [selectedStkId, setSelectedStkId] = useState("");
  const [loadingStakeholders, setLoadingStakeholders] = useState(false);
  const [stakeholderError, setStakeholderError] = useState("");

  /* -------------------------------------------------------
     DETAIL STATE
     ------------------------------------------------------- */

  const [selectedStakeholderDetail, setSelectedStakeholderDetail] =
    useState<StakeholderDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  /* -------------------------------------------------------
     CREATE / EDIT MODAL
     ------------------------------------------------------- */

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [targetStakeholder, setTargetStakeholder] = useState<Stakeholder | null>(null);
  const [formData, setFormData] = useState<StakeholderFormData>(initialStakeholderFormData);
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  /* -------------------------------------------------------
     STATUS MODAL
     ------------------------------------------------------- */

  const [
    deactivateModalOpened,
    { open: openDeactivateModal, close: closeDeactivateModal },
  ] = useDisclosure(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  /* -------------------------------------------------------
     DELETE MODAL
     ------------------------------------------------------- */

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* =========================================================
     LOAD LIST
     ========================================================= */

  const loadStakeholders = async (type: StakeholderCategory, preferredId?: number) => {
    setLoadingStakeholders(true);
    setStakeholderError("");

    try {
      const response = await getStakeholdersByType(type);
      const mappedStakeholders = response.map(mapStakeholderToUi);

      setStakeholders(mappedStakeholders);

      if (
        preferredId !== undefined &&
        mappedStakeholders.some((item) => item.id === String(preferredId))
      ) {
        setSelectedStkId(String(preferredId));
      } else if (mappedStakeholders.length > 0) {
        setSelectedStkId(mappedStakeholders[0].id);
      } else {
        setSelectedStkId("");
        setSelectedStakeholderDetail(null);
      }
    } catch (error: any) {
      console.error("Failed to load stakeholders:", error);

      const status = error?.response?.status;

      if (status === 401) {
        setStakeholderError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setStakeholderError("You are not authorized to view stakeholders.");
      } else {
        setStakeholderError("Unable to retrieve stakeholders. Please try again.");
      }

      setStakeholders([]);
      setSelectedStkId("");
      setSelectedStakeholderDetail(null);
    } finally {
      setLoadingStakeholders(false);
    }
  };

  /* =========================================================
     LOAD DETAIL
     ========================================================= */

  const loadStakeholderDetail = async (stakeholderId: string) => {
    if (!stakeholderId) {
      setSelectedStakeholderDetail(null);
      return;
    }

    setLoadingDetail(true);
    setDetailError("");

    try {
      const detail = await getStakeholderById(Number(stakeholderId));
      setSelectedStakeholderDetail(detail);
    } catch (error: any) {
      console.error("Failed to load stakeholder detail:", error);

      const status = error?.response?.status;

      if (status === 404) {
        setDetailError("Stakeholder record was not found.");
      } else if (status === 401) {
        setDetailError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setDetailError("You are not authorized to view this stakeholder.");
      } else {
        setDetailError("Unable to retrieve stakeholder details.");
      }

      setSelectedStakeholderDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* =========================================================
     INITIAL / TAB LOAD
     ========================================================= */

  useEffect(() => {
    if (!activeTab) {
      return;
    }

    const backendType = uiTypeToBackend[activeTab as Stakeholder["type"]];

    setSearchQuery("");
    setStatusFilter("All");

    loadStakeholders(backendType);
  }, [activeTab]);

  /* =========================================================
     LOAD DETAIL WHEN SELECTION CHANGES
     ========================================================= */

  useEffect(() => {
    if (!selectedStkId) {
      setSelectedStakeholderDetail(null);
      return;
    }

    loadStakeholderDetail(selectedStkId);
  }, [selectedStkId]);

  /* =========================================================
     FILTER
     ========================================================= */

  const filteredData = stakeholders.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeStk = filteredData.find((item) => item.id === selectedStkId) || null;

  /* =========================================================
     CREATE
     ========================================================= */

  const handleOpenCreate = () => {
    const category = (activeTab || "Customer") as Stakeholder["type"];

    setIsEditing(false);
    setTargetStakeholder(null);
    setFormError("");

    setFormData({
      ...initialStakeholderFormData,
      stakeholderCategory: uiTypeToBackend[category],
    });

    openDrawer();
  };

  /* =========================================================
     EDIT
     ========================================================= */

  const handleOpenEdit = async (stakeholder: Stakeholder) => {
    setFormError("");
    setTargetStakeholder(stakeholder);

    setIsEditing(true);
    setFormSubmitting(false);

    try {
      setLoadingDetail(true);

      const detail = await getStakeholderById(Number(stakeholder.id));

      console.log("EMPLOYEE DETAIL FROM BACKEND:", {
        employeeRole: detail.employeeRole,
        employeeDept: detail.employeeDept,
        payrollStructure: detail.payrollStructure,
        salary: detail.salary,
      });

      setFormData({
        stakeholderCategory: detail.stakeholderCategory,
        firstName: detail.firstName,
        lastName: detail.lastName,
        primaryPhoneCode: String(detail.primaryPhoneCode),
        primaryPhoneNum: String(detail.primaryPhoneNum),
        secondaryPhoneCode:
          detail.secondaryPhoneCode != null ? String(detail.secondaryPhoneCode) : "",
        secondaryPhoneNum:
          detail.secondaryPhoneNum != null ? String(detail.secondaryPhoneNum) : "",
        email: detail.email,
        primaryAddress: detail.primaryAddress || "",
        secondaryAddress: detail.secondaryAddress || "",
        city: detail.city,
        stateOrProvince: detail.stateOrProvince || "",
        country: detail.country,
        postalCode: detail.postalCode || "",
        extraComments: detail.extraComments || "",
        employeeDetails: {
          employeeRole: detail.employeeRole || null,
          employeeDept: detail.employeeDept || null,
          payrollStructure: detail.payrollStructure || null,
          salary: detail.salary != null ? Number(detail.salary) : null,
        },
      });

      openDrawer();
    } catch (error: any) {
      console.error("Failed to load stakeholder for editing:", error);

      const status = error?.response?.status;

      if (status === 404) {
        setFormError("The stakeholder record was not found.");
      } else if (status === 401) {
        setFormError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setFormError("You are not authorized to edit this stakeholder.");
      } else {
        setFormError("Unable to load stakeholder details for editing.");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  /* =========================================================
     STATUS MODAL
     ========================================================= */

  const handleOpenStatusChange = (stakeholder: Stakeholder) => {
    setTargetStakeholder(stakeholder);
    setStatusError("");
    openDeactivateModal();
  };

  /* =========================================================
     DELETE MODAL
     ========================================================= */

  const handleOpenDelete = (stakeholder: Stakeholder) => {
    setTargetStakeholder(stakeholder);
    setDeleteError("");
    openDeleteModal();
  };

  /* =========================================================
     CLOSE FORM
     ========================================================= */

  const handleCloseDrawer = () => {
    closeDrawer();

    setFormError("");
    setTargetStakeholder(null);
    setIsEditing(false);
    setFormSubmitting(false);

    setFormData({
      ...initialStakeholderFormData,
      employeeDetails: {
        ...initialStakeholderFormData.employeeDetails,
      },
    });
  };

  /* =========================================================
     CREATE / UPDATE SUBMIT
     ========================================================= */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError("");
    setFormSubmitting(true);

    try {
      console.log("FORM EMPLOYEE DETAILS:", formData.employeeDetails);

      const request = buildCreateRequest(formData);
      console.log("UPDATE REQUEST:", JSON.stringify(request, null, 2));

      /* -----------------------------------------------------
         UPDATE
         ----------------------------------------------------- */

      if (isEditing && targetStakeholder) {
        const response = await updateStakeholder(
          Number(targetStakeholder.id),
          request
        );

        setSelectedStakeholderDetail(response);
        closeDrawer();

        await loadStakeholders(
          response.stakeholderCategory,
          response.stakeholderId
        );
        return;
      }

      /* -----------------------------------------------------
         CREATE
         ----------------------------------------------------- */

      const response = await createStakeholder(request);

      handleCloseDrawer();

      await loadStakeholders(
        response.stakeholderCategory,
        response.stakeholderId
      );

    } catch (error: any) {
      console.error("Stakeholder save failed:", error);

      const status = error?.response?.status;
      console.log("Backend error response:", error?.response?.data);
      const message = error?.response?.data?.message;

      if (status === 400) {
        setFormError(
          message || "Please correct the stakeholder details and try again."
        );
      } else if (status === 401) {
        setFormError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setFormError(
          isEditing
            ? "You are not authorized to update this stakeholder."
            : "You are not authorized to create a stakeholder."
        );
      } else if (status === 404) {
        setFormError("The stakeholder record was not found.");
      } else if (status === 409) {
        setFormError(
          message || "A stakeholder with the same information already exists."
        );
      } else {
        setFormError(
          isEditing
            ? "Unable to update stakeholder. Please try again."
            : "Unable to create stakeholder. Please try again."
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  /* =========================================================
     ACTIVATE / DEACTIVATE
     ========================================================= */

  const executeStatusChange = async () => {
    if (!targetStakeholder) {
      return;
    }

    const newStatus = targetStakeholder.status !== "Active";

    setStatusLoading(true);
    setStatusError("");

    try {
      const response = await updateStakeholderStatus(
        Number(targetStakeholder.id),
        newStatus
      );

      closeDeactivateModal();

      await loadStakeholders(response.stakeholderCategory, response.stakeholderId);
      setSelectedStakeholderDetail(response);
    } catch (error: any) {
      console.error("Failed to update stakeholder status:", error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404) {
        setStatusError("Stakeholder record was not found.");
      } else if (status === 401) {
        setStatusError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setStatusError("You are not authorized to change stakeholder status.");
      } else {
        setStatusError(message || "Unable to update stakeholder status.");
      }
    } finally {
      setStatusLoading(false);
    }
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const executeDelete = async () => {
    if (!targetStakeholder) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const deletedId = Number(targetStakeholder.id);
      const deletedType = uiTypeToBackend[targetStakeholder.type];

      await deleteStakeholder(deletedId);

      closeDeleteModal();
      setSelectedStakeholderDetail(null);

      await loadStakeholders(deletedType);
    } catch (error: any) {
      console.error("Failed to delete stakeholder:", error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404) {
        setDeleteError("This stakeholder no longer exists.");
      } else if (status === 401) {
        setDeleteError("Your session has expired. Please log in again.");
      } else if (status === 403) {
        setDeleteError("You are not authorized to delete this stakeholder.");
      } else if (status === 409) {
        setDeleteError(
          message ||
            "This stakeholder cannot be deleted because it is being used elsewhere."
        );
      } else {
        setDeleteError(message || "Unable to delete stakeholder. Please try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
  <Container fluid p={0} style={{ width: "100%" }}>
    {/* =====================================================
        HEADER
        ===================================================== */}

    <Paper p="md" radius="md" mb="md" withBorder>
      <Group justify="space-between" align="center">
        <Stack gap={4}>
          <Title order={2}>Stakeholders</Title>
          <Text size="sm" c="dimmed">
            Manage customers, suppliers, sub-contractors, and employees.
          </Text>
        </Stack>

        <Button
          size="sm"
          leftSection={<IconPlus size={16} />}
          onClick={handleOpenCreate}
        >
          Add Stakeholder
        </Button>
      </Group>
    </Paper>

    {/* =====================================================
        TABS
        ===================================================== */}

    <Tabs
      variant="pills"
      value={activeTab}
      onChange={(value) => {
        setActiveTab(value);
        setStatusFilter("All");
        setSearchQuery("");
        setSelectedStakeholderDetail(null);
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="Customer" leftSection={<IconUsers size={14} />}>
          Customers
        </Tabs.Tab>
        <Tabs.Tab value="Supplier" leftSection={<IconBuildingStore size={14} />}>
          Suppliers
        </Tabs.Tab>
        <Tabs.Tab value="Sub-contractor" leftSection={<IconCone2 size={14} />}>
          Sub-contractors
        </Tabs.Tab>
        <Tabs.Tab value="Employee" leftSection={<IconBadge size={14} />}>
          Employees
        </Tabs.Tab>
      </Tabs.List>

      {/* ===================================================
          MAIN GRID
          =================================================== */}

      <Grid columns={12} gap="md" mt="md">
        {/* =================================================
            LEFT - LIST
            ================================================= */}

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" fw={700}>
                  {activeTab}s
                </Text>
                <Select
                  size="xs"
                  data={["All", "Active", "Inactive"]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  leftSection={<IconFilter size={12} />}
                  style={{ width: 130 }}
                />
              </Group>

              <TextInput
                placeholder="Search by name, phone, email or city..."
                size="xs"
                leftSection={<IconSearch size={14} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />

              <Card withBorder p={0} radius="sm" style={{ overflowX: "auto" }}>
                <Table horizontalSpacing="xs" verticalSpacing="xs" highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Phone</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th style={{ width: 50 }} />
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {loadingStakeholders ? (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Text size="xs" c="dimmed" ta="center" py="xl">
                            Loading stakeholder records...
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : stakeholderError ? (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Alert color="red" icon={<IconAlertCircle size={16} />}>
                            {stakeholderError}
                          </Alert>
                        </Table.Td>
                      </Table.Tr>
                    ) : filteredData.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Text size="xs" c="dimmed" ta="center" py="xl">
                            No {activeTab?.toLowerCase()} records found.
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      filteredData.map((stk) => (
                        <Table.Tr
                          key={stk.id}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              stk.id === selectedStkId
                                ? "var(--mantine-color-brandOrange-light)"
                                : undefined,
                          }}
                          onClick={() => setSelectedStkId(stk.id)}
                        >
                          <Table.Td>
                            <Group gap="xs" wrap="nowrap">
                              <Avatar size={30} radius="md" color="brandOrange">
                                {stk.firstName?.charAt(0)}
                                {stk.lastName?.charAt(0)}
                              </Avatar>
                              <Stack gap={0}>
                                <Text size="xs" fw={700}>
                                  {stk.name}
                                </Text>
                                <Text size="10px" c="dimmed">
                                  ID: {stk.id}
                                </Text>
                              </Stack>
                            </Group>
                          </Table.Td>

                          <Table.Td>
                            <Text size="xs">
                              <IconPhone
                                size={11}
                                style={{ verticalAlign: "middle", marginRight: 4 }}
                              />
                              {stk.phone}
                            </Text>
                          </Table.Td>

                          <Table.Td>
                            <Text
                              size="xs"
                              style={{
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <IconMail
                                size={11}
                                style={{ verticalAlign: "middle", marginRight: 4 }}
                              />
                              {stk.email}
                            </Text>
                          </Table.Td>

                          <Table.Td>
                            <Badge
                              size="xs"
                              color={stk.status === "Active" ? "teal" : "red"}
                              variant="light"
                            >
                              {stk.status}
                            </Badge>
                          </Table.Td>

                          <Table.Td onClick={(event) => event.stopPropagation()}>
                            <Menu position="bottom-end" shadow="md" width={170}>
                              <Menu.Target>
                                <ActionIcon variant="subtle" color="gray" size="sm">
                                  <IconDotsVertical size={14} />
                                </ActionIcon>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconEye size={14} />}
                                  onClick={() => setSelectedStkId(stk.id)}
                                >
                                  View Details
                                </Menu.Item>

                                <Menu.Item
                                  leftSection={<IconEdit size={14} />}
                                  onClick={() => handleOpenEdit(stk)}
                                >
                                  Edit
                                </Menu.Item>

                                <Menu.Item
                                  leftSection={
                                    stk.status === "Active" ? (
                                      <IconBan size={14} />
                                    ) : (
                                      <IconCheck size={14} />
                                    )
                                  }
                                  onClick={() => handleOpenStatusChange(stk)}
                                >
                                  {stk.status === "Active" ? "Deactivate" : "Activate"}
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={() => handleOpenDelete(stk)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Card>

              <Text size="xs" c="dimmed">
                Showing {filteredData.length} stakeholder
                {filteredData.length === 1 ? "" : "s"}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        {/* =================================================
            RIGHT - DETAIL
            ================================================= */}

        <Grid.Col span={{ base: 12, md: 5 }}>
          {loadingDetail ? (
            <Card withBorder radius="md">
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Loading stakeholder details...
              </Text>
            </Card>
          ) : detailError ? (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {detailError}
            </Alert>
          ) : selectedStakeholderDetail ? (
            <Card withBorder radius="md" p="md">
              <Stack gap="md">
                {/* -----------------------------------------
                    HEADER
                    ----------------------------------------- */}

                <Group justify="space-between" align="flex-start">
                  <Group gap="sm" wrap="nowrap">
                    <Avatar size={44} radius="md" color="brandOrange">
                      {selectedStakeholderDetail.firstName?.charAt(0)}
                      {selectedStakeholderDetail.lastName?.charAt(0)}
                    </Avatar>

                    <div>
                      <Text fw={700} size="md">
                        {selectedStakeholderDetail.firstName}{" "}
                        {selectedStakeholderDetail.lastName}
                      </Text>

                      <Text size="xs" c="dimmed">
                        ID: {selectedStakeholderDetail.stakeholderId}
                      </Text>
                    </div>
                  </Group>

                  <Badge
                    color={selectedStakeholderDetail.active ? "teal" : "red"}
                    variant="light"
                  >
                    {selectedStakeholderDetail.active ? "Active" : "Inactive"}
                  </Badge>
                </Group>

                <Divider />

                {/* -----------------------------------------
                    BASIC INFORMATION
                    ----------------------------------------- */}

                <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                  Basic Information
                </Text>

                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">
                      Type
                    </Text>
                    <Text size="sm">
                      {backendTypeToUi[selectedStakeholderDetail.stakeholderCategory]}
                    </Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed">
                      Email
                    </Text>
                    <Text size="sm" style={{ wordBreak: "break-word" }}>
                      {selectedStakeholderDetail.email}
                    </Text>
                  </div>
                </SimpleGrid>

                <Divider />

                {/* -----------------------------------------
                    CONTACT
                    ----------------------------------------- */}

                <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                  Contact
                </Text>

                <Stack gap={4}>
                  <Text size="sm">
                    <IconPhone
                      size={14}
                      style={{ verticalAlign: "middle", marginRight: 5 }}
                    />
                    +{selectedStakeholderDetail.primaryPhoneCode}{" "}
                    {selectedStakeholderDetail.primaryPhoneNum}
                  </Text>

                  {selectedStakeholderDetail.secondaryPhoneNum != null && (
                    <Text size="sm">
                      <IconPhone
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: 5 }}
                      />
                      +{selectedStakeholderDetail.secondaryPhoneCode}{" "}
                      {selectedStakeholderDetail.secondaryPhoneNum}
                    </Text>
                  )}
                </Stack>

                <Divider />

                {/* -----------------------------------------
                    ADDRESS
                    ----------------------------------------- */}

                <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                  Address
                </Text>

                <Group gap="xs" wrap="nowrap" align="flex-start">
                  <ThemeIcon size="sm" variant="light" color="gray">
                    <IconMapPin size={14} />
                  </ThemeIcon>

                  <Stack gap={2}>
                    <Text size="sm">
                      {selectedStakeholderDetail.primaryAddress}
                    </Text>

                    {selectedStakeholderDetail.secondaryAddress && (
                      <Text size="sm" c="dimmed">
                        {selectedStakeholderDetail.secondaryAddress}
                      </Text>
                    )}

                    <Text size="sm" c="dimmed">
                      {selectedStakeholderDetail.city}
                      {selectedStakeholderDetail.stateOrProvince
                        ? `, ${selectedStakeholderDetail.stateOrProvince}`
                        : ""}
                      {selectedStakeholderDetail.country
                        ? `, ${selectedStakeholderDetail.country}`
                        : ""}
                      {selectedStakeholderDetail.postalCode
                        ? ` - ${selectedStakeholderDetail.postalCode}`
                        : ""}
                    </Text>
                  </Stack>
                </Group>

                {/* -----------------------------------------
                    EMPLOYEE
                    ----------------------------------------- */}

                {selectedStakeholderDetail.stakeholderCategory === "EMPLOYEE" && (
                  <>
                    <Divider />

                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                      Employee Information
                    </Text>

                    <SimpleGrid cols={2} spacing="sm">
                      <div>
                        <Text size="xs" c="dimmed">
                          Designation
                        </Text>
                        <Text size="sm">
                          {selectedStakeholderDetail.employeeRole
                            ? designationLabels[selectedStakeholderDetail.employeeRole]
                            : "-"}
                        </Text>
                      </div>

                      <div>
                        <Text size="xs" c="dimmed">
                          Department
                        </Text>
                        <Text size="sm">
                          {selectedStakeholderDetail.employeeDept
                            ? departmentLabels[selectedStakeholderDetail.employeeDept]
                            : "-"}
                        </Text>
                      </div>

                      <div>
                        <Text size="xs" c="dimmed">
                          Payroll
                        </Text>
                        <Text size="sm">
                          {selectedStakeholderDetail.payrollStructure
                            ? payrollLabels[selectedStakeholderDetail.payrollStructure]
                            : "-"}
                        </Text>
                      </div>

                      <div>
                        <Text size="xs" c="dimmed">
                          Salary
                        </Text>
                        <Text size="sm">
                          {selectedStakeholderDetail.salary != null
                            ? selectedStakeholderDetail.salary.toLocaleString("en-IN")
                            : "-"}
                        </Text>
                      </div>
                    </SimpleGrid>
                  </>
                )}

                {/* -----------------------------------------
                    ADDITIONAL INFORMATION & ACTIONS
                    ----------------------------------------- */}

                {selectedStakeholderDetail.extraComments && (
                  <>
                    <Divider />

                    <Group gap="xs">
                      <IconNotes size={14} />
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                        Additional Information
                      </Text>
                    </Group>

                    <Text size="sm" c="dimmed">
                      {selectedStakeholderDetail.extraComments}
                    </Text>
                  </>
                )}

                {/* -----------------------------------------
                    ACTIONS
                    ----------------------------------------- */}

                <Divider />

                <Group justify="flex-end">
                  {activeStk && (
                    <>
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleOpenEdit(activeStk)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="xs"
                        variant="light"
                        color={selectedStakeholderDetail.active ? "orange" : "teal"}
                        leftSection={
                          selectedStakeholderDetail.active ? (
                            <IconBan size={14} />
                          ) : (
                            <IconCheck size={14} />
                          )
                        }
                        onClick={() => handleOpenStatusChange(activeStk)}
                      >
                        {selectedStakeholderDetail.active ? "Deactivate" : "Activate"}
                      </Button>

                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleOpenDelete(activeStk)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Group>
              </Stack>
            </Card>
          ) : (
            <Alert title="No Stakeholder Selected" icon={<IconEye size={16} />}>
              Select a stakeholder from the list to view the complete details.
            </Alert>
          )}
        </Grid.Col>
      </Grid>
    </Tabs>

    {/* =====================================================
        CREATE / EDIT MODAL
        ===================================================== */}

    <Modal
      opened={drawerOpened}
      onClose={formSubmitting ? () => {} : handleCloseDrawer}
      title={
        <Text size="md" fw={700}>
          {isEditing
            ? `Edit Stakeholder: ${targetStakeholder?.id}`
            : "Create New Stakeholder"}
        </Text>
      }
      size="70%"
      centered
    >
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        {formError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {formError}
          </Alert>
        )}

        <StakeholderForm
          value={formData}
          onChange={setFormData}
          isEditing={isEditing}
        />

        <Divider />

        <DocumentUpload />

        <Divider />

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={handleCloseDrawer}
            disabled={formSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" loading={formSubmitting}>
            {isEditing ? "Save Changes" : "Add Stakeholder"}
          </Button>
        </Group>
      </Stack>
    </Modal>

    {/* =====================================================
        ACTIVATE / DEACTIVATE MODAL
        ===================================================== */}

    <Modal
      opened={deactivateModalOpened}
      onClose={statusLoading ? () => {} : closeDeactivateModal}
      title={
        <Text
          size="sm"
          fw={700}
          c={targetStakeholder?.status === "Active" ? "orange" : "teal"}
        >
          {targetStakeholder?.status === "Active"
            ? "Deactivate Stakeholder"
            : "Activate Stakeholder"}
        </Text>
      }
      centered
      size="sm"
    >
      <Stack gap="sm">
        <Text size="sm">
          Are you sure you want to{" "}
          <b>
            {targetStakeholder?.status === "Active" ? "deactivate" : "activate"}
          </b>{" "}
          <b>{targetStakeholder?.name}</b>?
        </Text>

        <Text size="xs" c="dimmed">
          {targetStakeholder?.status === "Active"
            ? "The stakeholder will remain in the system but will be marked inactive."
            : "The stakeholder will become active and available for normal use."}
        </Text>

        {statusError && (
          <Alert color="red" icon={<IconAlertCircle size={14} />}>
            {statusError}
          </Alert>
        )}

        <Group justify="flex-end">
          <Button
            size="xs"
            variant="outline"
            color="gray"
            onClick={closeDeactivateModal}
            disabled={statusLoading}
          >
            Cancel
          </Button>

          <Button
            size="xs"
            color={targetStakeholder?.status === "Active" ? "orange" : "teal"}
            loading={statusLoading}
            onClick={executeStatusChange}
          >
            {targetStakeholder?.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </Group>
      </Stack>
    </Modal>

    {/* =====================================================
        DELETE MODAL
        ===================================================== */}

    <Modal
      opened={deleteModalOpened}
      onClose={deleteLoading ? () => {} : closeDeleteModal}
      title={
        <Text size="sm" fw={700} c="red">
          Delete Stakeholder
        </Text>
      }
      centered
      size="sm"
    >
      <Stack gap="sm">
        <Text size="sm">
          Are you sure you want to permanently delete{" "}
          <b>{targetStakeholder?.name}</b>?
        </Text>

        <Alert color="red" icon={<IconAlertCircle size={14} />}>
          This action cannot be undone.
        </Alert>

        {deleteError && (
          <Alert color="red" icon={<IconAlertCircle size={14} />}>
            {deleteError}
          </Alert>
        )}

        <Group justify="flex-end">
          <Button
            size="xs"
            variant="outline"
            color="gray"
            onClick={closeDeleteModal}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            size="xs"
            color="red"
            loading={deleteLoading}
            onClick={executeDelete}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  </Container>
);
}