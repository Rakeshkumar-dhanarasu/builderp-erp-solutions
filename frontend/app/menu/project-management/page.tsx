"use client"
import React, { useEffect, useState } from 'react';
import {
  ActionIcon, Badge, Button, Container, Checkbox,
  Divider, Drawer, Grid, Group, Menu,
  Modal, MultiSelect, NumberInput, Timeline,
  Paper, Progress, RingProgress, Select,
  SimpleGrid, Skeleton, Stack, Table,
  Tabs, Text, Textarea, TextInput, Title
} from '@mantine/core';

import {
  IconAlertTriangle, IconArchive, IconBoxSeam,
  IconCalendar, IconCircleCheck, IconDotsVertical,
  IconEdit, IconEye, IconFilter, IconFolder,
  IconLockSquare, IconPlus, IconRefresh,
  IconReportMoney, IconSearch, IconTrack,
  IconUserPlus, IconPackage, IconSend, IconTrash
} from '@tabler/icons-react';

import {
  getAllProjects,
  getProjectDetails,
  createProject,
  getEmployees,
  getBudgetTracking,
  type BudgetTrackingResponse,
  type EmployeeLookupResponse,
  type ProjectListResponse,
  type ProjectDetailResponse
} from "@/services/projectService";

import {
  getAllQuotations,
  type QuotationListResponse,
} from "@/services/quotationService";

import {
  createPurchaseOrder,
  updateRejectedPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderDetails,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  getPurchaseOrderVendors,
  getPurchaseOrderItems,
  type PurchaseOrderSubmitRequest,
  type PurchaseOrderSummaryResponse,
  type PurchaseOrderDetailResponse,
  type VendorLookupResponse,
  type ItemLookupResponse,
  ProjectProgressTrackingResponse,
  getProjectProgress,
} from "@/services/purchaseOrderService";

import {
  getProgressAvailableForStockRequest,
  createStockAllocationRequest,
  type ProjectProgressItem,
  type CreateStockAllocationRequest,
} from "@/services/projectService";
import { notifications } from '@mantine/notifications';

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================
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

interface PoItemFormRow {
  itemId: string | null;
  quantity: number;
  unitPrice: number;
}

interface PoQuotationFormRow {
  vendorId: string | null;
  quotationAmount: number;
  receipt: string | null;
  receiptName: string;
  selected: boolean;
}

