"use client";

import React, { useState, useEffect } from "react";
import {
  ActionIcon, Alert, Badge, Box, Button, Card, Checkbox, Container, Divider, Drawer,
  Grid, Group, Menu, Modal, NumberInput, Paper, Progress, ScrollArea, SegmentedControl,
  Select, SimpleGrid, Stack, Table, Tabs, Text, Textarea, TextInput, ThemeIcon, Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle, IconArchive, IconBan, IconBoxSeam, IconCalendar, IconChevronRight,
  IconDotsVertical, IconDownload, IconEdit, IconEye, IconFilter, IconFolder,
  IconLayersIntersect, IconMapPin, IconNotes, IconPackage, IconPhone, IconPlus,
  IconReceipt, IconRefresh, IconScale, IconSearch, IconTrash, IconTruckDelivery, IconUsers
} from "@tabler/icons-react";

import {
  getAllPurchaseOrders,
  getPurchaseOrderDetails,
  receivePurchaseOrder,
  type PurchaseOrderSummaryResponse,
  type PurchaseOrderDetailResponse,
  type PoReceiptRequest,
} from "@/services/purchaseOrderService";

import {
  getPendingStockRequests,
  getAllocatedStockRequests,
  allocateStockRequest,
  allocateStockRequestByJobNumber,
  getEmployees,
  createLabourSlip,
  type StockAllocationRequestResponse,
  type EmployeeLookupResponse,
  type LabourSlipRequest,
  type LabourSlipResponse,
} from "@/services/projectService";

import {
  createItem,
  deleteItem,
  getAllItems,
  getItemAvailability,
  updateItem,
  type ItemMasterResponse,
  type ItemAvailabilityResponse,
} from "@/services/inventoryService";

// ==========================================
// ENTERPRISE PMS INVENTORY MOCK DATA
// ==========================================
interface Project {
  id: string;
  name: string;
  code: string;
  customer: string;
  location: string;
  projectManager: string;
  startDate: string;
  expectedCompletion: string;
  budgetAmount: number;
  budgetUsedPct: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  type: string;
  description: string;
}


// ==========================================
// SYSTEM HELPER BADGE STYLES
// ==========================================
function StockStatusBadge({ status }: { status: string }) {
  let color = "gray";
  if (status === "Available" || status === "Received") color = "teal";
  if (status === "Low Stock" || status === "Partially Received") color = "orange";
  if (status === "Out of Stock" || status === "Delayed") color = "red";
  if (status === "Ordered") color = "blue";

  return <Badge size="xs" variant="light" color={color}>{status}</Badge>;
}

const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR' }).format(val);

