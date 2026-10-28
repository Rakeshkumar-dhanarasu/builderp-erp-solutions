"use client";

import React, { useCallback, useEffect, useState } from 'react';
import {
  Stack, Tabs, Container, Group, Title, Text, Button, Table, Badge,
  TextInput, Select, Grid, Card, RingProgress, ActionIcon, Modal,
  Timeline, NumberInput, Textarea, FileInput, Paper, Divider, Tooltip,
  SimpleGrid
} from '@mantine/core';
import {
  IconSearch, IconFilter, IconPlus, IconEye, IconEdit, IconUpload,
  IconTrash, IconRefresh, IconFileText, IconDownload, IconCheck, IconX,
  IconAlertCircle, IconHistory, IconCalendar
} from '@tabler/icons-react';
import { QuotationTable, QuotationItem, QuotationFinancials } from '@/components/QuotationTable';
import { getStakeholdersByType } from "@/services/stakeholderService";
import {
  createQuotation, getQuotation, getAllQuotations, updateQuotation,
  sendQuotation, acceptQuotation, rejectQuotation, createNewQuotationVersion,
  getQuotationVersionHistory, getBudgetDetails, editBudget,
  CreateQuotationRequest, UpdateQuotationRequest, BudgetEditRequest,
  QuotationResponse, BudgetResponse, type QuotationTaskRequest,
  QuotationVersionHistoryResponse, QuotationListResponse, downloadQuotationPdf
} from '@/services/quotationService';

interface Quotation {
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
  tasks: QuotationItem[];
}

interface QuotationListItem {
  quotationId: string;
  customer: string;
  draftDate: string;
  versionNumber: number;
  total: number;
  currencyCode: string;
  quoteStatus: string;
}

interface CustomerOption {
  value: string;
  label: string;
}

const CUSTOMER_OPTIONS: CustomerOption[] = [
  { value: '5', label: 'Caps Tops' },
];

type BudgetField = keyof Pick<
  BudgetResponse,
  'purchaseMaterial' | 'subcontractor' | 'labourForces' | 'transportLogistics' | 'miscellaneous'
>;

const BUDGET_CATEGORIES: { key: BudgetField; label: string; color: string }[] = [
  { key: 'purchaseMaterial', label: 'Purchase material', color: 'blue' },
  { key: 'subcontractor', label: 'Subcontractor', color: 'violet' },
  { key: 'labourForces', label: 'Labour Forces', color: 'pink' },
  { key: 'transportLogistics', label: 'Transport & Logistics', color: 'orange' },
  { key: 'miscellaneous', label: 'Miscellaneous', color: 'gray' }
];

const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', {
    style: 'currency',
    currency: 'OMR'
  }).format(val);

const mapQuotationResponseToUi = (response: QuotationResponse): Quotation => {
  const groupedTasks = new Map<string, QuotationResponse['tasks']>();

  response.tasks.forEach((task) => {
    const existing = groupedTasks.get(task.taskName) || [];
    existing.push(task);
    groupedTasks.set(task.taskName, existing);
  });

  const items: QuotationItem[] = [];
  let itemNum = 1;

  groupedTasks.forEach((tasks, taskName) => {
    items.push({
      id: `main-${itemNum}`,
      itemNum,
      description: taskName,
      quantity: 0,
      unit: '',
      rate: 0,
      amount: tasks.reduce((sum, task) => sum + (task.price || 0), 0)
    });

    tasks.forEach((task, index) => {
      items.push({
        id: String(task.utid),
        itemNum,
        subItemNum: index + 1,
        description: task.subTaskName || '',
        quantity: task.quantity,
        unit: task.unit,
        rate: task.unitCost,
        amount: task.price
      });
    });

    itemNum++;
  });

  return {
    quotationId: response.quotationId,
    customerId: response.customerId,
    customer: response.customer,
    draftDate: response.draftDate,
    expiryDate: response.expiryDate,
    siteAddress: response.siteAddress,
    addComments: response.addComments,
    versionNumber: response.versionNumber,
    quoteStatus: response.quoteStatus,
    marketPrice: response.marketPrice,
    taxPercent: response.taxPercent,
    discountAmount: response.discountAmount,
    total: response.total,
    currencyCode: response.currencyCode,
    tasks: items
  };
};

const mapQuotationListResponseToUi = (
  response: QuotationListResponse
): QuotationListItem => ({
  quotationId: response.quotationId,
  customer: response.customer,
  draftDate: response.draftedAt,
  versionNumber: response.versionNumber,
  total: response.total,
  currencyCode: response.currencyCode,
  quoteStatus: response.quoteStatus
});

function mapItemsToQuotationTasks(items: QuotationItem[]): QuotationTaskRequest[] {
  const mainItems = items.filter((item) => item.subItemNum === undefined);

  return items
    .filter((item) => item.subItemNum !== undefined)
    .map((subItem) => {
      const mainItem = mainItems.find((item) => item.itemNum === subItem.itemNum);

      return {
        taskName: mainItem?.description.trim() || '',
        subTaskName: subItem.description.trim(),
        quantity: subItem.quantity,
        unit: subItem.unit.trim(),
        unitCost: subItem.rate,
        price: subItem.amount
      };
    });
}

type QuotationMode = 'create' | 'view' | 'edit';