export default function ProjectManagementModule() {
  const [activeTab, setActiveTab] = useState<string | null>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [projectModalOpened, setprojectModalOpened] = useState<boolean>(false);
  const [modalMode, setmodalMode] = useState<'create' | 'edit'>('create');
  const [subcontractorModal, setSubcontractorModal] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectListResponse[]>([]);
  const [employees, setEmployees] = useState<EmployeeLookupResponse[]>([]);
  const [quotations, setQuotations] = useState<QuotationListResponse[]>([]);

  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [projectSaveLoading, setProjectSaveLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse | null>(null);
  const [projectDetailOpened, setProjectDetailOpened] = useState(false);
  const [projectProgress, setProjectProgress] =
    useState<ProjectProgressTrackingResponse | null>(null);

  const [projectProgressLoading, setProjectProgressLoading] =
    useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectManagerId, setProjectManagerId] = useState<string | null>(null);
  const [quotationSelection, setQuotationSelection] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [expectedEndDate, setExpectedEndDate] = useState("");

  const [createPOModalOpened, setCreatePOModalOpened] = useState(false);
  const [editingPoRequestId, setEditingPoRequestId] = useState<string | null>(null);
  const [purchaseOrderSaveLoading, setPurchaseOrderSaveLoading] = useState(false);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummaryResponse[]>([]);
  const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
  const [purchaseOrderActionLoading, setPurchaseOrderActionLoading] = useState(false);
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState<PurchaseOrderDetailResponse | null>(null);
  const [purchaseOrderDetailOpened, setPurchaseOrderDetailOpened] = useState(false);

  const [stockRequestProjectId, setStockRequestProjectId] = useState("");
  const [stockRequestProgress, setStockRequestProgress] = useState<ProjectProgressItem[]>([]);
  const [stockRequestProgressId, setStockRequestProgressId] = useState<string | null>(null);
  const [stockRequestItems, setStockRequestItems] = useState<{ itemId: string | null; requestedQuantity: number | string }[]>([{ itemId: null, requestedQuantity: 1 }]);
  const [stockRequestLoading, setStockRequestLoading] = useState(false);
  const [stockRequestSubmitting, setStockRequestSubmitting] = useState(false);

  const [poVendors, setPoVendors] = useState<VendorLookupResponse[]>([]);
  const [poItems, setPoItems] = useState<ItemLookupResponse[]>([]);
  const [poLookupsLoading, setPoLookupsLoading] = useState(false);

  const [poFormProjectId, setPoFormProjectId] = useState<string | null>(null);
  const [poProjectDetail, setPoProjectDetail] = useState<ProjectDetailResponse | null>(null);
  const [poProjectDetailLoading, setPoProjectDetailLoading] = useState(false);

  const [budgetTracking, setBudgetTracking] = useState<BudgetTrackingResponse | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetProjectId, setBudgetProjectId] = useState<string | null>(null);

  const [poFormItems, setPoFormItems] = useState<PoItemFormRow[]>([
    { itemId: null, quantity: 1, unitPrice: 0 },
  ]);

  const [poFormQuotations, setPoFormQuotations] = useState<PoQuotationFormRow[]>([
    {
      vendorId: null,
      quotationAmount: 0,
      receipt: null,
      receiptName: "",
      selected: true,
    },
  ]);

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId("");
      return;
    }

    const selectedProjectExists = projects.some(
      (project) => project.projectId === selectedProjectId
    );

    if (!selectedProjectExists) {
      setSelectedProjectId(projects[0].projectId);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {loadProjectListData();}, []);

  useEffect(() => {
    if (activeTab !== "tracking" || !selectedProjectId) {
      return;
    }

    let cancelled = false;

    const loadProgress = async () => {
      try {
        setProjectProgressLoading(true);

        const response = await getProjectProgress(selectedProjectId);

        if (!cancelled) {
          setProjectProgress(response);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load project progress:", error);
          setProjectProgress(null);
          window.alert("Unable to load project progress.");
        }
      } finally {
        if (!cancelled) {
          setProjectProgressLoading(false);
        }
      }
    };

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedProjectId]);

  const loadStockRequestItems = async () => {
    if (poItems.length > 0) return;

    try {
      setPoLookupsLoading(true);
      const itemData = await getPurchaseOrderItems();
      setPoItems(itemData);
    } catch (error) {
      console.error("Failed to load inventory items for stock request:", error);
      window.alert("Unable to load inventory items.");
    } finally {
      setPoLookupsLoading(false);
    }
  };

  const loadStockRequestProgress = async (projectId: string) => {
    if (!projectId) {
      setStockRequestProgress([]);
      setStockRequestProgressId(null);
      return;
    }

    try {
      setStockRequestLoading(true);
      setStockRequestProgressId(null);

      const progressData = await getProgressAvailableForStockRequest(projectId);
      setStockRequestProgress(progressData);
    } catch (error) {
      console.error("Failed to load eligible sub-tasks:", error);
      setStockRequestProgress([]);
      window.alert("Unable to load eligible sub-tasks for this project.");
    } finally {
      setStockRequestLoading(false);
    }
  };

  useEffect(() => {
    if (projects.length === 0) {
      setStockRequestProjectId("");
      setStockRequestProgress([]);
      setStockRequestProgressId(null);
      return;
    }

  const projectExists = projects.some(
      (project) => project.projectId === stockRequestProjectId
    );

    if (!projectExists) {
      setStockRequestProjectId(projects[0].projectId);
    }
  }, [projects, stockRequestProjectId]);

  useEffect(() => {
    if (activeTab !== "stock-request") return;

    void loadStockRequestItems();
    void loadStockRequestProgress(stockRequestProjectId);
  }, [activeTab, stockRequestProjectId]);

  const loadProjectListData = async () => {
    try {
      setProjectsLoading(true);

      const [projectData, employeeData, quotationData] =
        await Promise.all([
          getAllProjects(),
          getEmployees(),
          getAllQuotations(),
        ]);

      setProjects(projectData);
      setEmployees(employeeData);
      setQuotations(quotationData);
    } catch (error) {
      console.error("Failed to load project list data:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleSubmitStockRequest = async () => {
    const selectedProgress = stockRequestProgress.find(
      (item) => item.projectProgressId === Number(stockRequestProgressId)
    );

    if (!stockRequestProjectId || !selectedProgress) {
      window.alert("Please select a project and eligible sub-task.");
      return;
    }

    if (stockRequestItems.length === 0) {
      window.alert("Please add at least one material item.");
      return;
    }

    const items = stockRequestItems.map((item) => ({
      itemId: Number(item.itemId),
      requestedQuantity: Number(item.requestedQuantity),
    }));

    if (
      items.some(
        (item, index) =>
          !stockRequestItems[index].itemId ||
          !Number.isInteger(item.itemId) ||
          item.itemId <= 0 ||
          !Number.isInteger(item.requestedQuantity) ||
          item.requestedQuantity <= 0
      )
    ) {
      window.alert("Select an item and enter a positive whole-number quantity for every material line.");
      return;
    }

    if (new Set(items.map((item) => item.itemId)).size !== items.length) {
      window.alert("Each inventory item can only be added once.");
      return;
    }

    const request: CreateStockAllocationRequest = {
      projectId: stockRequestProjectId,
      projectProgressId: selectedProgress.projectProgressId,
      items,
    };

    try {
      setStockRequestSubmitting(true);
      await createStockAllocationRequest(request);

      window.alert("Stock request submitted successfully.");

      setStockRequestProgressId(null);
      setStockRequestItems([{ itemId: null, requestedQuantity: 1 }]);

      await loadStockRequestProgress(stockRequestProjectId);
    } catch (error) {
      console.error("Failed to submit stock request:", error);
      window.alert("Unable to submit the stock request. Please check the entered details and try again.");
    } finally {
      setStockRequestSubmitting(false);
    }
  };

  
  const loadBudgetTracking = async (projectId: string) => {
    try {
      setBudgetLoading(true);
      setBudgetTracking(null);

      const project = await getProjectDetails(projectId);
      const tracking = await getBudgetTracking(project.quotationId);

      setBudgetTracking(tracking);
    } catch (error) {
      console.error("Failed to load budget tracking:", error);
      setBudgetTracking(null);
      notifications.show({
        title: "Error",
        message: "Failed to load budget tracking details.",
        color: "red",
      });
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (
      !projectName.trim() ||
      !projectManagerId ||
      !quotationSelection ||
      !startDate ||
      !expectedEndDate
    ) {
      return;
    }

    if (expectedEndDate < startDate) {
      return;
    }

    const [quotationId, quotationVersion] = quotationSelection.split("|");

    try {
      setProjectSaveLoading(true);

      await createProject({
        projectName: projectName.trim(),
        projectManagerId: Number(projectManagerId),
        quotationId,
        quotationVersion: Number(quotationVersion),
        startDate,
        expectedEndDate,
      });

      await loadProjectListData();

      setprojectModalOpened(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setProjectSaveLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "purchase-orders") {
      loadPurchaseOrders();
    }
  }, [activeTab]);

  const loadPurchaseOrders = async () => {
    try {
      setPurchaseOrdersLoading(true);
      const data = await getAllPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Failed to load purchase orders:", error);
      window.alert("Unable to load purchase orders.");
    } finally {
      setPurchaseOrdersLoading(false);
    }
  };

  const loadPoLookups = async () => {
    try {
      setPoLookupsLoading(true);

      const [vendorData, itemData] = await Promise.all([
        getPurchaseOrderVendors(),
        getPurchaseOrderItems(),
      ]);

      setPoVendors(vendorData);
      setPoItems(itemData);
    } catch (error) {
      console.error("Failed to load PO lookup data:", error);
      window.alert("Unable to load vendors or inventory items.");
    } finally {
      setPoLookupsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "purchase-orders") {
      void loadPurchaseOrders();
      void loadPoLookups();
    }
  }, [activeTab]);

  const handlePurchaseOrderAction = async (
    poRequestId: string,
    action: "approve" | "reject"
  ) => {
    const actionLabel = action === "approve" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${actionLabel} PO ${poRequestId}?`)) {
      return;
    }

    try {
      setPurchaseOrderActionLoading(true);

      const updatedDetail =
        action === "approve"
          ? await approvePurchaseOrder(poRequestId)
          : await rejectPurchaseOrder(poRequestId);

      if (
        purchaseOrderDetailOpened &&
        purchaseOrderDetail?.poRequestId === poRequestId
      ) {
        setPurchaseOrderDetail(updatedDetail);
      }

      await loadPurchaseOrders();

      window.alert(`Purchase order ${actionLabel}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${actionLabel} purchase order:`, error);
      window.alert(`Unable to ${actionLabel} the purchase order.`);
    } finally {
      setPurchaseOrderActionLoading(false);
    }
  };

  const employeeOptions = employees.map((employee) => ({
    value: String(employee.employeeId),
    label: employee.employeeName,
  }));

  const quotationOptions = quotations
    .filter((quotation) => quotation.quoteStatus === "Approved")
    .map((quotation) => ({
      value: `${quotation.quotationId}|${quotation.versionNumber}`,
      label: `${quotation.quotationId} — ${quotation.customer} — Version ${quotation.versionNumber}`,
  }));

  const triggerStateRefresh = (targetTab: string | null) => {
    setActiveTab(targetTab);
    setIsLoading(true);
    const delay = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(delay);
  };

  const handleOpenCreateModal = () => {
    setmodalMode('create');
    setprojectModalOpened(true);
  };

  const handleOpenEditModal = (projId: string) => {
    setSelectedProjectId(projId);
    setmodalMode('edit');
    setprojectModalOpened(true);
  };

  const resetPoForm = () => {
    setEditingPoRequestId(null);
    setPoFormProjectId(null);
    setPoProjectDetail(null);

    setPoFormItems([
      { itemId: null, quantity: 1, unitPrice: 0 },
    ]);

    setPoFormQuotations([
      {
        vendorId: null,
        quotationAmount: 0,
        receipt: null,
        receiptName: "",
        selected: true,
      },
    ]);
  };

  const handleOpenCreatePOModal = async () => {
    resetPoForm();
    setCreatePOModalOpened(true);

    if (poVendors.length === 0 || poItems.length === 0) {
      await loadPoLookups();
    }
  };

  const handleCloseCreatePOModal = () => {
    if (purchaseOrderSaveLoading) return;

    setCreatePOModalOpened(false);
    resetPoForm();
  };

  const getEmployeeName = (employeeId: number) => {
    return employees.find(
      (employee) => employee.employeeId === employeeId
    )?.employeeName ?? "Unknown";
  };

  const handleViewProject = async (projectId: string) => {
    try {
      setProjectDetailsLoading(true);
      setProjectDetailOpened(true);

      const response = await getProjectDetails(projectId);

      setProjectDetail(response);
    } catch (error) {
      console.error("Failed to load project details:", error);
      setProjectDetail(null);
    } finally {
      setProjectDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "tracking" || !selectedProjectId) {
      setProjectProgress(null);
      return;
    }

    let cancelled = false;

    const loadProjectProgress = async () => {
      try {
        setProjectProgressLoading(true);

        const response = await getProjectProgress(selectedProjectId);

        if (!cancelled) {
          setProjectProgress(response);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load project progress:", error);
          setProjectProgress(null);
          window.alert("Unable to load project progress.");
        }
      } finally {
        if (!cancelled) {
          setProjectProgressLoading(false);
        }
      }
    };

    void loadProjectProgress();

    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedProjectId]);

  const handlePoProjectChange = async (projectId: string | null) => {
    setPoFormProjectId(projectId);
    setPoProjectDetail(null);

    if (!projectId) return;

    const project = projects.find(
      (item) => item.projectId === projectId
    );

    if (!project || !["Initiated", "In Progress"].includes(project.status)) {
      window.alert("Select a project with status Initiated or In Progress.");
      setPoFormProjectId(null);
      return;
    }

    try {
      setPoProjectDetailLoading(true);

      const detail = await getProjectDetails(projectId);

      setPoProjectDetail(detail);
    } catch (error) {
      console.error("Failed to load project for PO:", error);
      window.alert("Unable to load the selected project's details.");
      setPoFormProjectId(null);
      setPoProjectDetail(null);
    } finally {
      setPoProjectDetailLoading(false);
    }
  };

  const handleAddPoItem = () => {
    setPoFormItems((current) => [
      ...current,
      { itemId: null, quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemovePoItem = (index: number) => {
    setPoFormItems((current) =>
      current.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const handlePoItemChange = (
    index: number,
    field: keyof PoItemFormRow,
    value: string | number | null
  ) => {
    setPoFormItems((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const handleAddPoQuotation = () => {
    setPoFormQuotations((current) => [
      ...current,
      {
        vendorId: null,
        quotationAmount: 0,
        receipt: null,
        receiptName: "",
        selected: false,
      },
    ]);
  };

  const handleRemovePoQuotation = (index: number) => {
    setPoFormQuotations((current) => {
      const updated = current.filter(
        (_, rowIndex) => rowIndex !== index
      );

      if (updated.length > 0 && !updated.some((row) => row.selected)) {
        updated[0] = { ...updated[0], selected: true };
      }

      return updated;
    });
  };

  const handlePoQuotationChange = (
    index: number,
    field: keyof PoQuotationFormRow,
    value: string | number | boolean | null
  ) => {
    setPoFormQuotations((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const handlePreferredQuotationChange = (index: number) => {
    setPoFormQuotations((current) =>
      current.map((row, rowIndex) => ({
        ...row,
        selected: rowIndex === index,
      }))
    );
  };

  const handlePoReceiptChange = (
    index: number,
    file: File | null
  ) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        window.alert("Unable to read the receipt file.");
        return;
      }

      const base64 = result.split(",")[1];

      if (!base64) {
        window.alert("Invalid receipt file.");
        return;
      }

      setPoFormQuotations((current) =>
        current.map((row, rowIndex) =>
          rowIndex === index
            ? {
                ...row,
                receipt: base64,
                receiptName: file.name,
              }
            : row
        )
      );
    };

    reader.onerror = () => {
      window.alert("Failed to read the receipt file.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmitPurchaseOrder = async () => {
    if (!poFormProjectId) {
      window.alert("Please select a project.");
      return;
    }

    if (!poProjectDetail) {
      window.alert("Wait for the selected project's details to load.");
      return;
    }

    if (
      !["Initiated", "In Progress"].includes(poProjectDetail.status)
    ) {
      window.alert("The selected project is not eligible for a PO.");
      return;
    }

    if (poFormItems.length === 0) {
      window.alert("Add at least one project item.");
      return;
    }

    const invalidItem = poFormItems.some(
      (item) =>
        !item.itemId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice <= 0
    );

    if (invalidItem) {
      window.alert(
        "Every item needs an inventory item, a positive whole-number quantity, and a unit price greater than zero."
      );
      return;
    }

    if (poFormQuotations.length === 0) {
      window.alert("Add at least one vendor quotation.");
      return;
    }

    const invalidQuotation = poFormQuotations.some(
      (quotation) =>
        !quotation.vendorId ||
        !Number.isFinite(quotation.quotationAmount) ||
        quotation.quotationAmount <= 0
    );

    if (invalidQuotation) {
      window.alert(
        "Every vendor quotation needs a vendor and an amount greater than zero."
      );
      return;
    }

    const vendorIds = poFormQuotations.map(
      (quotation) => Number(quotation.vendorId)
    );

    if (new Set(vendorIds).size !== vendorIds.length) {
      window.alert("Each vendor can be added only once per PO.");
      return;
    }

    const selectedCount = poFormQuotations.filter(
      (quotation) => quotation.selected
    ).length;

    if (selectedCount !== 1) {
      window.alert("Select exactly one preferred vendor quotation.");
      return;
    }

    const request: PurchaseOrderSubmitRequest = {
      projectId: poFormProjectId,
      items: poFormItems.map((item) => ({
        itemId: Number(item.itemId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      quotations: poFormQuotations.map((quotation) => ({
        vendorId: Number(quotation.vendorId),
        quotationAmount: quotation.quotationAmount,
        receipt: quotation.receipt,
        selected: quotation.selected,
      })),
    };

    try {
      setPurchaseOrderSaveLoading(true);

      if (editingPoRequestId) {
        await updateRejectedPurchaseOrder(
          editingPoRequestId,
          request
        );
      } else {
        await createPurchaseOrder(request);
      }

      await loadPurchaseOrders();

      setCreatePOModalOpened(false);
      resetPoForm();

      window.alert(
        editingPoRequestId
          ? "Purchase order resubmitted successfully."
          : "Purchase order submitted successfully."
      );
    } catch (error) {
      console.error("Failed to submit purchase order:", error);
      window.alert(
        "Unable to submit the purchase order. Please check the form and try again."
      );
    } finally {
      setPurchaseOrderSaveLoading(false);
    }
  };

  const handleViewPurchaseOrder = async (poRequestId: string) => {
    setPurchaseOrderDetailOpened(true);
    setPurchaseOrderDetail(null);

    try {
      const detail = await getPurchaseOrderDetails(poRequestId);
      setPurchaseOrderDetail(detail);
    } catch (error) {
      console.error("Failed to load purchase order details:", error);
      window.alert("Unable to load purchase order details.");
    }
  };

  const handleEditRejectedPurchaseOrder = async (
    poRequestId: string
  ) => {
    try {
      const detail = await getPurchaseOrderDetails(poRequestId);

      if (detail.status !== "Rejected") {
        window.alert("Only rejected purchase orders can be edited.");
        return;
      }

      setEditingPoRequestId(poRequestId);
      setPoFormProjectId(detail.projectId);

      setPoFormItems(
        detail.items.map((item) => ({
          itemId: String(item.itemId),
          quantity: item.itemQuantity,
          unitPrice: Number(item.itemUnitPrice),
        }))
      );

      const quotationRows: PoQuotationFormRow[] =
        detail.quotations.map((quotation) => ({
          vendorId: String(quotation.vendorId),
          quotationAmount: Number(quotation.quotationAmount),
          receipt: quotation.receiptAttached,
          receiptName: quotation.receiptAttached
            ? "Previously attached receipt"
            : "",
          selected: quotation.status === "Selected",
        }));

      if (
        quotationRows.length > 0 &&
        !quotationRows.some((quotation) => quotation.selected)
      ) {
        quotationRows[0].selected = true;
      }

      setPoFormQuotations(quotationRows);

      setPoProjectDetailLoading(true);

      try {
        const project = await getProjectDetails(detail.projectId);
        setPoProjectDetail(project);
      } finally {
        setPoProjectDetailLoading(false);
      }

      setPurchaseOrderDetailOpened(false);
      setCreatePOModalOpened(true);

      if (poVendors.length === 0 || poItems.length === 0) {
        await loadPoLookups();
      }
    } catch (error) {
      console.error("Failed to load rejected purchase order:", error);
      window.alert("Unable to load the rejected purchase order for editing.");
    }
  };

  const selectedProject = projects.find((project) => project.projectId === selectedProjectId) ?? null;

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

  const getProgressStatusLabel = (status: number): string => {
    switch (status) {
      case 9:
        return "Initiated";
      case 10:
        return "In Progress";
      case 11:
        return "Delayed";
      case 12:
        return "On Hold";
      case 13:
        return "Completed";
      default:
        return `Status ${status}`;
    }
  };

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      
      {/* ====================================================================
          1. HEADER WRAPPER PAPER (Matching your exact header structure)
         ==================================================================== */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2} className="enterprise-title">Project Lifecycle Engine</Title>
            <Text size="sm" c="dimmed">Track physical lifecycles, budget parameters, inventory drawdowns, and progress.</Text>
          </Stack>
        </Group>
      </Paper>

      {/* ====================================================================
          2. MODULE TABS (Variant: pills, radius: md, mb: lg)
         ==================================================================== */}
      <Tabs value={activeTab} onChange={triggerStateRefresh} color='brandOrange'variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="projects" leftSection={<IconFolder size={16} />}>Project List</Tabs.Tab>
          <Tabs.Tab value="purchase-orders" leftSection={<IconBoxSeam size={16} />}>Purchase Orders</Tabs.Tab>
          <Tabs.Tab value="stock-request" leftSection={<IconPackage size={16} />}>Stock Request</Tabs.Tab>
          <Tabs.Tab value="budget" leftSection={<IconReportMoney size={16} />}>Budget Tracking</Tabs.Tab>
          <Tabs.Tab value="tracking" leftSection={<IconTrack size={16} />}>Project Tracking</Tabs.Tab>
        </Tabs.List>

        {/* ==========================================
            TAB 1: PROJECTS MODULE
           ========================================== */}
        <Tabs.Panel value="projects">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Projects Engine</Title>
                <Text size="sm" c="dimmed">Manage active project profiles, assign project managers, and oversee timelines.</Text>
              </Stack>
              <Button 
                size="sm"
                color='brandOrange'
                leftSection={<IconPlus size={16} />} 
                onClick={handleOpenCreateModal}
              >
                Create Project
              </Button>
            </Group>
          </Paper>

          <Stack gap="md">
            {/* Filters */}
            <Paper p="sm" radius="md" withBorder>
              <Grid gap="sm" align="flex-end">
                {/* Col 1: Search */}
                <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                  <TextInput
                    label="Choose Project" 
                    placeholder="Search projects..." 
                    leftSection={<IconSearch size={16} />} 
                    size="sm" 
                  />
                </Grid.Col>

                {/* Col 2: Status MultiSelect */}
                <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                  <MultiSelect
                    label='Status' 
                    placeholder="Project Status" 
                    data={['Not Started', 'In Progress', 'Completed', 'Delayed']} 
                    size="sm" 
                  />
                </Grid.Col>

                {/* Col 3: Customer Select */}
                <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                  <Select 
                    label='Choose Customer'
                    placeholder="Customer" 
                    data={['Phoenix Infra Corp', 'Nexus Living Spaces']} 
                    clearable 
                    size="sm" 
                  />
                </Grid.Col>

                {/* Col 4: Date Range (Stacked together in 1 column) */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3.2 }}>
                  <Grid gap="xs">
                    <Grid.Col span={6}>
                      <TextInput 
                        label='Starting Date'
                        type="date" 
                        placeholder="From" 
                        leftSection={<IconCalendar size={14} />} 
                        size="sm" 
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput 
                        label='Ending Date'
                        type="date" 
                        placeholder="To" 
                        leftSection={<IconCalendar size={14} />} 
                        size="sm" 
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>

                {/* Col 5: Action Button */}
                <Grid.Col span={{ base: 12, sm: 6, md: 1.6 }}>
                  <Button 
                    fullWidth 
                    variant="light" 
                    color="brandOrange" 
                    leftSection={<IconFilter size={14} />} 
                    size="xs"
                  >
                    Filter
                  </Button>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Table */}
            <Paper p="md" radius="md" withBorder>
              {isLoading ? (
                <Stack gap="xs">
                  <Skeleton height={32} radius="xs" />
                  <Skeleton height={28} radius="xs" />
                  <Skeleton height={28} radius="xs" />
                </Stack>
              ) : (
                <Table.ScrollContainer minWidth={900}>
                  <Table variant="simple" highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Project Name</Table.Th>
                        <Table.Th>Customer</Table.Th>
                        <Table.Th>Budget Allocated</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                        <Table.Th style={{ width: 50 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {projects.map((project) => (
                        <Table.Tr key={project.projectId}>
                          <Table.Td>
                            <Text fw={500}>{project.projectName}</Text>
                            <Text size="xs" c="dimmed">{project.projectId}</Text>
                          </Table.Td>

                          <Table.Td>{project.customer}</Table.Td>

                          <Table.Td>
                            {project.budgetAllocated.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Table.Td>

                          <Table.Td>
                            <Badge>{project.status}</Badge>
                          </Table.Td>

                          <Table.Td>
                            <Menu shadow="md" width={180}>
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDotsVertical size={18} />
                                </ActionIcon>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEye size={16} />} onClick={() => handleViewProject(project.projectId)}>
                                  View Project
                                </Menu.Item>
                                <Menu.Item leftSection={<IconEdit size={16} />} disabled>
                                  Edit Project
                                </Menu.Item>
                                <Menu.Item leftSection={<IconArchive size={16} />} disabled>
                                  Archive Project
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              )}

              <Divider my="sm" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Showing {projects.length} project{projects.length === 1 ? "" : "s"}
                </Text>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* ==========================================
            TAB 2: PURCHASE ORDERS
          ========================================== */}
        <Tabs.Panel value="purchase-orders">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Purchase Orders</Title>
                <Text size="sm" c="dimmed">
                  Create purchase requests for approved projects and review submitted purchase orders.
                </Text>
              </Stack>

              <Group>
                <Button
                  size="sm"
                  variant="default"
                  leftSection={<IconRefresh size={16} />}
                  loading={purchaseOrdersLoading}
                  onClick={() => void loadPurchaseOrders()}
                >
                  Refresh
                </Button>

                <Button
                  size="sm"
                  color="brandOrange"
                  leftSection={<IconPlus size={16} />}
                  onClick={handleOpenCreatePOModal}
                >
                  Create Purchase Order
                </Button>
              </Group>
            </Group>
          </Paper>

          <Paper p="md" radius="md" withBorder>
            {purchaseOrdersLoading ? (
              <Stack gap="xs">
                <Skeleton height={36} />
                <Skeleton height={32} />
                <Skeleton height={32} />
              </Stack>
            ) : (
              <Table.ScrollContainer minWidth={850}>
                <Table highlightOnHover verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>PO Request ID</Table.Th>
                      <Table.Th>Project ID</Table.Th>
                      <Table.Th>Submitted Date</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {purchaseOrders.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Text c="dimmed" ta="center" py="lg">
                            No purchase orders found. Select Create Purchase Order to start.
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      purchaseOrders.map((po) => (
                        <Table.Tr key={po.poRequestId}>
                          <Table.Td>
                            <Text fw={500}>{po.poRequestId}</Text>
                          </Table.Td>

                          <Table.Td>{po.projectId}</Table.Td>

                          <Table.Td>
                            {po.createdAt
                              ? new Date(po.createdAt).toLocaleDateString()
                              : "—"}
                          </Table.Td>

                          <Table.Td>
                            {renderStatusBadge(po.status)}
                          </Table.Td>

                          <Table.Td>
                            <Group gap="xs" wrap="nowrap">
                              <Button
                                size="xs"
                                variant="light"
                                leftSection={<IconEye size={14} />}
                                onClick={() =>
                                  void handleViewPurchaseOrder(po.poRequestId)
                                }
                              >
                                View
                              </Button>

                              {po.status === "Submitted" && (
                                <>
                                  <Button
                                    size="xs"
                                    color="green"
                                    loading={purchaseOrderActionLoading}
                                    onClick={() =>
                                      void handlePurchaseOrderAction(
                                        po.poRequestId,
                                        "approve"
                                      )
                                    }
                                  >
                                    Approve
                                  </Button>

                                  <Button
                                    size="xs"
                                    color="red"
                                    variant="light"
                                    loading={purchaseOrderActionLoading}
                                    onClick={() =>
                                      void handlePurchaseOrderAction(
                                        po.poRequestId,
                                        "reject"
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}

                              {po.status === "Rejected" && (
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="orange"
                                  leftSection={<IconEdit size={14} />}
                                  onClick={() =>
                                    void handleEditRejectedPurchaseOrder(
                                      po.poRequestId
                                    )
                                  }
                                >
                                  Edit and Resubmit
                                </Button>
                              )}
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}

            <Divider my="sm" />

            <Text size="sm" c="dimmed">
              Showing {purchaseOrders.length} purchase order
              {purchaseOrders.length === 1 ? "" : "s"}
            </Text>
          </Paper>
        </Tabs.Panel>

        {/* ==========================================
            TAB 3: STOCK REQUEST
           ========================================== */}

        <Tabs.Panel value="stock-request">
          <Stack gap="md">
            <Paper p="md" radius="md" withBorder>
              <Title order={4}>Stock Request</Title>
              <Text size="sm" c="dimmed" mt={4}>
                Request inventory materials for eligible project sub-tasks.
                Stock is deducted only when Inventory allocates the request.
              </Text>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Stack gap="md">
                <Select
                  label="Project"
                  placeholder="Select a project"
                  data={projects.map((project) => ({
                    value: project.projectId,
                    label: `${project.projectName} (${project.projectId})`,
                  }))}
                  value={stockRequestProjectId || null}
                  onChange={(value) => {
                    setStockRequestProjectId(value ?? "");
                    setStockRequestProgressId(null);
                  }}
                  searchable
                  disabled={projectsLoading || projects.length === 0 || stockRequestSubmitting}
                  required
                />

                <Select
                  label="Eligible Sub-task"
                  placeholder={
                    stockRequestLoading
                      ? "Loading eligible sub-tasks..."
                      : "Select a sub-task"
                  }
                  data={stockRequestProgress.map((item) => ({
                    value: String(item.projectProgressId),
                    label: `${item.taskName} / ${item.subTaskName} — Remaining: ${item.remainingWorkQuantity}`,
                  }))}
                  value={stockRequestProgressId}
                  onChange={(value) => {
                    setStockRequestProgressId(value);
                  }}
                  searchable
                  disabled={
                    stockRequestLoading ||
                    stockRequestProgress.length === 0 ||
                    stockRequestSubmitting
                  }
                  required
                />

                {stockRequestProjectId &&
                  !stockRequestLoading &&
                  stockRequestProgress.length === 0 && (
                    <Text size="sm" c="dimmed">
                      No eligible sub-tasks are currently available for stock requests.
                    </Text>
                  )}

                {stockRequestProgressId && (() => {
                  const selectedProgress = stockRequestProgress.find(
                    (item) => item.projectProgressId === Number(stockRequestProgressId)
                  );

                  if (!selectedProgress) return null;

                  return (
                    <Paper p="sm" radius="md" withBorder>
                      <Grid>
                        <Grid.Col span={{ base: 6, sm: 3 }}>
                          <Text size="xs" c="dimmed">Target Quantity</Text>
                          <Text fw={600}>{selectedProgress.targetQuantity}</Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, sm: 3 }}>
                          <Text size="xs" c="dimmed">Completed</Text>
                          <Text fw={600}>{selectedProgress.quantityCompleted}</Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, sm: 3 }}>
                          <Text size="xs" c="dimmed">Pending Work</Text>
                          <Text fw={600}>{selectedProgress.pendingWorkQuantity}</Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, sm: 3 }}>
                          <Text size="xs" c="dimmed">Remaining Work</Text>
                          <Text fw={600}>{selectedProgress.remainingWorkQuantity}</Text>
                        </Grid.Col>
                      </Grid>
                    </Paper>
                  );
                })()}
              </Stack>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" align="center" mb="md">
                <Stack gap={2}>
                  <Text fw={600}>Requested Materials</Text>
                  <Text size="sm" c="dimmed">
                    Select the inventory items and the quantities required.
                  </Text>
                </Stack>

                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() =>
                    setStockRequestItems((current) => [
                      ...current,
                      { itemId: null, requestedQuantity: 1 },
                    ])
                  }
                  disabled={poLookupsLoading || stockRequestSubmitting}
                >
                  Add Item
                </Button>
              </Group>

              {poLookupsLoading ? (
                <Text size="sm" c="dimmed">Loading inventory items...</Text>
              ) : poItems.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No inventory items are available. Please check the inventory item lookup.
                </Text>
              ) : (
                <Stack gap="sm">
                  {stockRequestItems.map((line, index) => (
                    <Grid key={index} align="end">
                      <Grid.Col span={{ base: 12, sm: 7 }}>
                        <Select
                          label={index === 0 ? "Inventory Item" : undefined}
                          placeholder="Select an item"
                          data={poItems
                            .filter((item) =>
                              !stockRequestItems.some(
                                (other, otherIndex) =>
                                  otherIndex !== index &&
                                  other.itemId === String(item.itemId)
                              )
                            )
                            .map((item) => ({
                              value: String(item.itemId),
                              label: `${item.itemName} (${item.itemCategory})`,
                            }))}
                          value={line.itemId}
                          onChange={(value) =>
                            setStockRequestItems((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, itemId: value }
                                  : item
                              )
                            )
                          }
                          searchable
                          required
                          disabled={stockRequestSubmitting}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 8, sm: 3 }}>
                        <NumberInput
                          label={index === 0 ? "Requested Quantity" : undefined}
                          value={line.requestedQuantity}
                          onChange={(value) =>
                            setStockRequestItems((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, requestedQuantity: value }
                                  : item
                              )
                            )
                          }
                          min={1}
                          allowDecimal={false}
                          required
                          disabled={stockRequestSubmitting}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 4, sm: 2 }}>
                        <Button
                          color="red"
                          variant="subtle"
                          fullWidth
                          leftSection={<IconTrash size={16} />}
                          onClick={() =>
                            setStockRequestItems((current) =>
                              current.filter((_, itemIndex) => itemIndex !== index)
                            )
                          }
                          disabled={
                            stockRequestSubmitting ||
                            stockRequestItems.length === 1
                          }
                        >
                          Remove
                        </Button>
                      </Grid.Col>
                    </Grid>
                  ))}
                </Stack>
              )}

              <Divider my="md" />

              <Group justify="flex-end">
                <Button
                  onClick={() => void handleSubmitStockRequest()}
                  loading={stockRequestSubmitting}
                  disabled={
                    !stockRequestProjectId ||
                    !stockRequestProgressId ||
                    stockRequestLoading ||
                    poLookupsLoading ||
                    poItems.length === 0
                  }
                  leftSection={<IconSend size={16} />}
                >
                  Submit Stock Request
                </Button>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* ==========================================
            TAB 4: BUDGET TRACKING
           ========================================== */}       
        <Tabs.Panel value="budget">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Budget Tracking Engine</Title>
                <Text size="sm" c="dimmed">
                  Monitor category budget consumption, remaining balances, and transaction history.
                </Text>
              </Stack>
              <Button
                size="sm"
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {
                  if (budgetProjectId) {
                    void loadBudgetTracking(budgetProjectId);
                  }
                }}
                disabled={!budgetProjectId || budgetLoading}
                loading={budgetLoading}
              >
                Sync Financials
              </Button>
            </Group>
          </Paper>

          <Stack gap="md">
            <Paper p="md" radius="md" withBorder>
              <Select
                label="Project"
                placeholder="Select a project to view budget tracking"
                data={projects.map((project) => ({
                  value: project.projectId,
                  label: `${project.projectName} — ${project.customer}`,
                }))}
                value={budgetProjectId}
                onChange={(value) => {
                  setBudgetProjectId(value);
                  setBudgetTracking(null);

                  if (value) {
                    void loadBudgetTracking(value);
                  }
                }}
                searchable
                clearable
                disabled={budgetLoading}
              />
            </Paper>

            {budgetLoading ? (
              <Stack gap="xs">
                <Skeleton height={100} />
                <Skeleton height={180} />
                <Skeleton height={220} />
              </Stack>
            ) : !budgetProjectId ? (
              <Paper p="xl" radius="md" withBorder>
                <Text size="sm" c="dimmed" ta="center">
                  Select a project to view its budget tracking details.
                </Text>
              </Paper>
            ) : !budgetTracking ? (
              <Paper p="xl" radius="md" withBorder>
                <Text size="sm" c="dimmed" ta="center">
                  Budget tracking details are unavailable for this project.
                </Text>
              </Paper>
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">
                      TOTAL CATEGORY BUDGET
                    </Text>
                    <Text size="lg" fw={700} my={4}>
                      OMR {Number(budgetTracking.totalCategoryAllocated).toLocaleString("en-OM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Total allocated across the five categories
                    </Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">
                      AMOUNT USED
                    </Text>
                    <Text size="lg" fw={700} my={4} c="red">
                      OMR {Number(budgetTracking.totalCategoryUsed).toLocaleString("en-OM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Allocated minus remaining category balances
                    </Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">
                      REMAINING CATEGORY BUDGET
                    </Text>
                    <Text size="lg" fw={700} my={4} c="teal">
                      OMR {Number(budgetTracking.totalCategoryRemaining).toLocaleString("en-OM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Available balance across all categories
                    </Text>
                  </Paper>
                </SimpleGrid>

                <Paper p="md" radius="md" withBorder>
                  <Text fw={600} size="sm" mb="md">
                    Category Budget Breakdown
                  </Text>

                  <Table.ScrollContainer minWidth={650}>
                    <Table striped highlightOnHover verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Category</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Allocated</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Used</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Remaining</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {budgetTracking.categories.map((category) => (
                          <Table.Tr key={category.category}>
                            <Table.Td>
                              <Text size="sm" fw={500}>
                                {category.category
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                              </Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "right" }}>
                              <Text size="sm">
                                OMR {Number(category.allocated).toLocaleString("en-OM", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "right" }}>
                              <Text size="sm" c={category.used > 0 ? "red" : undefined}>
                                OMR {Number(category.used).toLocaleString("en-OM", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "right" }}>
                              <Text size="sm" c="teal">
                                OMR {Number(category.remaining).toLocaleString("en-OM", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                  <Text fw={600} size="sm" mb="sm">
                    Budget Transactions
                  </Text>

                  <Table.ScrollContainer minWidth={850}>
                    <Table striped highlightOnHover verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Category</Table.Th>
                          <Table.Th>Transaction Type</Table.Th>
                          <Table.Th>Reference</Table.Th>
                          <Table.Th>Description</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Amount Change</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {budgetTracking.transactions.length === 0 ? (
                          <Table.Tr>
                            <Table.Td colSpan={6}>
                              <Text size="sm" c="dimmed" ta="center" py="md">
                                No budget transactions have been recorded for this project.
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        ) : (
                          budgetTracking.transactions.map((transaction) => (
                            <Table.Tr key={transaction.budgetTransactionId}>
                              <Table.Td>
                                <Text size="xs">
                                  {new Date(transaction.performedAt).toLocaleString("en-OM")}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="xs">
                                  {transaction.category.replace(/_/g, " ")}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge size="xs" color="gray" variant="light">
                                  {transaction.transactionTypeName}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="xs" style={{ fontFamily: "monospace" }}>
                                  {transaction.referenceId || "—"}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="xs" c="dimmed">
                                  {transaction.description || "—"}
                                </Text>
                              </Table.Td>
                              <Table.Td style={{ textAlign: "right" }}>
                                <Text
                                  size="xs"
                                  fw={600}
                                  c={transaction.amountChange < 0 ? "red" : "teal"}
                                >
                                  {transaction.amountChange > 0 ? "+" : ""}
                                  OMR {Number(transaction.amountChange).toLocaleString("en-OM", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          ))
                        )}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Paper>
              </>
            )}
          </Stack>
        </Tabs.Panel>        

        {/* ==========================================
            TAB 5: PROJECT TRACKING
           ========================================== */}
        <Tabs.Panel value="tracking">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Project Tracking</Title>
                <Text size="sm" c="dimmed">Monitor actual project completion and sub-task progress.</Text>
              </Stack>
              <Select
                label="Select Project"
                placeholder={projectsLoading ? "Loading projects..." : "Select a project"}
                value={selectedProjectId || null}
                onChange={(value) => setSelectedProjectId(value ?? "")}
                data={projects.map((project) => ({
                  value: project.projectId,
                  label: `${project.projectName} (${project.projectId})`,
                }))}
                disabled={projectsLoading || projects.length === 0}
                searchable
                clearable
              />
            </Group>
          </Paper>

          {!selectedProjectId ? (
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="xs">
                <Text fw={600}>No project selected</Text>
                <Text size="sm" c="dimmed">Select a project to view its progress.</Text>
              </Stack>
            </Paper>
          ) : !selectedProject ? (
            <Paper p="xl" radius="md" withBorder>
              <Text size="sm" c="dimmed" ta="center">
                {projectsLoading ? "Loading projects..." : "The selected project could not be found."}
              </Text>
            </Paper>
          ) : (
            <Stack gap="md">
              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" align="flex-start" mb="md">
                  <Stack gap={4}>
                    <Text size="xs" fw={600} c="dimmed">PROJECT SUMMARY</Text>
                    <Title order={4}>{selectedProject.projectName}</Title>
                    <Text size="xs" c="dimmed">Project ID: {selectedProject.projectId}</Text>
                  </Stack>
                  {renderStatusBadge(selectedProject.status)}
                </Group>

                <Divider mb="md" />

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="xs" c="dimmed">Customer</Text>
                    <Text size="sm" fw={600}>{selectedProject.customer || "—"}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="xs" c="dimmed">Allocated Budget</Text>
                    <Text size="sm" fw={600}>
                      {Number(selectedProject.budgetAllocated).toLocaleString("en-OM", { style: "currency", currency: "OMR" })}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Divider my="md" />

                <Group justify="space-between" align="center" mb="xs">
                  <Text size="sm" fw={600}>Overall Completion</Text>
                  <Text size="lg" fw={700}>
                    {projectProgressLoading ? "—" : `${(projectProgress?.overallCompletionPercentage ?? 0).toFixed(2)}%`}
                  </Text>
                </Group>

                <Progress
                  value={Math.min(100, Math.max(0, projectProgress?.overallCompletionPercentage ?? 0))}
                  size="lg"
                  radius="xl"
                  animated={projectProgressLoading}
                />

                {projectProgressLoading && (
                  <Text size="xs" c="dimmed" mt="xs">Loading progress data...</Text>
                )}

                {!projectProgressLoading && !projectProgress && (
                  <Text size="xs" c="red" mt="xs">Unable to display progress. Please try selecting the project again.</Text>
                )}
              </Paper>

              <Grid>
                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder h="100%">
                    <Text size="xs" c="dimmed">Tasks Completed</Text>
                    <Text size="xl" fw={700}>
                      {projectProgressLoading ? "—" : `${projectProgress?.completedTasks ?? 0} / ${projectProgress?.totalTasks ?? 0}`}
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder h="100%">
                    <Text size="xs" c="dimmed">Sub-tasks Completed</Text>
                    <Text size="xl" fw={700}>
                      {projectProgressLoading ? "—" : `${projectProgress?.completedSubTasks ?? 0} / ${projectProgress?.totalSubTasks ?? 0}`}
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder h="100%">
                    <Text size="xs" c="dimmed">In Progress</Text>
                    <Text size="xl" fw={700}>
                      {projectProgressLoading ? "—" : projectProgress?.inProgressSubTasks ?? 0}
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder h="100%">
                    <Text size="xs" c="dimmed">Initiated</Text>
                    <Text size="xl" fw={700}>
                      {projectProgressLoading ? "—" : projectProgress?.initiatedSubTasks ?? 0}
                    </Text>
                  </Paper>
                </Grid.Col>
              </Grid>

              <Paper p="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Stack gap={2}>
                    <Text fw={600} size="sm">Sub-task Progress</Text>
                    <Text size="xs" c="dimmed">Work quantities and statuses reported by the backend.</Text>
                  </Stack>
                  {projectProgress && !projectProgressLoading && (
                    <Badge variant="light">{projectProgress.subTasks.length} records</Badge>
                  )}
                </Group>

                {projectProgressLoading ? (
                  <Text size="sm" c="dimmed" ta="center" py="xl">Loading sub-task records...</Text>
                ) : !projectProgress ? (
                  <Text size="sm" c="dimmed" ta="center" py="xl">Progress records are unavailable.</Text>
                ) : projectProgress.subTasks.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center" py="xl">No sub-task progress records are available for this project.</Text>
                ) : (
                  <Table.ScrollContainer minWidth={780}>
                    <Table striped highlightOnHover verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Task</Table.Th>
                          <Table.Th>Sub-task</Table.Th>
                          <Table.Th>Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {projectProgress.subTasks.map((item) => (
                          <Table.Tr key={item.projectProgressId}>
                            <Table.Td><Text size="sm">{item.taskName}</Text></Table.Td>
                            <Table.Td><Text size="sm">{item.subTaskName}</Text></Table.Td>
                            <Table.Td>
                              <Badge
                                variant="light"
                                color={
                                  item.status === 13 ? "green" :
                                  item.status === 10 ? "blue" :
                                  item.status === 11 ? "red" :
                                  item.status === 12 ? "orange" : "gray"
                                }
                              >
                                {getProgressStatusLabel(item.status)}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                )}
              </Paper>
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* ====================================================================
          4. DRAWER: CREATE / EDIT PROJECT (Hydration-safe title)
         ==================================================================== */}
      <Modal
        opened={projectModalOpened}
        onClose={() => setprojectModalOpened(false)}
        title={
          <Text fw={700} size="lg">
            {modalMode === 'create' ? 'Create New Project' : `Edit: ${selectedProject?.projectName}`}
          </Text>
        }
        size="70%"
      >
        <Stack gap="md">
          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.currentTarget.value)}
            required
          />

          <Select
            label="Project Manager"
            placeholder="Select project manager"
            data={employeeOptions}
            value={projectManagerId}
            onChange={setProjectManagerId}
            searchable
            clearable
            required
          />

          <Select
            label="Quotation"
            placeholder="Select approved quotation"
            data={quotationOptions}
            value={quotationSelection}
            onChange={setQuotationSelection}
            searchable
            clearable
            required
          />

          {quotationSelection && (() => {
            const [quotationId] = quotationSelection.split('|');
            const quotation = quotations.find((item) => item.quotationId === quotationId);
            if (!quotation) return null;

            return (
              <Paper withBorder p="sm" radius="md">
                <Text size="sm" fw={500}>Customer</Text>
                <Text size="sm" c="dimmed">{quotation.customer}</Text>
              </Paper>
            );
          })()}

          <Group grow>
            <TextInput
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.currentTarget.value)}
              required
            />
            <TextInput
              label="Expected End Date"
              type="date"
              value={expectedEndDate}
              onChange={(e) => setExpectedEndDate(e.currentTarget.value)}
              required
            />
          </Group>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setprojectModalOpened(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} loading={projectSaveLoading}>Create Project</Button>
          </Group>
        </Stack>
      </Modal>

      {/* ====================================================================
          4. MODALS
         ==================================================================== */}
      <Modal
        opened={subcontractorModal}
        onClose={() => setSubcontractorModal(false)}
        title={<Text fw={600}>Add Sub-contractor</Text>}
        centered
        radius="md"
      >
        <Stack gap="sm">
          <Select label="Sub-contractor" placeholder="Select sub-contractor" data={['Vanguard Foundations', 'Sterling MEP Systems']} required />
          <Select label="Work Category" data={['Civil & Earthworks', 'Electrical & Plumbing']} required />
          <TextInput label="Scope of Work" placeholder="Specify scope" required />
          <TextInput type="date" label="Assigned Date" />
          <Group justify="end" mt="md">
            <Button variant="default" size="xs" onClick={() => setSubcontractorModal(false)}>Cancel</Button>
            <Button size="xs" color="blue" onClick={() => setSubcontractorModal(false)}>Add</Button>
          </Group>
        </Stack>
      </Modal>

      {/* ==========================================
          PURCHASE ORDER: CREATE / EDIT MODAL
        ========================================== */}
      <Modal
        opened={createPOModalOpened}
        onClose={handleCloseCreatePOModal}
        title={
          <Text fw={700} size="lg">
            {editingPoRequestId
              ? `Edit and Resubmit ${editingPoRequestId}`
              : "Create Purchase Order"}
          </Text>
        }
        size="xl"
        centered
      >
        <Stack gap="lg">
          <Select
            label="Project"
            placeholder="Select an eligible project"
            data={projects
              .filter((project) =>
                ["Initiated", "In Progress"].includes(project.status)
              )
              .map((project) => ({
                value: project.projectId,
                label: `${project.projectId} — ${project.projectName}`,
              }))}
            value={poFormProjectId}
            onChange={(value) => void handlePoProjectChange(value)}
            searchable
            clearable
            required
            disabled={Boolean(editingPoRequestId)}
          />

          {poProjectDetailLoading && <Skeleton height={90} />}

          {poProjectDetail && !poProjectDetailLoading && (
            <Paper withBorder p="sm" radius="md">
              <Text fw={600} size="sm" mb="xs">
                Linked Customer Quotation
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                <div>
                  <Text size="xs" c="dimmed">Customer</Text>
                  <Text size="sm">{poProjectDetail.customer}</Text>
                </div>

                <div>
                  <Text size="xs" c="dimmed">Quotation</Text>
                  <Text size="sm">
                    {poProjectDetail.quotationId} — Version{" "}
                    {poProjectDetail.quotationVersion}
                  </Text>
                </div>

                <div>
                  <Text size="xs" c="dimmed">Project Status</Text>
                  <Text size="sm">{poProjectDetail.status}</Text>
                </div>

                <div>
                  <Text size="xs" c="dimmed">Project Name</Text>
                  <Text size="sm">{poProjectDetail.projectName}</Text>
                </div>
              </SimpleGrid>
            </Paper>
          )}

          <Divider />

          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={5}>Items</Title>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={handleAddPoItem}
              >
                Add Item
              </Button>
            </Group>

            {poFormItems.map((item, index) => (
              <Paper key={index} withBorder p="sm" radius="md">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={500} size="sm">Item {index + 1}</Text>

                    {poFormItems.length > 1 && (
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => handleRemovePoItem(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Group>

                  <Select
                    label="Inventory Item"
                    placeholder="Select item"
                    data={poItems.map((option) => ({
                      value: String(option.itemId),
                      label: `${option.itemName} (${option.itemCategory})`,
                    }))}
                    value={item.itemId}
                    onChange={(value) =>
                      handlePoItemChange(index, "itemId", value)
                    }
                    searchable
                    clearable
                    required
                    disabled={poLookupsLoading}
                  />

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    <NumberInput
                      label="Quantity"
                      min={1}
                      allowDecimal={false}
                      value={item.quantity}
                      onChange={(value) =>
                        handlePoItemChange(index, "quantity", Number(value) || 0)
                      }
                      required
                    />

                    <NumberInput
                      label="Unit Price (OMR)"
                      min={0.01}
                      decimalScale={2}
                      fixedDecimalScale
                      value={item.unitPrice}
                      onChange={(value) =>
                        handlePoItemChange(index, "unitPrice", Number(value) || 0)
                      }
                      required
                    />
                  </SimpleGrid>

                  <Group justify="flex-end">
                    <Text size="sm" c="dimmed">Line total</Text>
                    <Text fw={600}>
                      {(item.quantity * item.unitPrice).toLocaleString("en-OM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} OMR
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={5}>Vendor Quotations</Title>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={handleAddPoQuotation}
              >
                Add Vendor Quotation
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              Select exactly one preferred quotation before submitting.
            </Text>

            {poFormQuotations.map((quotation, index) => (
              <Paper key={index} withBorder p="sm" radius="md">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={500} size="sm">
                      Vendor Quotation {index + 1}
                    </Text>

                    {poFormQuotations.length > 1 && (
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => handleRemovePoQuotation(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Group>

                  <Select
                    label="Vendor"
                    placeholder="Select vendor"
                    data={poVendors.map((vendor) => ({
                      value: String(vendor.vendorId),
                      label: vendor.vendorName,
                    }))}
                    value={quotation.vendorId}
                    onChange={(value) =>
                      handlePoQuotationChange(index, "vendorId", value)
                    }
                    searchable
                    clearable
                    required
                    disabled={poLookupsLoading}
                  />

                  <NumberInput
                    label="Quotation Amount (OMR)"
                    min={0.01}
                    decimalScale={2}
                    fixedDecimalScale
                    value={quotation.quotationAmount}
                    onChange={(value) =>
                      handlePoQuotationChange(
                        index,
                        "quotationAmount",
                        Number(value) || 0
                      )
                    }
                    required
                  />

                  <Stack gap={4}>
                    <Text size="sm" fw={500}>Quotation Receipt (optional)</Text>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0] ?? null;
                        handlePoReceiptChange(index, file);
                      }}
                    />
                    {quotation.receiptName && (
                      <Text size="xs" c="dimmed">
                        {quotation.receiptName}
                      </Text>
                    )}
                  </Stack>

                  <Checkbox
                    label="Preferred quotation"
                    checked={quotation.selected}
                    onChange={() => handlePreferredQuotationChange(index)}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={handleCloseCreatePOModal}
              disabled={purchaseOrderSaveLoading}
            >
              Cancel
            </Button>

            <Button
              color="brandOrange"
              onClick={() => void handleSubmitPurchaseOrder()}
              loading={purchaseOrderSaveLoading}
              disabled={poProjectDetailLoading || poLookupsLoading}
            >
              {editingPoRequestId ? "Resubmit Purchase Order" : "Submit Purchase Order"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Drawer
        opened={projectDetailOpened}
        onClose={() => setProjectDetailOpened(false)}
        title="Project Details"
        position="right"
        size="md"
      >
        {projectDetailsLoading ? (
          <Stack gap="xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={24} />
            ))}
          </Stack>
        ) : projectDetail ? (
          <Stack gap="md">
            <div>
              <Text size="xs" c="dimmed">Project ID</Text>
              <Text fw={500}>{projectDetail.projectId}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Project Name</Text>
              <Text fw={500}>{projectDetail.projectName}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Customer</Text>
              <Text>{projectDetail.customer}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Site Address</Text>
              <Text>{projectDetail.siteAddress}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Project Manager</Text>
              <Text>{getEmployeeName(projectDetail.projectManagerId)}</Text>
            </div>

            <Divider />

            <SimpleGrid cols={2}>
              <div>
                <Text size="xs" c="dimmed">Quotation</Text>
                <Text>{projectDetail.quotationId}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Version</Text>
                <Text>{projectDetail.quotationVersion}</Text>
              </div>
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <div>
                <Text size="xs" c="dimmed">Start Date</Text>
                <Text>{projectDetail.startDate}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Expected End</Text>
                <Text>{projectDetail.expectedEndDate}</Text>
              </div>
            </SimpleGrid>

            <div>
              <Text size="xs" c="dimmed">Budget Allocated</Text>
              <Text fw={600}>
                {projectDetail.budgetAllocated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Completion</Text>
              <Progress value={projectDetail.completionPercent} mt={5} />
              <Text size="xs" c="dimmed" mt={4}>{projectDetail.completionPercent}%</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Status</Text>
              <Badge mt={4}>{projectDetail.status}</Badge>
            </div>
          </Stack>
        ) : (
          <Text c="dimmed">Unable to load project details.</Text>
        )}
      </Drawer>

      {/* ==========================================
          PURCHASE ORDER DETAILS DRAWER
        ========================================== */}
      <Drawer
        opened={purchaseOrderDetailOpened}
        onClose={() => setPurchaseOrderDetailOpened(false)}
        title="Purchase Order Details"
        position="right"
        size="lg"
      >
        {!purchaseOrderDetail ? (
          <Stack gap="xs">
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={100} />
          </Stack>
        ) : (
          <Stack gap="md">
            <div>
              <Text size="xs" c="dimmed">PO Request ID</Text>
              <Text fw={600}>{purchaseOrderDetail.poRequestId}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Project ID</Text>
              <Text fw={500}>{purchaseOrderDetail.projectId}</Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">Status</Text>
              {renderStatusBadge(purchaseOrderDetail.status)}
            </div>

            <SimpleGrid cols={2} spacing="sm">
              <div>
                <Text size="xs" c="dimmed">Created At</Text>
                <Text size="sm">
                  {purchaseOrderDetail.createdAt
                    ? new Date(purchaseOrderDetail.createdAt).toLocaleString()
                    : "—"}
                </Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">Created By</Text>
                <Text size="sm">{purchaseOrderDetail.createdBy}</Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">Last Modified</Text>
                <Text size="sm">
                  {purchaseOrderDetail.modifiedAt
                    ? new Date(purchaseOrderDetail.modifiedAt).toLocaleString()
                    : "—"}
                </Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">Modified By</Text>
                <Text size="sm">
                  {purchaseOrderDetail.modifiedBy ?? "—"}
                </Text>
              </div>
            </SimpleGrid>

            <Divider />

            <Title order={5}>Requested Items</Title>

            {purchaseOrderDetail.items.length === 0 ? (
              <Text size="sm" c="dimmed">No items found.</Text>
            ) : (
              <Table.ScrollContainer minWidth={440}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item</Table.Th>
                      <Table.Th>Qty</Table.Th>
                      <Table.Th>Unit Price</Table.Th>
                      <Table.Th>Total</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {purchaseOrderDetail.items.map((item) => {
                      const itemLookup = poItems.find(
                        (option) => option.itemId === item.itemId
                      );

                      return (
                        <Table.Tr key={item.itemRequestId}>
                          <Table.Td>
                            {itemLookup?.itemName ?? `Item ${item.itemId}`}
                          </Table.Td>
                          <Table.Td>{item.itemQuantity}</Table.Td>
                          <Table.Td>
                            {item.itemUnitPrice.toFixed(2)}
                          </Table.Td>
                          <Table.Td>
                            {item.itemTotalPrice.toFixed(2)}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}

            <Divider />

            <Title order={5}>Vendor Quotations</Title>

            {purchaseOrderDetail.quotations.length === 0 ? (
              <Text size="sm" c="dimmed">No vendor quotations found.</Text>
            ) : (
              <Stack gap="sm">
                {purchaseOrderDetail.quotations.map((quotation) => {
                  const vendor = poVendors.find(
                    (option) => option.vendorId === quotation.vendorId
                  );

                  return (
                    <Paper
                      key={quotation.poQuotationId}
                      withBorder
                      p="sm"
                      radius="md"
                    >
                      <Group justify="space-between" align="flex-start">
                        <div>
                          <Text fw={500}>
                            {vendor?.vendorName ?? `Vendor ${quotation.vendorId}`}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {quotation.poQuotationId}
                          </Text>
                        </div>

                        {renderStatusBadge(quotation.status)}
                      </Group>

                      <Text mt="sm" fw={600}>
                        {quotation.quotationAmount.toLocaleString("en-OM", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} OMR
                      </Text>

                      <Text size="xs" c="dimmed" mt={4}>
                        Receipt: {quotation.receiptAttached ? "Attached" : "Not attached"}
                      </Text>
                    </Paper>
                  );
                })}
              </Stack>
            )}

            <Divider />

            {purchaseOrderDetail.status === "Submitted" && (
              <Group grow>
                <Button
                  color="green"
                  loading={purchaseOrderActionLoading}
                  onClick={() =>
                    void handlePurchaseOrderAction(
                      purchaseOrderDetail.poRequestId,
                      "approve"
                    )
                  }
                >
                  Approve PO
                </Button>

                <Button
                  color="red"
                  variant="light"
                  loading={purchaseOrderActionLoading}
                  onClick={() =>
                    void handlePurchaseOrderAction(
                      purchaseOrderDetail.poRequestId,
                      "reject"
                    )
                  }
                >
                  Reject PO
                </Button>
              </Group>
            )}

            {purchaseOrderDetail.status === "Rejected" && (
              <Button
                color="orange"
                leftSection={<IconEdit size={16} />}
                onClick={() =>
                  void handleEditRejectedPurchaseOrder(
                    purchaseOrderDetail.poRequestId
                  )
                }
              >
                Edit and Resubmit
              </Button>
            )}
          </Stack>
        )}
      </Drawer>

    </Container>
  );
}