export default function InventoryManagementPage() {
  const [activeModuleTab, setActiveModuleTab] = useState<string | null>("stock");

  // Client Hydration Buffer Strategy
  const [clientDateStamp, setClientDateStamp] = useState("");
  useEffect(() => {
    setClientDateStamp(new Date().toISOString().split("T")[0]);
  }, []);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummaryResponse[]>([]);
  const [receivingOrder, setReceivingOrder] = useState<PurchaseOrderDetailResponse | null>(null);
  const [receiptQuantities, setReceiptQuantities] = useState<Record<number, number>>({});
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receivingError, setReceivingError] = useState<string | null>(null);
  const [receivingSuccess, setReceivingSuccess] = useState<string | null>(null);
  const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);

  const [pendingStockRequests, setPendingStockRequests] = useState<
    StockAllocationRequestResponse[]
  >([]);
  const [pendingStockRequestsLoading, setPendingStockRequestsLoading] = useState(false);
  const [allocatingRequestId, setAllocatingRequestId] = useState<number | null>(null);

  const [allocatedStockRequests, setAllocatedStockRequests] = useState<StockAllocationRequestResponse[]>([]);
  const [allocatedRequestsLoading, setAllocatedRequestsLoading] = useState(false);

  const [employees, setEmployees] = useState<EmployeeLookupResponse[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const [selectedLabourJob, setSelectedLabourJob] = useState<string | null>(null);
  const [labourWorkDate, setLabourWorkDate] = useState("");
  const [labourEmployees, setLabourEmployees] = useState<{ employeeId: string | null; hoursWorked: number | string }[]>([{ employeeId: null, hoursWorked: 0 }]);

  const [submittingLabourSlip, setSubmittingLabourSlip] = useState(false);
  const [labourSlipError, setLabourSlipError] = useState<string | null>(null);
  const [labourSlipSuccess, setLabourSlipSuccess] = useState<string | null>(null);

  const [activeMasterTab, setActiveMasterTab] = useState<string | null>("items");
  const [itemMasterData, setItemMasterData] = useState<ItemMasterResponse[]>([]);
  const [itemAvailabilityData, setItemAvailabilityData] = useState<
    ItemAvailabilityResponse[]
  >([]);

  const [itemFormOpened, setItemFormOpened] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");

  const [itemLoading, setItemLoading] = useState(false);
  const [itemSaving, setItemSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [markSubTaskCompleted, setMarkSubTaskCompleted] = useState(false);

  // Derived available quantity limit for selected transfer item
  const loadPurchaseOrders = async () => {
    setLoadingOrders(true);
    setReceivingError(null);

    try {
      const orders = await getAllPurchaseOrders();
      setPurchaseOrders(
        orders.filter((order) =>
          ["Order placed", "Incomplete"].includes(order.status)
        )
      );
    } catch {
      setReceivingError("Unable to load purchase orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const openReceiptDrawer = async (poRequestId: string) => {
    setReceivingError(null);
    setReceivingSuccess(null);
    setReceiptQuantities({});

    try {
      const order = await getPurchaseOrderDetails(poRequestId);
      setReceivingOrder(order);
      setReceiptDrawerOpened(true);
    } catch {
      setReceivingError("Unable to load purchase order details.");
    }
  };

  const loadPendingStockRequests = async () => {
    try {
      setPendingStockRequestsLoading(true);
      const requests = await getPendingStockRequests();
      setPendingStockRequests(requests);
    } catch (error) {
      console.error("Failed to load pending stock requests:", error);
      window.alert("Unable to load pending stock requests.");
    } finally {
      setPendingStockRequestsLoading(false);
    }
  };

  const loadAllocatedStockRequests = async () => {
    setAllocatedRequestsLoading(true);
    setLabourSlipError(null);

    try {
      const requests = await getAllocatedStockRequests();
      setAllocatedStockRequests(requests);
    } catch (error) {
      console.error("Failed to load allocated stock requests:", error);
      setLabourSlipError("Unable to load allocated jobs.");
    } finally {
      setAllocatedRequestsLoading(false);
    }
  };

  const loadLabourEmployees = async () => {
    setEmployeesLoading(true);

    try {
      const result = await getEmployees();
      setEmployees(result);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setLabourSlipError("Unable to load employees.");
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    void loadAllocatedStockRequests();
    void loadLabourEmployees();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setClientDateStamp(today);
    setLabourWorkDate(today);
  }, []);
  
  const handleAllocateStockRequest = async (jobNumber: string) => {
    if (!window.confirm(`Allocate stock for job ${jobNumber}?`)) return;

    const request = pendingStockRequests.find(
      (item) => item.jobNumber === jobNumber
    );

    if (!request) {
      window.alert("Unable to find the selected stock request.");
      return;
    }

    try {
      setAllocatingRequestId(request.stockAllocationRequestId);

      await allocateStockRequestByJobNumber(request.jobNumber);

      window.alert(`Stock allocated successfully for ${jobNumber}.`);
      await loadPendingStockRequests();
    } catch (error) {
      console.error("Failed to allocate stock request:", error);
      window.alert(
        "Unable to allocate stock. Please verify available inventory and request status."
      );
    } finally {
      setAllocatingRequestId(null);
    }
  };


  useEffect(() => {
    void loadPendingStockRequests();
  }, []);

  const submitReceipt = async () => {
    if (!receivingOrder) return;

    const requests: PoReceiptRequest[] = receivingOrder.items
      .filter((item) => (receiptQuantities[item.itemRequestId] ?? 0) > 0)
      .map((item) => ({
        itemRequestId: item.itemRequestId,
        quantityReceived: receiptQuantities[item.itemRequestId],
      }));

    if (requests.length === 0) {
      setReceivingError("Enter a received quantity for at least one item.");
      return;
    }

    setSubmittingReceipt(true);
    setReceivingError(null);
    setReceivingSuccess(null);

    try {
      await receivePurchaseOrder(receivingOrder.poRequestId, requests);
      setReceiptDrawerOpened(false);
      setReceivingOrder(null);
      setReceiptQuantities({});
      setReceivingSuccess(
        `Receipt recorded successfully for ${receivingOrder.poRequestId}.`
      );
      await loadPurchaseOrders();
    } catch {
      setReceivingError(
        "Receipt could not be recorded. Check the quantities and try again."
      );
    } finally {
      setSubmittingReceipt(false);
    }
  };
  
  const addLabourEmployee = () => {
    setLabourEmployees((current) => [
      ...current,
      { employeeId: null, hoursWorked: 0 },
    ]);
  };

  const removeLabourEmployee = (index: number) => {
    setLabourEmployees((current) =>
      current.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const updateLabourEmployee = (
    index: number,
    field: "employeeId" | "hoursWorked",
    value: string | number | null
  ) => {
    setLabourEmployees((current) =>
      current.map((employee, rowIndex) =>
        rowIndex === index
          ? { ...employee, [field]: value }
          : employee
      )
    );
  };

  const selectedLabourJobDetails = allocatedStockRequests.find(
    (request) => request.jobNumber === selectedLabourJob
  );

  const totalLabourWages = labourEmployees.reduce((total, row) => {
    const employee = employees.find(
      (item) => String(item.employeeId) === row.employeeId
    );

    const hours = Number(row.hoursWorked) || 0;
    const hourlyRate = employee?.hourlyRate ?? 0;

    return total + hours * hourlyRate;
  }, 0);

  const handleSubmitLabourSlip = async () => {
    setLabourSlipError(null);
    setLabourSlipSuccess(null);

    if (!selectedLabourJob) {
      setLabourSlipError("Select an allocated job.");
      return;
    }

    if (!labourWorkDate) {
      setLabourSlipError("Select the work date.");
      return;
    }

    if (
      labourEmployees.length === 0 ||
      labourEmployees.some(
        (row) =>
          !row.employeeId ||
          !Number.isFinite(Number(row.hoursWorked)) ||
          Number(row.hoursWorked) <= 0
      )
    ) {
      setLabourSlipError(
        "Select an employee and enter positive hours worked for every row."
      );
      return;
    }

    const employeeIds = labourEmployees.map((row) => row.employeeId);
    if (new Set(employeeIds).size !== employeeIds.length) {
      setLabourSlipError("An employee can only be added once per labour slip.");
      return;
    }

    const request: LabourSlipRequest = {
      jobNumber: selectedLabourJob,
      workDate: labourWorkDate,
      employees: labourEmployees.map((row) => ({
        employeeId: Number(row.employeeId),
        hoursWorked: Number(row.hoursWorked),
      })),
      markSubTaskCompleted,
    };

    setSubmittingLabourSlip(true);

    try {
      await createLabourSlip(request);

      setLabourSlipSuccess(
        `Labour slip created successfully for ${selectedLabourJob}.`
      );
      setLabourEmployees([{ employeeId: null, hoursWorked: 0 }]);
    } catch (error) {
      console.error("Failed to create labour slip:", error);
      setLabourSlipError(
        "Unable to create the labour slip. Check the job, work date, employee eligibility, and available labour budget."
      );
    } finally {
      setSubmittingLabourSlip(false);
    }
  };

  const loadItemData = async () => {
    setItemLoading(true);

    try {
      const [items, availability] = await Promise.all([
        getAllItems(),
        getItemAvailability(),
      ]);

      setItemMasterData(items);
      setItemAvailabilityData(availability);
    } catch (error) {
      console.error("Failed to load inventory data:", error);

      notifications.show({
        title: "Loading failed",
        message: "Could not load item master and stock availability.",
        color: "red",
      });
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    void loadItemData();
  }, []);

  const openItemForm = (item?: ItemMasterResponse) => {
    setEditingItemId(item?.itemId ?? null);
    setItemName(item?.itemName ?? "");
    setItemCategory(item?.itemCategory ?? "");
    setItemFormOpened(true);
  };

  const handleSaveItem = async () => {
    const trimmedName = itemName.trim();
    const trimmedCategory = itemCategory.trim();

    if (!trimmedName || !trimmedCategory) {
      notifications.show({
        title: "Validation error",
        message: "Enter both the item name and item category.",
        color: "red",
      });
      return;
    }

    setItemSaving(true);

    try {
      const request = {
        itemName: trimmedName,
        itemCategory: trimmedCategory,
      };

      if (editingItemId === null) {
        await createItem(request);
      } else {
        await updateItem(editingItemId, request);
      }

      setItemFormOpened(false);
      await loadItemData();

      notifications.show({
        title: "Success",
        message:
          editingItemId === null
            ? "Item created successfully."
            : "Item updated successfully.",
        color: "teal",
      });
    } catch (error) {
      console.error("Failed to save item:", error);

      notifications.show({
        title: "Save failed",
        message: "Could not save the item. Please try again.",
        color: "red",
      });
    } finally {
      setItemSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const item = itemMasterData.find((entry) => entry.itemId === itemId);

    if (
      !window.confirm(
        `Are you sure you want to delete "${item?.itemName ?? "this item"}"?`
      )
    ) {
      return;
    }

    setDeletingItemId(itemId);

    try {
      await deleteItem(itemId);
      await loadItemData();

      notifications.show({
        title: "Success",
        message: "Item deleted successfully.",
        color: "teal",
      });
    } catch (error) {
      console.error("Failed to delete item:", error);

      notifications.show({
        title: "Delete failed",
        message:
          "Could not delete this item. It may already be referenced by stock records.",
        color: "red",
      });
    } finally {
      setDeletingItemId(null);
    }
  };
  
  const renderStatusBadge = (status: string) => {
      const statusMap: Record<string, string> = {
        'Not Started': 'gray',
        'In Progress': 'blue',
        'Completed': 'green',
        'Delayed': 'red',
        'Active': 'green',
        'Allocated': 'teal',
        'Settled': 'green'
      };
      return <Badge color={statusMap[status] || 'blue'} variant="light" radius="sm">{status}</Badge>;
    };

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* MODULE HEADER BAR */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2}>Inventory & Warehousing Hub</Title>
            <Text size="sm" c="dimmed">Track available stock balances, regulate multi-location storage yards, orchestrate cross-dock transfers, and manage core product items.</Text>
          </Stack>
        </Group>
      </Paper>

      {/* CORE MODULE INTERNAL TABS */}
      <Tabs value={activeModuleTab} onChange={setActiveModuleTab} variant="pills">
        
        <Tabs.List>
          <Tabs.Tab value="stock" leftSection={<IconPackage size={14} />}>
            Stock Storage
          </Tabs.Tab>
          <Tabs.Tab value="allocate" leftSection={<IconBoxSeam size={14} />}>
            Stock Allocation
          </Tabs.Tab>
          <Tabs.Tab value="labour-slip" leftSection={<IconUsers size={14} />}>
            Labour Slip
          </Tabs.Tab>
          <Tabs.Tab value="item-master" leftSection={<IconArchive size={14} />}>
            Item Master Directory
          </Tabs.Tab>
        </Tabs.List>
        {/* ========================================================
            TAB 1: STOCK MANAGEMENT (SUB-TABBED FLOWS)
            ======================================================== */}  
        <Tabs.Panel value="stock" pt="md">
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>Stock Storage</Title>
                <Text size="sm" c="dimmed">
                  Receive purchased items into common inventory.
                </Text>
              </div>
              <Button
                variant="light"
                leftSection={<IconTruckDelivery size={16} />}
                onClick={loadPurchaseOrders}
                loading={loadingOrders}
              >
                Refresh Orders
              </Button>
            </Group>

            {receivingError && (
              <Alert color="red" title="Receiving error" icon={<IconAlertCircle size={16} />}>
                {receivingError}
              </Alert>
            )}

            {receivingSuccess && (
              <Alert color="green" title="Success">
                {receivingSuccess}
              </Alert>
            )}

            <Paper withBorder radius="md" p="md">
              <Title order={4} mb="md">Incoming Purchase Orders</Title>

              {loadingOrders ? (
                <Text size="sm" c="dimmed">Loading purchase orders...</Text>
              ) : purchaseOrders.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No purchase orders are currently awaiting receipt.
                </Text>
              ) : (
                <Table.ScrollContainer minWidth={650}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Purchase Order</Table.Th>
                        <Table.Th>Project</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {purchaseOrders.map((order) => (
                        <Table.Tr key={order.poRequestId}>
                          <Table.Td>{order.poRequestId}</Table.Td>
                          <Table.Td>{order.projectId}</Table.Td>
                          <Table.Td>
                            <Badge
                              color={order.status === "Incomplete" ? "orange" : "blue"}
                            >
                              {order.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Button
                              size="xs"
                              onClick={() => openReceiptDrawer(order.poRequestId)}
                            >
                              Record Receipt
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              )}
            </Paper>

            <Drawer
              opened={receiptDrawerOpened}
              onClose={() => setReceiptDrawerOpened(false)}
              title={`Receive Items - ${receivingOrder?.poRequestId ?? ""}`}
              position="right"
              size="lg"
            >
              <Stack gap="md">
                {receivingOrder && (
                  <>
                    <Text size="sm" c="dimmed">
                      Project: {receivingOrder.projectId}
                    </Text>

                    <Text size="sm">
                      Enter the quantity received in this delivery for each item.
                      Leave items not received at zero.
                    </Text>

                    {receivingOrder.items.map((item) => (
                      <Paper key={item.itemRequestId} withBorder p="sm" radius="md">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text fw={500}>Item ID: {item.itemId}</Text>
                            <Text size="sm" c="dimmed">
                              Ordered quantity: {item.itemQuantity}
                            </Text>
                          </div>
                          <NumberInput
                            label="Received now"
                            min={0}
                            allowDecimal={false}
                            value={receiptQuantities[item.itemRequestId] ?? 0}
                            onChange={(value) =>
                              setReceiptQuantities((current) => ({
                                ...current,
                                [item.itemRequestId]:
                                  typeof value === "number" ? value : 0,
                              }))
                            }
                          />
                        </Group>
                      </Paper>
                    ))}

                    {receivingError && (
                      <Alert color="red" title="Unable to record receipt">
                        {receivingError}
                      </Alert>
                    )}

                    <Button
                      onClick={submitReceipt}
                      loading={submittingReceipt}
                      disabled={receivingOrder.items.length === 0}
                      fullWidth
                    >
                      Submit Receipt
                    </Button>
                  </>
                )}
              </Stack>
            </Drawer>
          </Stack>
        </Tabs.Panel>
        
        {/* ========================================================
            TAB 2: STOCK ALLOCATION
            ======================================================== */}
        <Tabs.Panel value="allocate" mt="md">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Stock Allocation</Title>
                <Text size="sm" c="dimmed">Review Project Management stock requests and allocate available inventory to construction sites.</Text>
              </Stack>
              <Button
                size="sm"
                variant="light"
                color="orange"
                leftSection={<IconRefresh size={14} />}
                loading={pendingStockRequestsLoading}
                onClick={() => void loadPendingStockRequests()}
              >
                Refresh Requests
              </Button>
            </Group>
          </Paper>

          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Box>
                <Text fw={600} size="sm">Pending Stock Requests</Text>
                <Text size="xs" c="dimmed">Review requested materials and their current common-inventory availability before allocating.</Text>
              </Box>
              <Badge color="orange" variant="light">{pendingStockRequests.length} Pending</Badge>
            </Group>

            <Table.ScrollContainer minWidth={950}>
              <Table verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Request ID</Table.Th>
                    <Table.Th>Project</Table.Th>
                    <Table.Th>Progress ID</Table.Th>
                    <Table.Th>Requested Items</Table.Th>
                    <Table.Th>Requested At</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {pendingStockRequestsLoading ? (
                    <Table.Tr><Table.Td colSpan={6}><Text size="sm" c="dimmed" ta="center" py="md">Loading pending requests...</Text></Table.Td></Table.Tr>
                  ) : pendingStockRequests.length === 0 ? (
                    <Table.Tr><Table.Td colSpan={6}><Text size="sm" c="dimmed" ta="center" py="md">No pending stock requests.</Text></Table.Td></Table.Tr>
                  ) : (
                    pendingStockRequests.map((request) => {
                      const hasInsufficientStock = request.items.some(
                        (item) => item.requestedQuantity > item.availableQuantity
                      );

                      return (
                        <Table.Tr key={request.stockAllocationRequestId}>
                          <Table.Td><Text size="xs" fw={600}>{request.stockAllocationRequestId}</Text></Table.Td>
                          <Table.Td><Text size="xs">{request.projectId}</Text></Table.Td>
                          <Table.Td><Text size="xs">{request.projectProgressId}</Text></Table.Td>
                          <Table.Td>
                            <Stack gap="xs">
                              {request.items.map((item) => {
                                const insufficient = item.requestedQuantity > item.availableQuantity;

                                return (
                                  <Box key={item.itemId}>
                                    <Text size="xs" fw={600}>{item.itemName}</Text>
                                    <Text size="xs" c="dimmed">
                                      {item.itemCategory} · Requested: {item.requestedQuantity} · Available: {item.availableQuantity}
                                    </Text>
                                    {insufficient && (
                                      <Badge color="red" variant="light" size="sm" mt={4}>
                                        Insufficient stock
                                      </Badge>
                                    )}
                                  </Box>
                                );
                              })}
                            </Stack>
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs">{request.requestedAt ? new Date(request.requestedAt).toLocaleString() : "—"}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Button
                              size="xs"
                              color="brandOrange"
                              loading={allocatingRequestId === request.stockAllocationRequestId}
                              disabled={allocatingRequestId !== null || hasInsufficientStock || request.items.length === 0}
                              onClick={() => void handleAllocateStockRequest(request.jobNumber)}
                            >
                              Allocate
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Text size="xs" c="dimmed" mt="md">
              Allocation is disabled if any requested item exceeds its currently available stock. Availability can change, so the backend validates stock again when allocation is submitted.
            </Text>
          </Paper>
        </Tabs.Panel>

        {/* ========================================================
            TAB: LABOUR SLIP
            ======================================================== */}
        <Tabs.Panel value="labour-slip" mt="md">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Labour Slip Management</Title>
                <Text size="sm" c="dimmed">Record employee hours and track labour costs for allocated jobs.</Text>
              </Stack>
              <Button
                size="sm"
                variant="light"
                leftSection={<IconRefresh size={14} />}
                loading={allocatedRequestsLoading}
                onClick={() => {
                  void loadAllocatedStockRequests();
                  void loadLabourEmployees();
                }}
              >
                Refresh
              </Button>
            </Group>
          </Paper>

          {labourSlipError && <Text c="red" size="sm" mb="md">{labourSlipError}</Text>}
          {labourSlipSuccess && <Text c="green" size="sm" mb="md">{labourSlipSuccess}</Text>}

          <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
              <Title order={5}>Labour Details</Title>

              <Select
                label="Allocated Job"
                placeholder="Select an allocated job"
                data={allocatedStockRequests.map((request) => ({
                  value: request.jobNumber,
                  label: `${request.jobNumber} — ${request.projectId}`,
                }))}
                value={selectedLabourJob}
                onChange={(value) => {
                  setSelectedLabourJob(value);
                  setLabourSlipError(null);
                  setLabourSlipSuccess(null);
                }}
                searchable
                clearable
                disabled={allocatedRequestsLoading}
                nothingFoundMessage="No allocated jobs found"
              />

              {selectedLabourJobDetails && (
                <Paper p="sm" radius="md" bg="var(--mantine-color-default-hover)">
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>Project: {selectedLabourJobDetails.projectId}</Text>
                    <Badge color="teal" variant="light">Allocated</Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mt={4}>Progress ID: {selectedLabourJobDetails.projectProgressId}</Text>
                  <Text size="sm" fw={500} mt="sm">Requested Materials</Text>
                  {selectedLabourJobDetails.items.map((item) => (
                    <Text size="sm" key={item.itemId}>{item.itemName} — {item.requestedQuantity}</Text>
                  ))}
                </Paper>
              )}

              <TextInput
                type="date"
                label="Work Date"
                value={labourWorkDate}
                onChange={(event) => setLabourWorkDate(event.currentTarget.value)}
                max={clientDateStamp || undefined}
                required
              />

              <Group justify="space-between" align="center" mt="sm">
                <Title order={5}>Employees</Title>
                <Button
                  variant="light"
                  size="xs"
                  onClick={addLabourEmployee}
                  disabled={employeesLoading || employees.length === 0}
                >
                  Add Employee
                </Button>
              </Group>

              {labourEmployees.map((row, index) => {
                const selectedEmployee = employees.find(
                  (employee) => String(employee.employeeId) === row.employeeId
                );
                const employeePay = (Number(row.hoursWorked) || 0) * (selectedEmployee?.hourlyRate ?? 0);

                return (
                  <Paper key={index} p="sm" radius="md" withBorder>
                    <Stack gap="sm">
                      <Group align="flex-end" wrap="nowrap">
                        <Select
                          label="Employee"
                          placeholder={employeesLoading ? "Loading employees..." : "Select employee"}
                          data={employees.map((employee) => ({
                            value: String(employee.employeeId),
                            label: employee.employeeName,
                            disabled: labourEmployees.some(
                              (other, otherIndex) =>
                                otherIndex !== index && other.employeeId === String(employee.employeeId)
                            ),
                          }))}
                          value={row.employeeId}
                          onChange={(value) => updateLabourEmployee(index, "employeeId", value)}
                          searchable
                          clearable
                          disabled={employeesLoading}
                          style={{ flex: 2 }}
                        />

                        <NumberInput
                          label="Hours Worked"
                          placeholder="0.00"
                          min={0}
                          decimalScale={2}
                          value={row.hoursWorked}
                          onChange={(value) => updateLabourEmployee(index, "hoursWorked", value)}
                          style={{ flex: 1 }}
                        />

                        <Button
                          color="red"
                          variant="subtle"
                          disabled={labourEmployees.length === 1}
                          onClick={() => removeLabourEmployee(index)}
                        >
                          Remove
                        </Button>
                      </Group>

                      {selectedEmployee && (
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Hourly rate: {formatOMR(selectedEmployee.hourlyRate)}</Text>
                          <Text size="sm" fw={600}>Employee pay: {formatOMR(employeePay)}</Text>
                        </Group>
                      )}
                    </Stack>
                  </Paper>
                );
              })}

              <Checkbox
                label="Mark associated sub-task as Completed"
                description="Mark this job's sub-task as completed when the labour slip is saved."
                checked={markSubTaskCompleted}
                onChange={(event) =>
                  setMarkSubTaskCompleted(event.currentTarget.checked)
                }
              />

              <Divider />

              <Paper p="md" radius="md" bg="var(--mantine-color-default-hover)">
                <Text size="sm" c="dimmed">Estimated Total Labour Cost</Text>
                <Title order={3}>{formatOMR(totalLabourWages)}</Title>
                <Text size="xs" c="dimmed">Final wages and budget deduction are calculated by the backend.</Text>
              </Paper>

              <Group justify="flex-end">
                <Button
                  color="brandOrange"
                  loading={submittingLabourSlip}
                  disabled={
                    allocatedRequestsLoading ||
                    employeesLoading ||
                    allocatedStockRequests.length === 0 ||
                    employees.length === 0
                  }
                  onClick={() => void handleSubmitLabourSlip()}
                >
                  Submit Labour Slip
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>
        {/* ========================================================
            TAB 3: ITEM MASTER DIRECTORY
            ======================================================== */}
        <Tabs.Panel value="item-master" mt="md">
          <Tabs value={activeMasterTab} onChange={setActiveMasterTab} color="indigo">
            <Tabs.List>
              <Tabs.Tab value="items" leftSection={<IconPackage size={14} />}>Item Master</Tabs.Tab>
              <Tabs.Tab value="stock" leftSection={<IconLayersIntersect size={14} />}>Item Stock</Tabs.Tab>
            </Tabs.List>

            {/* SUB-TAB 1: ITEM MASTER */}
            <Tabs.Panel value="items" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Item Master Directory</Text>
                    <Button size="xs" color="indigo" leftSection={<IconPlus size={14} />} onClick={() => openItemForm()}>
                      Add Item
                    </Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Item ID</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Item Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Item Category</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 80, textAlign: "center" }}>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {itemMasterData.map((item) => (
                        <Table.Tr key={item.itemId}>
                          <Table.Td><Text size="xs" fw={700}>{item.itemId}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{item.itemName}</Text></Table.Td>
                          <Table.Td><Text size="xs">{item.itemCategory}</Text></Table.Td>
                          <Table.Td>
                            <Group gap={4} justify="center">
                              <ActionIcon variant="subtle" color="gray" size="sm" aria-label={`Edit ${item.itemName}`} onClick={() => openItemForm(item)}>
                                <IconEdit size={14} />
                              </ActionIcon>
                              <ActionIcon variant="subtle" color="red" size="sm" aria-label={`Delete ${item.itemName}`} loading={deletingItemId === item.itemId} disabled={deletingItemId !== null} onClick={() => handleDeleteItem(item.itemId)}>
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}

                      {!itemLoading && itemMasterData.length === 0 && (
                        <Table.Tr><Table.Td colSpan={4}><Text size="sm" c="dimmed" ta="center" py="md">No items found.</Text></Table.Td></Table.Tr>
                      )}

                      {itemLoading && (
                        <Table.Tr><Table.Td colSpan={4}><Text size="sm" c="dimmed" ta="center" py="md">Loading items...</Text></Table.Td></Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* SUB-TAB 2: ITEM STOCK */}
            <Tabs.Panel value="stock" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Current Inventory Availability</Text>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Item ID</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Item Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Category</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Available Quantity</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Stock Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {itemAvailabilityData.map((item) => (
                        <Table.Tr key={item.itemId}>
                          <Table.Td><Text size="xs" fw={700}>{item.itemId}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{item.itemName}</Text></Table.Td>
                          <Table.Td><Text size="xs">{item.itemCategory}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={700}>{item.availableQuantity}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Badge size="xs" color={item.availableQuantity > 0 ? "teal" : "red"}>
                              {item.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}

                      {!itemLoading && itemAvailabilityData.length === 0 && (
                        <Table.Tr><Table.Td colSpan={5}><Text size="sm" c="dimmed" ta="center" py="md">No inventory availability data found.</Text></Table.Td></Table.Tr>
                      )}

                      {itemLoading && (
                        <Table.Tr><Table.Td colSpan={5}><Text size="sm" c="dimmed" ta="center" py="md">Loading stock availability...</Text></Table.Td></Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>
          </Tabs>

          {/* ADD / EDIT ITEM MODAL */}
          <Modal opened={itemFormOpened} onClose={() => setItemFormOpened(false)} title={editingItemId === null ? "Add Item" : "Edit Item"} centered size="md">
            <Stack gap="md">
              <TextInput label="Item Name" placeholder="Enter item name" value={itemName} onChange={(event) => setItemName(event.currentTarget.value)} required maxLength={255} />
              <TextInput label="Item Category" placeholder="Enter item category" value={itemCategory} onChange={(event) => setItemCategory(event.currentTarget.value)} required maxLength={255} />

              <Group justify="flex-end" mt="sm">
                <Button variant="default" onClick={() => setItemFormOpened(false)} disabled={itemSaving}>Cancel</Button>
                <Button color="indigo" onClick={handleSaveItem} loading={itemSaving}>{editingItemId === null ? "Create Item" : "Save Changes"}</Button>
              </Group>
            </Stack>
          </Modal>
        </Tabs.Panel>
      </Tabs>

      {/* ========================================================
          MODAL DRAWER LAYERS & CONFIGURATOR FORMS
          ======================================================== */}


      {/* ========================================================
          DRAWER 4: ITEM MASTER CREATE / EDIT FORM
          ======================================================== */}
      <Modal
        opened={itemFormOpened}
        onClose={() => setItemFormOpened(false)}
        title={editingItemId === null ? "Add Item" : "Edit Item"}
        centered
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Item Name"
            placeholder="Enter item name"
            value={itemName}
            onChange={(event) => setItemName(event.currentTarget.value)}
            required
            maxLength={255}
          />

          <TextInput
            label="Item Category"
            placeholder="Enter item category"
            value={itemCategory}
            onChange={(event) => setItemCategory(event.currentTarget.value)}
            required
            maxLength={255}
          />

          <Group justify="flex-end" mt="sm">
            <Button
              variant="default"
              onClick={() => setItemFormOpened(false)}
              disabled={itemSaving}
            >
              Cancel
            </Button>

            <Button
              color="indigo"
              onClick={handleSaveItem}
              loading={itemSaving}
            >
              {editingItemId === null ? "Create Item" : "Save Changes"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}