export default function SalesModule() {
  const [activeTab, setActiveTab] = useState<string | null>('quotations');

  const [quotations, setQuotations] = useState<QuotationListItem[]>([]);
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);
  const [quotationMode, setQuotationMode] = useState<QuotationMode>('create');

  const [formOpen, setFormOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [history, setHistory] = useState<QuotationVersionHistoryResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [quotationListLoading, setQuotationListLoading] = useState(false);
  const [quotationSaving, setQuotationSaving] = useState(false);
  const [quotationActionLoading, setQuotationActionLoading] = useState(false);
  const [quotationError, setQuotationError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [currencyCode, setCurrencyCode] = useState('OMR');
  const [addComments, setAddComments] = useState('');

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [quotationFinancials, setQuotationFinancials] = useState<QuotationFinancials>({
    marketPrice: 0,
    taxPercent: 5,
    discountAmount: 0,
    total: 0
  });

  const [decisionType, setDecisionType] = useState<string | null>('Approved');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string | null>(null);
  const [appliedDateFilter, setAppliedDateFilter] = useState('');

  const handleDownloadQuotationPdf = async (quotationId: string) => {
  try {
      setPdfLoading(quotationId);

      const pdfBlob = await downloadQuotationPdf(quotationId);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${quotationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Failed to download quotation PDF:", error);
    } finally {
      setPdfLoading(null);
    }
  };

  const loadQuotations = useCallback(async () => {
    setQuotationListLoading(true);

    try {
      const response = await getAllQuotations();
      setQuotations(response.map(mapQuotationListResponseToUi));
    } catch (error) {
      console.error('Failed to load quotations:', error);
      setQuotationError('Unable to load quotations. Please try again.');
    } finally {
      setQuotationListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  useEffect(() => {
  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);

      const customers = await getStakeholdersByType('CUSTOMER');

      setCustomerOptions(
        customers.map((customer) => ({
          value: String(customer.stakeholderId),
          label: `${customer.firstName} ${customer.lastName}`.trim(),
        }))
      );
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  loadCustomers();
}, []);

  const filteredQuotations = quotations.filter((quotation) => {
    const search = appliedSearchQuery.trim().toLowerCase();

    const matchesSearch =
      !search ||
      quotation.quotationId.toLowerCase().includes(search) ||
      quotation.customer.toLowerCase().includes(search);

    const matchesStatus =
      !appliedStatusFilter || quotation.quoteStatus === appliedStatusFilter;

    const matchesDate =
      !appliedDateFilter || quotation.draftDate === appliedDateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleApplyFilters = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedStatusFilter(statusFilter);
    setAppliedDateFilter(dateFilter);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setDateFilter('');
    setAppliedSearchQuery('');
    setAppliedStatusFilter(null);
    setAppliedDateFilter('');
  };

  const getToday = () => new Date().toISOString().split('T')[0];

  const getDefaultExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const resetQuotationForm = () => {
    setActiveQuotation(null);
    setQuotationMode('create');
    setCustomerId(null);
    setDraftDate(getToday());
    setExpiryDate(getDefaultExpiryDate());
    setSiteAddress('');
    setCurrencyCode('OMR');
    setAddComments('');
    setQuotationItems([]);
    setQuotationFinancials({
      marketPrice: 0,
      taxPercent: 5,
      discountAmount: 0,
      total: 0
    });
    setQuotationError(null);
  };

  const openNewQuotation = () => {
    resetQuotationForm();
    setFormOpen(true);
  };

  const populateQuotationForm = (quotation: Quotation) => {
    setActiveQuotation(quotation);
    setCustomerId(String(quotation.customerId));
    setDraftDate(quotation.draftDate);
    setExpiryDate(quotation.expiryDate);
    setSiteAddress(quotation.siteAddress);
    setCurrencyCode(quotation.currencyCode);
    setAddComments(quotation.addComments || '');
    setQuotationItems(quotation.tasks);
    setQuotationFinancials({
      marketPrice: quotation.marketPrice,
      taxPercent: quotation.taxPercent,
      discountAmount: quotation.discountAmount,
      total: quotation.total
    });
  };

  const openQuotation = async (quotationId: string, mode: 'view' | 'edit') => {
    setQuotationLoading(true);
    setQuotationError(null);

    try {
      const response = await getQuotation(quotationId);
      const quotation = mapQuotationResponseToUi(response);

      populateQuotationForm(quotation);
      setQuotationMode(mode);
      setFormOpen(true);
    } catch (error) {
      console.error('Failed to load quotation:', error);
      setQuotationError('Unable to load the quotation. Please try again.');
    } finally {
      setQuotationLoading(false);
    }
  };

  const handleOpenDecision = async (quotationId: string) => {
    setQuotationLoading(true);
    setQuotationError(null);
    setDecisionType('Approved');

    try {
      const response = await getQuotation(quotationId);
      const quotation = mapQuotationResponseToUi(response);

      setActiveQuotation(quotation);
      setDecisionOpen(true);
    } catch (error) {
      console.error('Failed to load quotation for decision:', error);
      setQuotationError('Unable to load the quotation. Please try again.');
    } finally {
      setQuotationLoading(false);
    }
  };

  const handleQuotationTableChange = useCallback(
    (items: QuotationItem[], financials: QuotationFinancials) => {
      setQuotationItems(items);
      setQuotationFinancials(financials);
    },
    []
  );

  const buildCreateRequest = (): CreateQuotationRequest | null => {
    if (!customerId) {
      setQuotationError('Please select a customer.');
      return null;
    }

    if (!draftDate) {
      setQuotationError('Please enter the quotation draft date.');
      return null;
    }

    if (!expiryDate) {
      setQuotationError('Please enter the quotation expiry date.');
      return null;
    }

    if (!siteAddress.trim()) {
      setQuotationError('Please enter the site address.');
      return null;
    }

    const tasks = mapItemsToQuotationTasks(quotationItems);

    if (tasks.length === 0) {
      setQuotationError('Please add at least one quotation task.');
      return null;
    }

    return {
      customerId: Number(customerId),
      draftDate,
      expiryDate,
      siteAddress: siteAddress.trim(),
      currencyCode,
      addComments: addComments.trim() || undefined,
      tasks,
      marketPrice: quotationFinancials.marketPrice,
      taxPercent: quotationFinancials.taxPercent,
      discountAmount: quotationFinancials.discountAmount,
      total: quotationFinancials.total
    };
  };

  const buildUpdateRequest = (): UpdateQuotationRequest | null => {
    if (!expiryDate) {
      setQuotationError('Please enter the quotation expiry date.');
      return null;
    }

    if (!siteAddress.trim()) {
      setQuotationError('Please enter the site address.');
      return null;
    }

    const tasks = mapItemsToQuotationTasks(quotationItems);

    if (tasks.length === 0) {
      setQuotationError('Please add at least one quotation task.');
      return null;
    }

    return {
      expiryDate,
      siteAddress: siteAddress.trim(),
      addComments: addComments.trim() || undefined,
      tasks,
      marketPrice: quotationFinancials.marketPrice,
      taxPercent: quotationFinancials.taxPercent,
      discountAmount: quotationFinancials.discountAmount,
      total: quotationFinancials.total
    };
  };

  const handleSaveDraft = async () => {
    setQuotationError(null);
    setQuotationSaving(true);

    try {
      if (quotationMode === 'create') {
        const request = buildCreateRequest();

        if (!request) {
          return;
        }

        const response = await createQuotation(request);
        const quotation = mapQuotationResponseToUi(response);

        populateQuotationForm(quotation);

        // The newly created quotation is now an editable Drafting quotation.
        setQuotationMode('edit');

        await loadQuotations();
        setFormOpen(true);
        return;
      }

      if (quotationMode !== 'edit' || !activeQuotation) {
        return;
      }

      if (activeQuotation.quoteStatus !== 'Drafting') {
        setQuotationError('Only Drafting quotations can be edited.');
        return;
      }

      const request = buildUpdateRequest();

      if (!request) {
        return;
      }

      const response = await updateQuotation(activeQuotation.quotationId, request);
      const quotation = mapQuotationResponseToUi(response);

      populateQuotationForm(quotation);
      setQuotationMode('edit');

      await loadQuotations();
      setFormOpen(true);
    } catch (error) {
      console.error('Failed to save quotation:', error);
      setQuotationError('Unable to save the quotation. Please try again.');
    } finally {
      setQuotationSaving(false);
    }
  };

  const handleSendQuotation = async () => {
    if (quotationMode !== 'edit') {
      return;
    }

    if (!activeQuotation) {
      setQuotationError('Please save the quotation before sending it.');
      return;
    }

    if (activeQuotation.quoteStatus !== 'Drafting') {
      setQuotationError('Only Drafting quotations can be sent to the customer.');
      return;
    }

    setQuotationError(null);
    setQuotationActionLoading(true);

    try {
      const response = await sendQuotation(activeQuotation.quotationId);
      const quotation = mapQuotationResponseToUi(response);

      populateQuotationForm(quotation);
      setQuotationMode('view');

      await loadQuotations();
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to send quotation:', error);
      setQuotationError('Unable to send the quotation to the customer.');
    } finally {
      setQuotationActionLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!activeQuotation || !decisionType) {
      return;
    }

    if (activeQuotation.quoteStatus !== 'Sent to Customer') {
      setQuotationError(
        'A quotation can only be Approved or rejected after it has been sent to the customer.'
      );
      return;
    }

    setQuotationError(null);
    setQuotationActionLoading(true);

    try {
      const response =
        decisionType === 'Approved'
          ? await acceptQuotation(activeQuotation.quotationId)
          : await rejectQuotation(activeQuotation.quotationId);

      const quotation = mapQuotationResponseToUi(response);

      populateQuotationForm(quotation);
      setQuotationMode('view');

      await loadQuotations();
      setDecisionOpen(false);
    } catch (error) {
      console.error('Failed to update quotation decision:', error);
      setQuotationError('Unable to record the customer decision. Please try again.');
    } finally {
      setQuotationActionLoading(false);
    }
  };

  const handleCreateNewVersion = async (quotationFromList?: QuotationListItem) => {
    const quotationId = quotationFromList?.quotationId || activeQuotation?.quotationId;
    const currentStatus = quotationFromList?.quoteStatus || activeQuotation?.quoteStatus;

    if (!quotationId) {
      setQuotationError('Quotation reference is missing.');
      return;
    }

    if (currentStatus !== 'Approved' && currentStatus !== 'Rejected') {
      setQuotationError(
        'A new quotation version can only be created after Approved or Rejected.'
      );
      return;
    }

    setQuotationError(null);
    setQuotationActionLoading(true);

    try {
      const response = await createNewQuotationVersion(quotationId);
      const quotation = mapQuotationResponseToUi(response);

      // IMPORTANT:
      // The response is the NEW version. Make that version the active
      // quotation before allowing Save Draft.
      populateQuotationForm(quotation);
      setQuotationMode('edit');

      await loadQuotations();

      // Open the new Drafting version directly in edit mode.
      setFormOpen(true);
    } catch (error) {
      console.error('Failed to create quotation version:', error);
      setQuotationError('Unable to create a new quotation version.');
    } finally {
      setQuotationActionLoading(false);
    }
  };

  const handleOpenHistory = async (quotationId: string) => {
    setHistoryLoading(true);
    setHistory([]);
    setQuotationError(null);

    try {
      const quotation = await getQuotation(quotationId);
      const historyResponse = await getQuotationVersionHistory(quotationId);

      setActiveQuotation(mapQuotationResponseToUi(quotation));
      setHistory(historyResponse);
      setHistoryOpen(true);
    } catch (error) {
      console.error('Failed to load quotation history:', error);
      setQuotationError('Unable to load quotation version history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const isQuotationReadOnly = quotationMode === 'view';
  const canEditQuotation = quotationMode === 'create' || quotationMode === 'edit';

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      Drafting: 'gray',
      'Sent to Customer': 'blue',
      Approved: 'green',
      Rejected: 'red',
      Pending: 'yellow',
      Paid: 'green',
      'Partially Paid': 'cyan',
      Overdue: 'red'
    };

    return (
      <Badge color={maps[status] || 'gray'} variant="light">
        {status}
      </Badge>
    );
  };

  // ==========================================
  // BUDGET ALLOCATION STATES
  // ==========================================
  const approvedQuotations = quotations.filter((q) => q.quoteStatus === 'Approved');

  const [selectedProject, setSelectedProject] = useState<string>('');
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [draftBudget, setDraftBudget] = useState<BudgetResponse | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [budgetLoading, setBudgetLoading] = useState<boolean>(false);
  const [budgetSaving, setBudgetSaving] = useState<boolean>(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const activeApprovedQuotation = approvedQuotations.find(
    (q) => q.quotationId === selectedProject
  );

  const approvedContractTotal = budget?.totalBudget || 0;

  const currentBudget = isEditingBudget ? draftBudget : budget;

  const totalAllocated =
    (currentBudget?.purchaseMaterial || 0) +
    (currentBudget?.subcontractor || 0) +
    (currentBudget?.labourForces || 0) +
    (currentBudget?.transportLogistics || 0) +
    (currentBudget?.miscellaneous || 0);

  const escrowBalance = approvedContractTotal - totalAllocated;

  const consumptionRatio =
    approvedContractTotal > 0
      ? ((totalAllocated / approvedContractTotal) * 100).toFixed(1)
      : '0.0';

  const loadBudgetDetails = async (quotationId: string) => {
    setBudgetLoading(true);
    setBudgetError(null);
    setIsEditingBudget(false);
    setBudget(null);
    setDraftBudget(null);

    try {
      const response = await getBudgetDetails(quotationId);
      setBudget(response);
    } catch (error) {
      console.error('Failed to load budget details:', error);
      setBudgetError('Unable to load budget details. Please try again.');
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleBudgetQuotationChange = (quotationId: string | null) => {
    setSelectedProject(quotationId || '');
    setIsEditingBudget(false);
    setBudget(null);
    setDraftBudget(null);
    setBudgetError(null);

    if (quotationId) {
      loadBudgetDetails(quotationId);
    }
  };

  const handleStartEditingBudget = () => {
    if (!budget) {
      return;
    }

    setDraftBudget({ ...budget });
    setIsEditingBudget(true);
  };

  const handleUpdateBudgetField = (
    field: BudgetField,
    value: string | number
  ) => {
    setDraftBudget((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [field]: typeof value === 'number' ? value : Number(value) || 0
      };
    });
  };

  const handleUpdateMiscDetails = (value: string) => {
    setDraftBudget((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        miscDetails: value
      };
    });
  };

  const handleSaveBudgetEdits = async () => {
    if (!selectedProject || !draftBudget) {
      return;
    }

    setBudgetSaving(true);
    setBudgetError(null);

    const request: BudgetEditRequest = {
      purchaseMaterial: draftBudget.purchaseMaterial || 0,
      subcontractor: draftBudget.subcontractor || 0,
      labourForces: draftBudget.labourForces || 0,
      transportLogistics: draftBudget.transportLogistics || 0,
      miscellaneous: draftBudget.miscellaneous || 0,
      miscDetails: draftBudget.miscDetails?.trim() || undefined
    };

    try {
      const response = await editBudget(selectedProject, request);

      setBudget(response);
      setDraftBudget(null);
      setIsEditingBudget(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
      setBudgetError('Unable to save budget changes. Please try again.');
    } finally {
      setBudgetSaving(false);
    }
  };

  const handleCancelBudgetEdits = () => {
    setDraftBudget(null);
    setIsEditingBudget(false);
    setBudgetError(null);
  };

  const chartSections = currentBudget
    ? BUDGET_CATEGORIES.map((category) => {
        const value = currentBudget[category.key] || 0;
        const categoryPct =
          approvedContractTotal > 0
            ? (value / approvedContractTotal) * 100
            : 0;

        return {
          value: categoryPct,
          color: category.color,
          tooltip: `${category.label}: ${formatOMR(value)} (${categoryPct.toFixed(1)}%)`
        };
      })
    : [];

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2} className="enterprise-title">Commercial Lifecycle Engine</Title>
            <Text size="sm" c="dimmed">
              Manage configurations for Pre-Construction Contracts, Budgets, and Escrow Trackers.
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="quotations" leftSection={<IconFileText size={16} />}>Quotations</Tabs.Tab>
          <Tabs.Tab value="budgeting" leftSection={<IconRefresh size={16} />}>Budgeting</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="quotations">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Quotations Engine</Title>
                <Text size="sm" c="dimmed">
                  Track, adjust, and archive customer approval actions across commercial structures.
                </Text>
              </Stack>

              <Button size="sm" leftSection={<IconPlus size={16} />} onClick={openNewQuotation}>
                Create Quotation
              </Button>
            </Group>
          </Paper>

          <Card withBorder radius="md" p="sm" mb="md">
            <Grid align="end">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Search Ref"
                  placeholder="Search customer, quotation..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
                <Select
                  label="Filter Status"
                  placeholder="All Stages"
                  data={['Drafting', 'Sent to Customer', 'Approved', 'Rejected']}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
                <TextInput
                  label="Lifecycle Boundary"
                  type="date"
                  leftSection={<IconCalendar size={16} />}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.currentTarget.value)}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4, md: 2 }}>
                <Group gap="xs" wrap="nowrap">
                  <Button color="brandOrange" fullWidth leftSection={<IconFilter size={16} />} onClick={handleApplyFilters}>
                    Apply
                  </Button>
                  <Button variant="subtle" size="sm" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>

          <Table.ScrollContainer minWidth={800}>
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID/Ref</Table.Th>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Draft Date</Table.Th>
                  <Table.Th>Current Version</Table.Th>
                  <Table.Th>Quoted Total</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ width: '180px' }}>Interactions</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {quotationListLoading ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text size="sm" c="dimmed" ta="center" py="xl">Loading quotations...</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredQuotations.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text size="sm" c="dimmed" ta="center" py="xl">
                        {quotations.length === 0
                          ? 'No quotations have been created yet.'
                          : 'No quotations match the selected filters.'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredQuotations.map((q) => (
                    <Table.Tr key={q.quotationId}>
                      <Table.Td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {q.quotationId}
                      </Table.Td>
                      <Table.Td>{q.customer}</Table.Td>
                      <Table.Td>{q.draftDate}</Table.Td>
                      <Table.Td>v{q.versionNumber}</Table.Td>
                      <Table.Td>{formatOMR(q.total)}</Table.Td>
                      <Table.Td>{getStatusBadge(q.quoteStatus)}</Table.Td>

                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          
                          <Tooltip label="View Quotation">
                            <ActionIcon variant="subtle" size="sm" onClick={() => openQuotation(q.quotationId, 'view')}>
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>

                          {q.quoteStatus === 'Drafting' && (
                            <Tooltip label="Edit Quotation">
                              <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => openQuotation(q.quotationId, 'edit')}>
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}

                          <Tooltip label="Version History">
                            <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => handleOpenHistory(q.quotationId)}>
                              <IconHistory size={16} />
                            </ActionIcon>
                          </Tooltip>

                          {(() => {
                            console.log('Quotation status:', q.quoteStatus);
                            return null;
                          })()}

                          {q.quoteStatus === 'Sent to Customer' && (
                            <Tooltip label="Record Customer Decision">
                              <ActionIcon variant="subtle" color="green" size="sm" onClick={() => handleOpenDecision(q.quotationId)}>
                                <IconUpload size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}

                          {(q.quoteStatus === 'Approved' || q.quoteStatus === 'Rejected') && (
                            <Tooltip label="Create New Version">
                              <ActionIcon
                                variant="subtle"
                                color="orange"
                                size="sm"
                                loading={quotationActionLoading}
                                onClick={() => handleCreateNewVersion(q)}
                              >
                                <IconRefresh size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}

                          <Tooltip label="Download Quotation">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              loading={pdfLoading === q.quotationId}
                              onClick={() => handleDownloadQuotationPdf(q.quotationId)}
                            >
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Tabs.Panel>

        <Tabs.Panel value="budgeting">
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Title order={3} mb="xs">Operational Allocation Matrix</Title>
                  <Text size="sm" c="dimmed" mb="lg">
                    Distribute approved contract totals down to modular structural accounts below.
                  </Text>
                </Stack>

                <Select
                  label="Active Approved Project"
                  placeholder="Select Quotation"
                  value={selectedProject}
                  onChange={handleBudgetQuotationChange}
                  data={approvedQuotations.map((q) => ({
                    value: q.quotationId,
                    label: `${q.quotationId} - ${q.customer}`
                  }))}
                  searchable
                  clearable
                  disabled={budgetLoading || isEditingBudget}
                />
              </Group>

              {budgetError && (
                <Text c="red" size="sm" mt="md">
                  {budgetError}
                </Text>
              )}

              {budgetLoading ? (
                <Text size="sm" c="dimmed" mt="xl" ta="center">
                  Loading budget details...
                </Text>
              ) : !selectedProject ? (
                <Paper withBorder p="xl" radius="md" mt="xl">
                  <Text size="sm" c="dimmed" ta="center">
                    Select an Approved quotation to view its budget allocation.
                  </Text>
                </Paper>
              ) : budget ? (
                <>
                  <Grid mb="md" mt="md">
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed" fw={700}>APPROVED CONTRACT</Text>
                        <Text size="lg" fw={700}>{formatOMR(approvedContractTotal)}</Text>
                      </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed" fw={700}>ALLOCATED SUM</Text>
                        <Text size="lg" fw={700} c="blue">{formatOMR(totalAllocated)}</Text>
                      </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed" fw={700}>ESCROW BALANCE</Text>
                        <Text size="lg" fw={700} c={escrowBalance >= 0 ? 'green' : 'red'}>
                          {formatOMR(escrowBalance)}
                        </Text>
                      </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Paper withBorder p="sm" radius="md">
                        <Text size="xs" c="dimmed" fw={700}>CONSUMPTION RATIO</Text>
                        <Text size="lg" fw={700} c={Number(consumptionRatio) > 100 ? 'red' : 'orange'}>
                          {consumptionRatio}%
                        </Text>
                      </Paper>
                    </Grid.Col>
                  </Grid>

                  <Stack gap="md">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Text fw={700}>Cost Object Structures</Text>
                        <Badge variant="light" color="brandOrange">
                          Total: {formatOMR(totalAllocated)}
                        </Badge>
                      </Group>

                      {!isEditingBudget ? (
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconEdit size={14} />}
                          onClick={handleStartEditingBudget}
                        >
                          Edit Budgeting
                        </Button>
                      ) : (
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="default"
                            leftSection={<IconX size={14} />}
                            onClick={handleCancelBudgetEdits}
                            disabled={budgetSaving}
                          >
                            Cancel
                          </Button>

                          <Button
                            size="xs"
                            color="brandOrange"
                            leftSection={<IconCheck size={14} />}
                            onClick={handleSaveBudgetEdits}
                            loading={budgetSaving}
                          >
                            Save Changes
                          </Button>
                        </Group>
                      )}
                    </Group>

                    <Table withTableBorder variant="simple" verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Cost Ledger Target</Table.Th>
                          <Table.Th style={{ width: '220px' }}>Target Floor Value (OMR)</Table.Th>
                          <Table.Th style={{ width: '150px' }}>Weight Distribution</Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody>
                        {BUDGET_CATEGORIES.map((category) => {
                          const value = currentBudget?.[category.key] || 0;
                          const pct = totalAllocated > 0
                            ? ((value / totalAllocated) * 100).toFixed(1)
                            : '0.0';

                          return (
                            <Table.Tr key={category.key}>
                              <Table.Td>
                                <Text size="sm" fw={500}>
                                  {category.label}
                                </Text>
                              </Table.Td>

                              <Table.Td>
                                {isEditingBudget ? (
                                  <NumberInput
                                    size="xs"
                                    prefix="ر.ع. "
                                    decimalScale={3}
                                    value={value}
                                    onChange={(val) =>
                                      handleUpdateBudgetField(
                                        category.key,
                                        typeof val === 'number' ? val : 0
                                      )
                                    }
                                    min={0}
                                  />
                                ) : (
                                  <Text size="sm">{formatOMR(value)}</Text>
                                )}
                              </Table.Td>

                              <Table.Td>
                                <Text size="sm" fw={500}>{pct}%</Text>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>

                    <Textarea
                      label="Miscellaneous Budget Remarks"
                      placeholder="Specify reasons or scope details for miscellaneous budget..."
                      value={currentBudget?.miscDetails || ''}
                      onChange={(e) => handleUpdateMiscDetails(e.currentTarget.value)}
                      rows={2}
                      size="xs"
                      readOnly={!isEditingBudget}
                    />
                  </Stack>
                </>
              ) : null}
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" p="lg" style={{ height: '100%' }}>
                <Text fw={700} mb="xs" ta="center">Allocation Integrity Map</Text>
                <Divider mb="xl" />

                {budget ? (
                  <>
                    <Group justify="center" my="lg">
                      <RingProgress
                        size={180}
                        thickness={16}
                        roundCaps
                        sections={chartSections}
                        label={
                          <Text size="xs" ta="center" fw={700} c="dimmed">
                            {consumptionRatio}% Assigned
                          </Text>
                        }
                      />
                    </Group>

                    <Text size="xs" c="dimmed" ta="center" mt="md">
                      The chart tracks operational structural targets relative to absolute contract valuations.
                    </Text>
                  </>
                ) : (
                  <Text size="sm" c="dimmed" ta="center" mt="xl">
                    Select an Approved quotation to view its allocation.
                  </Text>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={
          activeQuotation
            ? `${quotationMode === 'view' ? 'View' : 'Edit'} Quotation ${activeQuotation.quotationId}`
            : 'Draft New Quotation'
        }
        padding="xl"
        size="100%"
      >
        <Container size="100%">
          <Group justify="space-between" align="center" mb="lg">
            <Title order={3}>
              {activeQuotation
                ? `Quotation Version ${activeQuotation.versionNumber}`
                : 'Operational Quote Configuration'}
            </Title>

            {activeQuotation && (
              <Group gap="xs">
                {getStatusBadge(activeQuotation.quoteStatus)}
                <Badge variant="light">v{activeQuotation.versionNumber}</Badge>
              </Group>
            )}
          </Group>

          {quotationError && (
            <Paper withBorder p="sm" mb="md" radius="md" style={{ borderColor: 'var(--mantine-color-red-5)' }}>
              <Group gap="xs">
                <IconAlertCircle size={16} />
                <Text size="sm" c="red">{quotationError}</Text>
              </Group>
            </Paper>
          )}

          {quotationLoading ? (
            <Text ta="center" py="xl" c="dimmed">Loading quotation...</Text>
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                <TextInput
                  label="Quotation Ref Number"
                  value={activeQuotation?.quotationId || 'Generated on Save'}
                  disabled
                />

                <Select
                  label="Select Customer"
                  placeholder="Select customer"
                  value={customerId}
                  onChange={setCustomerId}
                  data={customerOptions}
                  searchable
                  disabled={quotationMode !== 'create'}
                  required
                />

                <TextInput
                  label="Quotation Draft Date"
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.currentTarget.value)}
                  disabled={quotationMode !== 'create'}
                />

                <TextInput
                  label="Quotation Expiry Date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.currentTarget.value)}
                  disabled={isQuotationReadOnly}
                  required
                />

                <Select
                  label="Currency"
                  value={currencyCode}
                  onChange={(value) => value && setCurrencyCode(value)}
                  data={[
                    { value: 'OMR', label: 'OMR — Omani Rial' },
                    { value: 'AED', label: 'AED — UAE Dirham' },
                    { value: 'INR', label: 'INR — Indian Rupee' },
                    { value: 'USD', label: 'USD — US Dollar' },
                    { value: 'EUR', label: 'EUR — Euro' }
                  ]}
                  disabled={quotationMode !== 'create'}
                  required
                />

                <Textarea
                  label="Site Address"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.currentTarget.value)}
                  rows={1}
                  disabled={isQuotationReadOnly}
                  required
                />

                <Textarea
                  label="Quotation Comments"
                  value={addComments}
                  onChange={(e) => setAddComments(e.currentTarget.value)}
                  rows={1}
                  disabled={isQuotationReadOnly}
                  style={{ gridColumn: 'span 2' }}
                />
              </SimpleGrid>

              <Divider my="md" />

              <QuotationTable
                key={`${activeQuotation?.quotationId || 'new'}-${activeQuotation?.versionNumber || 'new'}-${quotationMode}`}
                initialItems={quotationItems}
                initialFinancials={quotationFinancials}
                readOnly={isQuotationReadOnly}
                onChange={handleQuotationTableChange}
              />

              <Divider my="md" />

              <Group justify="space-between">
                <Group gap="xs">
                  {activeQuotation &&
                    ['Approved', 'Rejected'].includes(activeQuotation.quoteStatus) && (
                      <Button
                        variant="light"
                        color="orange"
                        leftSection={<IconRefresh size={16} />}
                        loading={quotationActionLoading}
                        onClick={() => handleCreateNewVersion()}
                      >
                        Create New Version
                      </Button>
                    )}

                  {activeQuotation?.quoteStatus === 'Drafting' && quotationMode === 'view' && (
                    <Button
                      variant="light"
                      color="blue"
                      leftSection={<IconEdit size={16} />}
                      onClick={() => setQuotationMode('edit')}
                    >
                      Edit Quotation
                    </Button>
                  )}
                </Group>

                <Group justify="end">
                  <Button variant="outline" color="brandOrange.6" onClick={() => setFormOpen(false)}>
                    Close
                  </Button>

                  {canEditQuotation && (
                    <Button
                      variant="light"
                      color="brandOrange"
                      loading={quotationSaving}
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </Button>
                  )}

                  {quotationMode === 'edit' && activeQuotation?.quoteStatus === 'Drafting' && (
                    <Button
                      color="brandOrange"
                      leftSection={<IconUpload size={16} />}
                      loading={quotationActionLoading}
                      onClick={handleSendQuotation}
                    >
                      Send to Customer
                    </Button>
                  )}
                </Group>
              </Group>
            </>
          )}
        </Container>
      </Modal>

      <Modal
        opened={decisionOpen}
        onClose={() => setDecisionOpen(false)}
        title="Record Customer Decision"
        size="md"
        radius="md"
      >
        <Text size="sm" c="dimmed" mb="md">
          Record the customer's acceptance or rejection of the current quotation version.
        </Text>

        <Select
          label="Customer Decision"
          value={decisionType}
          onChange={setDecisionType}
          data={[
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' }
          ]}
          mb="md"
        />

        {decisionType === 'Approved' ? (
          <>
            <TextInput label="Decision Date" type="date" defaultValue={getToday()} mb="md" />
            <FileInput
              label="Upload Customer Approval Proof (PDF)"
              placeholder="Select PDF payload"
              leftSection={<IconUpload size={14} />}
              mb="md"
            />
          </>
        ) : (
          <Textarea
            label="Rejection Remarks"
            placeholder="Provide details regarding the customer rejection..."
            rows={3}
            mb="md"
          />
        )}

        <Textarea label="Audit Remarks" placeholder="Optional remarks..." rows={2} mb="xl" />

        <Group justify="end">
          <Button variant="default" onClick={() => setDecisionOpen(false)}>Cancel</Button>
          <Button
            color={decisionType === 'Approved' ? 'green' : 'red'}
            loading={quotationActionLoading}
            onClick={handleDecision}
          >
            {decisionType === 'Approved' ? 'Record Acceptance' : 'Record Rejection'}
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Version Revision Tracking | ${activeQuotation?.quotationId || ''}`}
        size="lg"
        radius="md"
      >
        {historyLoading ? (
          <Text ta="center" py="xl" c="dimmed">Loading version history...</Text>
        ) : history.length === 0 ? (
          <Text ta="center" py="xl" c="dimmed">No version history available.</Text>
        ) : (
          <Timeline active={history.length - 1} bulletSize={24} lineWidth={2} my="md">
            {history.map((hist) => (
              <Timeline.Item
                key={hist.versionNumber}
                bullet={
                  hist.quoteStatus === 'Approved' ? <IconCheck size={12} /> :
                  hist.quoteStatus === 'Rejected' ? <IconX size={12} /> :
                  <IconAlertCircle size={12} />
                }
                title={`Version ${hist.versionNumber} — ${hist.quoteStatus}`}
              >
                <Text size="sm" fw={700} c="brandOrange" mt={4}>{formatOMR(hist.total)}</Text>
                <Text size="xs" c="dimmed" mt={4}>Drafted: {hist.draftedAt}</Text>
                <Text size="xs" c="dimmed" mt={2}>Expires: {hist.expiredAt}</Text>
                <Text size="xs" c="dimmed" mt={2}>Drafted By: {hist.draftedBy}</Text>

                <Divider my="xs" />

                <Text size="sm">Market Price: {formatOMR(hist.marketPrice)}</Text>
                <Text size="sm">Discount: {formatOMR(hist.discountAmount)}</Text>
                <Text size="sm">Tax: {hist.taxPercent ?? 0}%</Text>
                <Text size="sm" fw={700}>Final Total: {formatOMR(hist.total)}</Text>
                <Text size="sm" c="dimmed">Currency: {hist.currencyCode}</Text>

                {hist.addComments && (
                  <Text size="sm" style={{ fontStyle: 'italic' }} mt={6}>
                    Comments: "{hist.addComments}"
                  </Text>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Modal>

      <Modal
        opened={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Record Cash Inflow Ledger Entry"
        size="md"
        radius="md"
      >
        <Grid gap="sm">
          <Grid.Col span={12}>
            <Select
              label="Target Contract Milestone"
              placeholder="Choose asset category trigger"
              data={[
                'Mobilization & Initial Advance',
                'Superstructure Slab Cast Target Completion',
                'Handover Clearance & Final Commissioning'
              ]}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <NumberInput label="Net Cleared Liquid Value (OMR)" prefix="ر.ع. " decimalScale={3} placeholder="Enter amount received" required />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              label="Routing Channel"
              placeholder="Route type"
              data={['NEFT Transfer', 'RTGS Network', 'Corporate Cheque', 'Escrow Account Drop']}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput label="Interbank Trace Ref ID" placeholder="e.g. UTR Number" />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Settlement Execution Date" type="date" defaultValue={getToday()} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea label="Audit Note Entry" placeholder="Add optional remarks..." rows={2} />
          </Grid.Col>
        </Grid>

        <Group justify="end" mt="xl">
          <Button variant="default" onClick={() => setPaymentOpen(false)}>Discard Entry</Button>
          <Button color="teal" onClick={() => setPaymentOpen(false)}>Post To Ledger</Button>
        </Group>
      </Modal>

      <Modal
        opened={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={`Audit Vault Ledger Record | ${selectedReceipt?.id || ''}`}
        size="lg"
        radius="md"
      >
        {selectedReceipt && (
          <Paper p="xl" withBorder style={{ fontFamily: 'monospace' }}>
            <Group justify="between" mb="xl">
              <div>
                <Title order={4}>CASH CLEARANCE RECEIPT</Title>
                <Text size="xs" c="dimmed">AUTOMATED REGISTRY RECORD SYSTEM</Text>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Text fw={700}>{selectedReceipt.id}</Text>
                <Text size="xs">{selectedReceipt.date}</Text>
              </div>
            </Group>

            <Divider my="md" />

            <Grid mb="lg">
              <Grid.Col span={6}>
                <Text fw={700} size="xs">DEPOSITOR PAYEE:</Text>
                <Text size="xs">{selectedReceipt.client}</Text>
                <Text size="xs">Project Focus: {selectedReceipt.proj}</Text>
              </Grid.Col>

              <Grid.Col span={6} style={{ textAlign: 'right' }}>
                <Text fw={700} size="xs">SYSTEM CLEARANCE VECTOR:</Text>
                <Text size="xs">Channel: {selectedReceipt.mode}</Text>
                <Text size="xs">UTR Reference trace: {selectedReceipt.ref}</Text>
              </Grid.Col>
            </Grid>

            <Table variant="simple" mb="xl">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Transaction Allocator Context</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Net Cleared Value</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    Settlement balance tracking item against active progress milestones
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {formatOMR(selectedReceipt.amt)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Group justify="between" mt="xl">
              <Text size="xs" c="dimmed">Sign-off Verification ID: SYSTEM_AUTH_SECURE_2026</Text>
              <Button size="xs" variant="light" color="blue" leftSection={<IconDownload size={14} />}>
                Export Signed Compliance PDF
              </Button>
            </Group>
          </Paper>
        )}
      </Modal>
    </Container>
  );
}

