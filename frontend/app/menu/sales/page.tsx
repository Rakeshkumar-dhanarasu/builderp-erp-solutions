"use client"

import React, { useState } from 'react';
import {
  Stack,
  Tabs,
  Container,
  Group,
  Title,
  Text,
  Button,
  Table,
  Badge,
  TextInput,
  Select,
  Grid,
  Card,
  RingProgress,
  ActionIcon,
  Modal,
  Timeline,
  NumberInput,
  Textarea,
  FileInput,
  Paper,
  Divider,
  Tooltip,
  SimpleGrid
} from '@mantine/core';
import { 
  IconSearch, IconFilter, IconPlus, IconEye, IconEdit, IconUpload, IconTrash,
  IconRefresh, IconFileText, IconDownload,
  IconCheck, IconX, IconAlertCircle, IconHistory, IconFileCheck, IconCalendar
} from '@tabler/icons-react';
import { QuotationTable } from '@/components/QuotationTable';

// ==========================================
// MOCK DATA & INTERFACES
// ==========================================
interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface QuotationVersion {
  version: number;
  date: string;
  createdBy: string;
  reason: string;
  status: string;
  value: number;
}

interface Quotation {
  id: string;
  qNumber: string;
  project: string;
  customer: string;
  version: number;
  totalValue: number;
  createdDate: string;
  status: 'Draft' | 'Sent to Customer' | 'Accepted' | 'Revision Required' | 'Cancelled';
  validUntil: string;
  notes: string;
  items: QuotationItem[];
  history: QuotationVersion[];
}

interface BudgetCategory {
  id: string;
  category: string;
  value: number;
}

const CATEGORY_OPTIONS = [
  'Purchase material',
  'Subcontractors',
  'Transport',
  'Miscellaneous',
  'Labors Force',
];

// Category color mappings for the RingProgress chart
const CATEGORY_COLORS: Record<string, string> = {
  'Purchase material': 'blue',
  'Subcontractors': 'violet',
  'Transport': 'orange',
  'Miscellaneous': 'gray',
  'Labors Force': 'cyan',
};

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'q-1',
    qNumber: 'QT-2026-001',
    project: 'Phoenix Commercial Complex',
    customer: 'Phoenix Infra Corp',
    version: 2,
    totalValue: 7836.22,
    createdDate: '2026-06-15',
    status: 'Accepted',
    validUntil: '2026-08-15',
    notes: 'Standard commercial construction terms apply.',
    items: [
      { id: '1', description: 'Excavation & Shoring', quantity: 1, unit: 'LS', rate: 2011.32, amount: 2011.32 },
      { id: '2', description: 'Structural Steel works', quantity: 150, unit: 'Tons', rate: 40.23, amount: 6034.5 }
    ],
    history: [
      { version: 1, date: '2026-06-10', createdBy: 'Alex Smith', reason: 'Initial submission', status: 'Revision Required', value: 8849.81 },
      { version: 2, date: '2026-06-15', createdBy: 'Alex Smith', reason: 'Discount applied as requested', status: 'Accepted', value: 8045.28 }
    ]
  },
  {
    id: 'q-2',
    qNumber: 'QT-2026-002',
    project: 'Nexus Luxury Apartments',
    customer: 'Nexus Living Spaces',
    version: 1,
    totalValue: 18096,
    createdDate: '2026-07-01',
    status: 'Sent to Customer',
    validUntil: '2026-09-01',
    notes: 'Awaiting client executive panel review.',
    items: [
      { id: '1', description: 'Foundation concrete pour', quantity: 1200, unit: 'CuM', rate: 15.08, amount: 18096 }
    ],
    history: [
      { version: 1, date: '2026-07-01', createdBy: 'Sarah Jenkins', reason: 'Initial proposal', status: 'Sent to Customer', value: 18096 }
    ]
  }
];

// Helper to format values consistently in OMR
const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR' }).format(val);

// ==========================================
// CORE COMPONENT
// ==========================================
export default function SalesModule() {
  const [activeTab, setActiveTab] = useState<string | null>('quotations');
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);

  // 1. Approved Quotations filter & project selection
  const approvedQuotations = quotations.filter((q) => q.status === 'Accepted');
  const [selectedProject, setSelectedProject] = useState<string>(
    approvedQuotations[0]?.project || 'Phoenix Commercial Complex'
  );

  const activeApprovedQuotation = approvedQuotations.find((q) => q.project === selectedProject);
  const approvedContractTotal = activeApprovedQuotation?.totalValue || 0;

  // Modal / Drawer control states
  const [formOpen, setFormOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(null);

  // Form State captures
  const [decisionType, setDecisionType] = useState<string | null>('Accepted');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  // Status mapping colors helper
  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      'Draft': 'gray', 'Sent to Customer': 'blue', 'Accepted': 'green',
      'Revision Required': 'orange', 'Cancelled': 'red', 'Pending': 'yellow',
      'Paid': 'green', 'Partially Paid': 'cyan', 'Overdue': 'red'
    };
    return <Badge color={maps[status] || 'gray'} variant="light">{status}</Badge>;
  };

  // 2. Budget Allocation States (Read/Edit Toggle Flow)
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', category: 'Purchase material', value: 3000 },
    { id: '2', category: 'Labors Force', value: 2000 },
    { id: '3', category: 'Subcontractors', value: 1200 },
    { id: '4', category: 'Miscellaneous', value: 500 },
  ]);
  const [draftCategories, setDraftCategories] = useState<BudgetCategory[]>(categories);
  const [miscReason, setMiscReason] = useState<string>('');

  // Active items being calculated
  const currentCategories = isEditingBudget ? draftCategories : categories;

  // Real-time KPI Calculations
  const totalAllocated = currentCategories.reduce((sum, item) => sum + (item.value || 0), 0);
  const escrowBalance = Math.max(0, approvedContractTotal - totalAllocated);
  const consumptionRatio = approvedContractTotal > 0
    ? ((totalAllocated / approvedContractTotal) * 100).toFixed(1)
    : '0.0';

  const hasMiscCategory = currentCategories.some((item) => item.category === 'Miscellaneous');

  // Budget Edit Handlers
  const handleStartEditingBudget = () => {
    setDraftCategories([...categories]);
    setIsEditingBudget(true);
  };

  const handleSaveBudgetEdits = () => {
    setCategories([...draftCategories]);
    setIsEditingBudget(false);
  };

  const handleCancelBudgetEdits = () => {
    setDraftCategories([...categories]);
    setIsEditingBudget(false);
  };

  const handleAddCategory = () => {
    const newCategory: BudgetCategory = {
      id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}`,
      category: 'Purchase material',
      value: 0,
    };
    setDraftCategories((prev) => [...prev, newCategory]);
  };

  const handleUpdateCategory = (id: string, key: keyof BudgetCategory, val: string | number) => {
    setDraftCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: val } : item))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setDraftCategories((prev) => prev.filter((item) => item.id !== id));
  };

  // RingProgress Sections calculation
  const chartSections = currentCategories.map((cat) => {
    const categoryPct = approvedContractTotal > 0 ? (cat.value / approvedContractTotal) * 100 : 0;
    return {
      value: categoryPct,
      color: CATEGORY_COLORS[cat.category] || 'blue',
      tooltip: `${cat.category}: ${formatOMR(cat.value)} (${categoryPct.toFixed(1)}%)`,
    };
  });

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2} className="enterprise-title">Commercial Lifecycle Engine</Title>
            <Text size="sm" c="dimmed">Manage configurations for Pre-Construction Contracts, Budgets, and Escrow Trackers.</Text>
          </Stack>
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="quotations" leftSection={<IconFileText size={16} />}>Quotations</Tabs.Tab>
          <Tabs.Tab value="budgeting" leftSection={<IconRefresh size={16} />}>Budgeting</Tabs.Tab>
        </Tabs.List>

        {/* ==========================================
            TAB 1: QUOTATIONS MODULE
           ========================================== */}
        <Tabs.Panel value="quotations">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Quotations Engine</Title>
                <Text size="sm" c="dimmed">Track, adjust, and archive customer approval actions across commercial structures.</Text>
              </Stack>
              <Button 
                size="sm"
                leftSection={<IconPlus size={16} />} 
                onClick={() => { setActiveQuotation(null); setFormOpen(true); }}
              >
                Create Quotation
              </Button>
            </Group>
          </Paper>

          {/* Filtering Layout Grid */}
          <Card withBorder radius="md" p="sm" mb="md">
            <Grid align="end">
              <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Search Ref" placeholder="Search customer, project..." leftSection={<IconSearch size={16} />} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}><Select label="Filter Status" placeholder="All Stages" data={['Draft', 'Sent', 'Accepted', 'Revision Required']} clearable /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}><TextInput label="Lifecycle Boundary" type="date" leftSection={<IconCalendar size={16} />} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 2 }}><Button color='brandOrange' fullWidth leftSection={<IconFilter size={16} />}>Apply</Button></Grid.Col>
            </Grid>
          </Card>

          {/* Quotations Table */}
          <Table.ScrollContainer minWidth={800}>
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID/Ref</Table.Th>
                  <Table.Th>Client Target</Table.Th>
                  <Table.Th>Project Scope</Table.Th>
                  <Table.Th>Current Rev</Table.Th>
                  <Table.Th>Gross Book Value</Table.Th>
                  <Table.Th>Status Tier</Table.Th>
                  <Table.Th style={{ width: '150px' }}>Interactions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {quotations.map((q) => (
                  <Table.Tr key={q.id}>
                    <Table.Td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{q.qNumber}</Table.Td>
                    <Table.Td>{q.customer}</Table.Td>
                    <Table.Td>{q.project}</Table.Td>
                    <Table.Td>v{q.version}</Table.Td>
                    <Table.Td>{formatOMR(q.totalValue)}</Table.Td>
                    <Table.Td>{getStatusBadge(q.status)}</Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Examine Frame"><ActionIcon variant="subtle" size="sm" onClick={() => { setActiveQuotation(q); setFormOpen(true); }}><IconEye size={16} /></ActionIcon></Tooltip>
                        <Tooltip label="Version Ledger"><ActionIcon variant="subtle" color="blue" size="sm" onClick={() => { setActiveQuotation(q); setHistoryOpen(true); }}><IconHistory size={16} /></ActionIcon></Tooltip>
                        <Tooltip label="Update Client Status"><ActionIcon variant="subtle" color="green" size="sm" onClick={() => { setActiveQuotation(q); setDecisionOpen(true); }}><IconUpload size={16} /></ActionIcon></Tooltip>
                        <Tooltip label="Acquire Layout Template"><ActionIcon variant="subtle" color="red" size="sm"><IconDownload size={16} /></ActionIcon></Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Tabs.Panel>

        {/* ==========================================
            TAB 2: BUDGETING MODULE
           ========================================== */}
        <Tabs.Panel value="budgeting">
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Title order={3} mb="xs">Operational Allocation Matrix</Title>
                  <Text size="sm" c="dimmed" mb="lg">Distribute approved contract totals down to modular structural accounts below.</Text>
                </Stack>
                <Select 
                  label="Active Approved Project"
                  placeholder="Switch Scope"
                  value={selectedProject}
                  onChange={(val) => val && setSelectedProject(val)}
                  data={approvedQuotations.map((q) => q.project)}
                />
              </Group>

              {/* Top Dynamic KPI Cards */}
              <Grid mb="md">
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
                    <Text size="lg" fw={700} c={escrowBalance >= 0 ? "green" : "red"}>{formatOMR(escrowBalance)}</Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Paper withBorder p="sm" radius="md">
                    <Text size="xs" c="dimmed" fw={700}>CONSUMPTION RATIO</Text>
                    <Text size="lg" fw={700} c={Number(consumptionRatio) > 100 ? "red" : "orange"}>{consumptionRatio}%</Text>
                  </Paper>
                </Grid.Col>
              </Grid>

              {/* Budget Allocation Workspace Table */}
              <Stack gap="md">
                <Group justify="space-between">
                  <Group gap="xs">
                    <Text fw={700}>Cost Object Structures</Text>
                    <Badge variant="light" color="brandOrange">
                      Total: {formatOMR(totalAllocated)}
                    </Badge>
                  </Group>

                  {/* Actions Toggle */}
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
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        leftSection={<IconPlus size={14} />}
                        onClick={handleAddCategory}
                      >
                        Add Category
                      </Button>
                      <Button
                        size="xs"
                        color="brandOrange"
                        leftSection={<IconCheck size={14} />}
                        onClick={handleSaveBudgetEdits}
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
                      {isEditingBudget && <Table.Th style={{ width: '60px' }}></Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentCategories.map((row) => {
                      const pct = totalAllocated > 0 ? ((row.value / totalAllocated) * 100).toFixed(1) : '0.0';

                      return (
                        <Table.Tr key={row.id}>
                          {/* Category Display or Dropdown */}
                          <Table.Td>
                            {isEditingBudget ? (
                              <Select
                                size="xs"
                                data={CATEGORY_OPTIONS}
                                value={row.category}
                                onChange={(val) => handleUpdateCategory(row.id, 'category', val || 'Purchase material')}
                                allowDeselect={false}
                                searchable
                              />
                            ) : (
                              <Text size="sm" fw={500}>{row.category}</Text>
                            )}
                          </Table.Td>

                          {/* Numeric Value Display or Input */}
                          <Table.Td>
                            {isEditingBudget ? (
                              <NumberInput
                                size="xs"
                                prefix="ر.ع. "
                                decimalScale={3}
                                value={row.value}
                                onChange={(val) => handleUpdateCategory(row.id, 'value', typeof val === 'number' ? val : 0)}
                                min={0}
                              />
                            ) : (
                              <Text size="sm">{formatOMR(row.value)}</Text>
                            )}
                          </Table.Td>

                          {/* Weight Percentage */}
                          <Table.Td>
                            <Text size="sm" fw={500}>{pct}%</Text>
                          </Table.Td>

                          {/* Delete Action (visible in edit mode) */}
                          {isEditingBudget && (
                            <Table.Td>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                onClick={() => handleDeleteCategory(row.id)}
                                title="Delete Category"
                                disabled={draftCategories.length <= 1}
                              >
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Table.Td>
                          )}
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>

                {/* Comment section for Miscellaneous Budget usage */}
                {hasMiscCategory && (
                  <Textarea
                    label="Miscellaneous Budget Remarks"
                    placeholder="Specify reasons or scope details for allocating miscellaneous budget..."
                    value={miscReason}
                    onChange={(e) => setMiscReason(e.currentTarget.value)}
                    rows={2}
                    size="xs"
                    readOnly={!isEditingBudget}
                    required
                  />
                )}
              </Stack>
            </Grid.Col>

            {/* Dynamic Side Progress Visualizations */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" p="lg" style={{ height: '100%' }}>
                <Text fw={700} mb="xs" ta="center">Allocation Integrity Map</Text>
                <Divider mb="xl" />
                <Group justify="center" my="lg">
                  <RingProgress
                    size={180}
                    thickness={16}
                    roundCaps
                    sections={chartSections}
                    label={<Text size="xs" ta="center" fw={700} c="dimmed">{consumptionRatio}% Assigned</Text>}
                  />
                </Group>
                <Text size="xs" c="dimmed" ta="center" mt="md">
                  The chart tracks operational structural targets relative to absolute contract valuations.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        
      </Tabs>

      {/* ==========================================
          MODALS & DRAWERS WORKSPACE INTERFACES
         ========================================== */}

      {/* 1. Full Page Quotation Creation Workspace */}
      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={activeQuotation ? "Revise Quotation" : "Draft New Quotation"}
        padding="xl"
        size="100%"
      >
        <Container size="100%">
          <Title order={3} mb="lg">Operational Quote Configuration</Title>
          <SimpleGrid cols={4} spacing='md'>
              <TextInput label="Quotation Ref Number" value={activeQuotation?.qNumber || "QT-2026-AUTO"} disabled />
              <Select label="Select Customer" value={activeQuotation?.customer || "Phoenix Infra Corp"}  data={['Phoenix Infra Corp', 'Nexus Living Spaces']} />
              <TextInput label="Quotation Draft Date" type="date"  defaultValue={activeQuotation?.validUntil || "2026-08-15"} />
              <TextInput label="Quotation Warranty Date" type="date"  defaultValue={activeQuotation?.validUntil || "2026-08-25"} />
          </SimpleGrid>

          <Textarea label="Customer Address" defaultValue={activeQuotation?.notes || ""} rows={1} disabled/>

          <Divider my="md" />
          <Textarea label="Quotation Subject" defaultValue={activeQuotation?.notes || ""} rows={3}/>
          <Divider my="md" />
          
          <QuotationTable/>

          <Divider my='md'/>

          <Group justify="end">
            <Button variant="outline" color="brandOrange.6" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button variant="light" color="brandOrange">Save Draft</Button>
            <Button color="brandOrange" leftSection={<IconCheck size={16} />} onClick={() => setFormOpen(false)}>Finalize</Button>
          </Group>
        </Container>
      </Modal>

      {/* 2. Decision Outcome Action Modal */}
      <Modal
        opened={decisionOpen}
        onClose={() => setDecisionOpen(false)}
        title="Offline Customer Action Registrar"
        size="md"
        radius="md"
      >
        <Text size="sm" c="dimmed" mb="md">
          Record out-of-band client resolutions into systemic project control fields.
        </Text>
        <Select
          label="Verification Assessment Outcome"
          value={decisionType}
          onChange={setDecisionType}
          data={[
            { value: 'Accepted', label: 'Accepted - Complete Legal Signoff' },
            { value: 'Revision Required', label: 'Revision Required - Structural Rework Needed' }
          ]}
          mb="md"
        />

        {decisionType === 'Accepted' ? (
          <>
            <TextInput label="Action Verification Calendar Bound" type="date" defaultValue={new Date().toISOString().split('T')[0]} mb="md" />
            <FileInput label="Upload Scanned Contract Proof (PDF)" placeholder="Select PDF payload" leftSection={<IconUpload size={14} />} mb="md" />
          </>
        ) : (
          <Textarea label="Structural Rework Deficiencies Log" placeholder="Provide detailed rationale for requested modifications..." rows={3} mb="md" />
        )}

        <Textarea label="Audit Log Clerk Remarks" placeholder="Optional notes for history timeline tracking..." rows={2} mb="xl" />

        <Group justify="end">
          <Button variant="default" onClick={() => setDecisionOpen(false)}>Abort Record</Button>
          <Button color="green" onClick={() => setDecisionOpen(false)}>Commit Authorization</Button>
        </Group>
      </Modal>

      {/* 3. Version Control Ledger Modal */}
      <Modal
        opened={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Version Revision Tracking Grid | ${activeQuotation?.qNumber}`}
        size="lg"
        radius="md"
      >
        <Timeline active={activeQuotation?.history.length ? activeQuotation.history.length - 1 : 0} bulletSize={24} lineWidth={2} my="md">
          {activeQuotation?.history.map((hist, idx) => (
            <Timeline.Item 
              key={idx} 
              bullet={hist.status === 'Accepted' ? <IconCheck size={12} /> : <IconAlertCircle size={12} />} 
              title={`Revision Version ${hist.version} [${hist.status}]`}
            >
              <Text size="sm" fw={700} c="brandOrange" mt={4}>{formatOMR(hist.value)}</Text>
              <Text size="xs" c="dimmed" mt={2}>Processed on {hist.date} by {hist.createdBy}</Text>
              <Text size="sm" style={{ fontStyle: 'italic' }} mt={6}>Rationale: "{hist.reason}"</Text>
              <Button size="xs" variant="subtle" mt="sm" leftSection={<IconEye size={12} />}>View Snapshot State</Button>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>

      {/* 4. Liquidity Inflow Entry Modal */}
      <Modal
        opened={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Record Cash Inflow Ledger Entry"
        size="md"
        radius="md"
      >
        <Grid gap="sm">
          <Grid.Col span={12}><Select label="Target Contract Milestone" placeholder="Choose asset category trigger" data={['Mobilization & Initial Advance', 'Superstructure Slab Cast Target Completion', 'Handover Clearance & Final Commissioning']} /></Grid.Col>
          <Grid.Col span={12}><NumberInput label="Net Cleared Liquid Value (OMR)" prefix="ر.ع. " decimalScale={3} placeholder="Enter amount received" required /></Grid.Col>
          <Grid.Col span={6}><Select label="Routing Channel" placeholder="Route type" data={['NEFT Transfer', 'RTGS Network', 'Corporate Cheque', 'Escrow Account Drop']} /></Grid.Col>
          <Grid.Col span={6}><TextInput label="Interbank Trace Ref ID" placeholder="e.g. UTR Number" /></Grid.Col>
          <Grid.Col span={12}><TextInput label="Settlement Execution Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} /></Grid.Col>
          <Grid.Col span={12}><Textarea label="Audit Note Entry" placeholder="Add optional remarks..." rows={2} /></Grid.Col>
        </Grid>
        <Group justify="end" mt="xl">
          <Button variant="default" onClick={() => setPaymentOpen(false)}>Discard Entry</Button>
          <Button color="teal" onClick={() => setPaymentOpen(false)}>Post To Ledger</Button>
        </Group>
      </Modal>

      {/* 5. Invoice Document Render Modal */}
      <Modal
        opened={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={`Audit Vault Ledger Record | ${selectedReceipt?.id}`}
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
                  <Table.Td>Settlement balance tracking item against active progress milestones</Table.Td>
                  <Table.Td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatOMR(selectedReceipt.amt)}</Table.Td>
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