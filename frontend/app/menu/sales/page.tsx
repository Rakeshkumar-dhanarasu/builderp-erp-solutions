"use client"

import React, { useState } from 'react';
import {
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
  Drawer,
  Timeline,
  NumberInput,
  Textarea,
  FileInput,
  Paper,
  Divider,
  Tooltip
} from '@mantine/core';
import { 
  IconSearch, IconFilter, IconPlus, IconEye, IconEdit, IconUpload, 
  IconRefresh, IconFileText, IconDownload, IconArrowRight, IconCurrencyRupee, 
  IconCheck, IconX, IconAlertCircle, IconHistory, IconFileCheck, IconCalendar
} from '@tabler/icons-react';

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

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'q-1',
    qNumber: 'QT-2026-001',
    project: 'Phoenix Commercial Complex',
    customer: 'Phoenix Infra Corp',
    version: 2,
    totalValue: 2000000,
    createdDate: '2026-06-15',
    status: 'Accepted',
    validUntil: '2026-08-15',
    notes: 'Standard commercial construction terms apply.',
    items: [
      { id: '1', description: 'Excavation & Shoring', quantity: 1, unit: 'LS', rate: 500000, amount: 500000 },
      { id: '2', description: 'Structural Steel works', quantity: 150, unit: 'Tons', rate: 10000, amount: 1500000 }
    ],
    history: [
      { version: 1, date: '2026-06-10', createdBy: 'Alex Smith', reason: 'Initial submission', status: 'Revision Required', value: 2200000 },
      { version: 2, date: '2026-06-15', createdBy: 'Alex Smith', reason: 'Discount applied as requested', status: 'Accepted', value: 2000000 }
    ]
  },
  {
    id: 'q-2',
    qNumber: 'QT-2026-002',
    project: 'Nexus Luxury Apartments',
    customer: 'Nexus Living Spaces',
    version: 1,
    totalValue: 4500000,
    createdDate: '2026-07-01',
    status: 'Sent to Customer',
    validUntil: '2026-09-01',
    notes: 'Awaiting client executive panel review.',
    items: [
      { id: '1', description: 'Foundation concrete pour', quantity: 1200, unit: 'CuM', rate: 3750, amount: 4500000 }
    ],
    history: [
      { version: 1, date: '2026-07-01', createdBy: 'Sarah Jenkins', reason: 'Initial proposal', status: 'Sent to Customer', value: 4500000 }
    ]
  }
];

// ==========================================
// CORE COMPONENT
// ==========================================
export default function SalesModule() {
  const [activeTab, setActiveTab] = useState<string | null>('quotations');
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [selectedProject, setSelectedProject] = useState<string>('Phoenix Commercial Complex');

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

  return (
    <Container size="xl" py="md">
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="between" mb="xs">
          <div>
            <Title order={2} className="enterprise-title">Commercial Lifecycle Engine</Title>
            <Text size="sm" c="dimmed">Manage configurations for Pre-Construction Contracts, Budgets, and Escrow Trackers.</Text>
          </div>
          <Select 
            label="Active Enterprise Project"
            placeholder="Switch Scope"
            value={selectedProject}
            onChange={(val) => val && setSelectedProject(val)}
            data={[
              'Phoenix Commercial Complex',
              'Nexus Luxury Apartments'
            ]}
          />
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="quotations" leftSection={<IconFileText size={16} />}>Quotations</Tabs.Tab>
          <Tabs.Tab value="budgeting" leftSection={<IconRefresh size={16} />}>Budgeting</Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<IconCurrencyRupee size={16} />}>Client Payments</Tabs.Tab>
          <Tabs.Tab value="receipts" leftSection={<IconFileCheck size={16} />}>Receipts Archive</Tabs.Tab>
        </Tabs.List>

        {/* ==========================================
            TAB 1: QUOTATIONS MODULE
           ========================================== */}
        <Tabs.Panel value="quotations">
          <Group justify="between" mb="md">
            <div>
              <Title order={3}>Quotations Engine</Title>
              <Text size="sm" c="dimmed">Track, adjust, and archive customer approval actions across commercial structures.</Text>
            </div>
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setActiveQuotation(null); setFormOpen(true); }}>
              Create Quotation
            </Button>
          </Group>

          {/* Filtering Layout Grid */}
          <Card withBorder radius="md" p="sm" mb="md">
            <Grid align="end">
              <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Search Ref" placeholder="Search customer, project..." leftSection={<IconSearch size={16} />} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}><Select label="Filter Status" placeholder="All Stages" data={['Draft', 'Sent', 'Accepted', 'Revision Required']} clearable /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 3 }}><TextInput label="Lifecycle Boundary" type="date" leftSection={<IconCalendar size={16} />} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4, md: 2 }}><Button variant="light" fullWidth leftSection={<IconFilter size={16} />}>Apply</Button></Grid.Col>
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
                    <Table.Td>₹{q.totalValue.toLocaleString('en-IN')}</Table.Td>
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
              <Title order={3} mb="xs">Operational Allocation Matrix</Title>
              <Text size="sm" c="dimmed" mb="lg">Distribute approved contract totals down to modular structural accounts below.</Text>
              
              <Grid mb="md">
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Paper withBorder p="sm" radius="md">
                    <Text size="xs" c="dimmed" fw={700}>APPROVED CONTRACT</Text>
                    <Text size="lg" fw={700}>₹20,00,000</Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Paper withBorder p="sm" radius="md">
                    <Text size="xs" c="dimmed" fw={700}>ALLOCATED SUM</Text>
                    <Text size="lg" fw={700} c="blue">₹14,50,000</Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Paper withBorder p="sm" radius="md">
                    <Text size="xs" c="dimmed" fw={700}>ESCROW BALANCE</Text>
                    <Text size="lg" fw={700} c="green">₹5,50,000</Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Paper withBorder p="sm" radius="md">
                    <Text size="xs" c="dimmed" fw={700}>CONSUMPTION RATIO</Text>
                    <Text size="lg" fw={700} c="orange">72.5%</Text>
                  </Paper>
                </Grid.Col>
              </Grid>

              {/* Budget Allocation Workspace Table */}
              <Card withBorder radius="md" p="sm" mb="xl">
                <Group justify="between" mb="md">
                  <Text fw={700}>Cost Object Structures</Text>
                  <Button size="xs" variant="light" leftSection={<IconPlus size={14} />}>Add Budget Category</Button>
                </Group>
                <Table variant="simple" verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Cost Ledger Target</Table.Th>
                      <Table.Th style={{ width: '200px' }}>Target Floor Value (INR)</Table.Th>
                      <Table.Th>Weight Distribution</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {[
                      { cat: 'Raw Materials & Bulk Aggregate', val: 600000, pct: 30 },
                      { cat: 'Onsite Labor & Subcontract Workforces', val: 400000, pct: 20 },
                      { cat: 'Equipment Leasing & Heavy Logistics', val: 250000, pct: 12.5 },
                      { cat: 'Site Overhead & Compliance Certifications', val: 200000, pct: 10 }
                    ].map((row, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td fw={500}>{row.cat}</Table.Td>
                        <Table.Td><NumberInput size="xs" prefix="₹" decimalScale={2} defaultValue={row.val} /></Table.Td>
                        <Table.Td><Text size="sm">{row.pct}%</Text></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>

            {/* Side Progress & Visualizations */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" p="lg" style={{ height: '100%' }}>
                <Text fw={700} mb="xs" ta="center">Allocation Integrity Map</Text>
                <Divider mb="xl" />
                <Group justify="center" my="lg">
                  <RingProgress
                    size={180}
                    thickness={16}
                    roundCaps
                    sections={[
                      { value: 30, color: 'blue', tooltip: 'Materials' },
                      { value: 20, color: 'cyan', tooltip: 'Labor' },
                      { value: 12.5, color: 'orange', tooltip: 'Equipment' },
                      { value: 10, color: 'violet', tooltip: 'Overheads' },
                    ]}
                    label={<Text size="xs" ta="center" fw={700} c="dimmed">72.5% Assigned</Text>}
                  />
                </Group>
                <Text size="xs" c="dimmed" ta="center" mt="md">
                  The chart tracks operational structural targets relative to absolute contract valuations.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Payment Planning Milestone Scheduler Sub-Section */}
          <Title order={4} mb="sm" mt="xl">Contracted Tranche & Milestone Forecast</Title>
          <Table withTableBorder highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Phase Target Trigger</Table.Th>
                <Table.Th>Distribution Weight</Table.Th>
                <Table.Th>Tranche Milestone Sum</Table.Th>
                <Table.Th>Target Calendar Bound</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                { phase: 'Mobilization & Initial Advance', pct: '25%', sum: '₹5,00,000', date: 'Project Initialization' },
                { phase: 'Superstructure Slab Cast Target Completion', pct: '40%', sum: '₹8,00,000', date: 'Phase 2 Threshold' },
                { phase: 'Handover Clearance & Final Commissioning', pct: '35%', sum: '₹7,00,000', date: 'Terminal Signoff' }
              ].map((m, i) => (
                <Table.Tr key={i}>
                  <Table.Td fw={600}>{m.phase}</Table.Td>
                  <Table.Td>{m.pct}</Table.Td>
                  <Table.Td c="blue" fw={700}>{m.sum}</Table.Td>
                  <Table.Td>{m.date}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        {/* ==========================================
            TAB 3: CLIENT PAYMENTS TRACKER
           ========================================== */}
        <Tabs.Panel value="payments">
          <Group justify="between" mb="lg">
            <div>
              <Title order={3}>Receivable Ledger Matrix</Title>
              <Text size="sm" c="dimmed">Cross-examine asset receipts against structural target intervals.</Text>
            </div>
            <Button leftSection={<IconCurrencyRupee size={16} />} color="teal" onClick={() => setPaymentOpen(true)}>
              Record Client Payment
            </Button>
          </Group>

          {/* Metrics Panel Array */}
          <Grid mb="xl">
            {[
              { label: 'GROSS PROJECT VALUE', val: '₹20,00,000', c: 'dark' },
              { label: 'ACQUIRED LIQUIDITY', val: '₹13,00,000', c: 'green' },
              { label: 'ESCROW RECEIVABLES BALANCE', val: '₹7,00,000', c: 'orange' },
              { label: 'PAST DUE EXPOSURES', val: '₹0.00', c: 'gray' }
            ].map((card, i) => (
              <Grid.Col span={{ base: 6, sm: 3 }} key={i}>
                <Paper p="md" radius="md" withBorder>
                  <Text size="xs" c="dimmed" fw={700}>{card.label}</Text>
                  <Text size="xl" fw={700} c={card.c !== 'dark' ? card.c : undefined}>{card.val}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          {/* Master Payment Targets Schedule */}
          <Title order={4} mb="md">Milestone Verification Tracks</Title>
          <Table.ScrollContainer minWidth={800} mb="xl">
            <Table withTableBorder highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Structural Target Anchor</Table.Th>
                  <Table.Th>Contracted Sum</Table.Th>
                  <Table.Th>Settled Component</Table.Th>
                  <Table.Th>Outstanding Balance</Table.Th>
                  <Table.Th>Target Boundary</Table.Th>
                  <Table.Th>Status Tiers</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {[
                  { m: 'Mobilization & Initial Advance', plan: 500000, paid: 500000, due: 0, date: '2026-06-20', status: 'Paid' },
                  { m: 'Superstructure Slab Cast Target Completion', plan: 800000, paid: 800000, due: 0, date: '2026-07-10', status: 'Paid' },
                  { m: 'Handover Clearance & Final Commissioning', plan: 700000, paid: 0, due: 700000, date: '2026-09-30', status: 'Pending' }
                ].map((row, i) => (
                  <Table.Tr key={i}>
                    <Table.Td fw={600}>{row.m}</Table.Td>
                    <Table.Td>₹{row.plan.toLocaleString('en-IN')}</Table.Td>
                    <Table.Td c="green">₹{row.paid.toLocaleString('en-IN')}</Table.Td>
                    <Table.Td c={row.due > 0 ? 'orange' : 'gray'}>₹{row.due.toLocaleString('en-IN')}</Table.Td>
                    <Table.Td>{row.date}</Table.Td>
                    <Table.Td>{getStatusBadge(row.status)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {/* Transaction Ledger Records */}
          <Title order={4} mb="md">Historical Inflow Ledger</Title>
          <Table variant="striped" withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Clearing Date</Table.Th>
                <Table.Th>Settled Sum</Table.Th>
                <Table.Th>Channel Route</Table.Th>
                <Table.Th>Gateway System Identifier</Table.Th>
                <Table.Th>Clerk Entry Signoff</Table.Th>
                <Table.Th>Internal Audit Logs</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                { date: '2026-06-18', amt: 500000, mode: 'NEFT Transfer', ref: 'NFX261709827', user: 'Sarah J.', note: 'Advance mobilization clearing check' },
                { date: '2026-07-12', amt: 800000, mode: 'RTGS Network', ref: 'RTGS88726154A', user: 'Sarah J.', note: 'Slab structural step completion release' }
              ].map((h, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{h.date}</Table.Td>
                  <Table.Td fw={700} c="green">₹{h.amt.toLocaleString('en-IN')}</Table.Td>
                  <Table.Td>{h.mode}</Table.Td>
                  <Table.Td style={{ fontFamily: 'monospace' }}>{h.ref}</Table.Td>
                  <Table.Td>{h.user}</Table.Td>
                  <Table.Td><Text size="xs" c="dimmed">{h.note}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>

        {/* ==========================================
            TAB 4: RECEIPTS ARCHIVE MODULE
           ========================================== */}
        <Tabs.Panel value="receipts">
          <Title order={3} mb="xs">Cleared Transaction Archive</Title>
          <Text size="sm" c="dimmed" mb="lg">Retrieve generated tax receipts and compliance clearance forms.</Text>

          {/* Filter Bar */}
          <Card withBorder radius="md" p="xs" mb="md">
            <Group justify="spaced" grow>
              <TextInput placeholder="Search receipt registry identifier..." leftSection={<IconSearch size={16} />} />
              <Select placeholder="Filter Payment Mechanism" data={['NEFT Transfer', 'RTGS Network', 'Corporate Cheque']} clearable />
              <Button variant="light" leftSection={<IconFilter size={16} />}>Execute Evaluation Query</Button>
            </Group>
          </Card>

          {/* Receipts Vault Registry Table */}
          <Table highlightOnHover verticalSpacing="md" withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Receipt Anchor Token</Table.Th>
                <Table.Th>Enterprise Context</Table.Th>
                <Table.Th>Client Corporate Handle</Table.Th>
                <Table.Th>Assoc Clear Reference</Table.Th>
                <Table.Th>Net Value Passed</Table.Th>
                <Table.Th>System Entry Execution</Table.Th>
                <Table.Th>Vault Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                { id: 'REC-2026-8891', proj: 'Phoenix Commercial Complex', client: 'Phoenix Infra Corp', ref: 'NFX261709827', amt: 500000, date: '2026-06-18', mode: 'NEFT' },
                { id: 'REC-2026-9042', proj: 'Phoenix Commercial Complex', client: 'Phoenix Infra Corp', ref: 'RTGS88726154A', amt: 800000, date: '2026-07-12', mode: 'RTGS' }
              ].map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{r.id}</Table.Td>
                  <Table.Td>{r.proj}</Table.Td>
                  <Table.Td>{r.client}</Table.Td>
                  <Table.Td style={{ fontFamily: 'monospace' }}>{r.ref}</Table.Td>
                  <Table.Td fw={700}>₹{r.amt.toLocaleString('en-IN')}</Table.Td>
                  <Table.Td>{r.date}</Table.Td>
                  <Table.Td>
                    <Group gap={8}>
                      <Button size="xs" variant="default" leftSection={<IconEye size={12} />} onClick={() => { setSelectedReceipt(r); setReceiptOpen(true); }}>
                        Review Layout
                      </Button>
                      <ActionIcon variant="light" color="red" size="sm">
                        <IconDownload size={14} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>

      {/* ==========================================
          MODALS & DRAWERS WORKSPACE INTERFACES
         ========================================== */}

      {/* 1. Full Page Quotation Creation Workspace (Drawer) */}
      <Drawer
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={activeQuotation ? "Review System Quotation Record" : "Draft New System Quotation Component"}
        padding="xl"
        size="100%"
        position="right"
      >
        <Container size="lg">
          <Title order={3} mb="lg">Operational Quote Configuration</Title>
          <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput 
                label="Quotation Ref Number" 
                value={activeQuotation?.qNumber || "QT-2026-AUTO"} 
                disabled 
              />
            </Grid.Col>

            {/* 2. Target Client Scope */}
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select 
                label="Target Client Scope" 
                // If using @mantine/form, replace value/onChange with: {...form.getInputProps('customer')}
                value={activeQuotation?.customer || "Phoenix Infra Corp"} 
                data={['Phoenix Infra Corp', 'Nexus Living Spaces']} 
              />
            </Grid.Col>

            {/* 3. Warranty Validation Limit (Date picker or native date string) */}
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput 
                label="Warranty Validation Limit" 
                type="date" 
                defaultValue={activeQuotation?.validUntil || "2026-08-15"} 
              />
            </Grid.Col>

            {/* 4. Preamble Notes */}
            <Grid.Col span={12}>
              <Textarea 
                label="Preamble Structural Context Notes" 
                defaultValue={activeQuotation?.notes || ""} 
                rows={3} 
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" label="Itemized Line Schedule Configurations" labelPosition="center" />
          
          <Table withTableBorder withColumnBorders mb="xl">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Work Object Element</Table.Th>
                <Table.Th style={{ width: '100px' }}>Quantity</Table.Th>
                <Table.Th style={{ width: '100px' }}>Unit Type</Table.Th>
                <Table.Th style={{ width: '150px' }}>Unit Rate (INR)</Table.Th>
                <Table.Th style={{ width: '150px' }}>Net Segment Sum</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(activeQuotation?.items || [
                { id: '1', description: 'Excavation Engineering Works', quantity: 1, unit: 'LS', rate: 500000, amount: 500000 }
              ]).map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td><TextInput defaultValue={item.description} size="xs" /></Table.Td>
                  <Table.Td><NumberInput defaultValue={item.quantity} size="xs" /></Table.Td>
                  <Table.Td><TextInput defaultValue={item.unit} size="xs" /></Table.Td>
                  <Table.Td><NumberInput defaultValue={item.rate} prefix="₹" size="xs" /></Table.Td>
                  <Table.Td fw={600} style={{ verticalAlign: 'middle' }}>₹{item.amount.toLocaleString('en-IN')}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Paper withBorder p="md" radius="md" style={{ maxWidth: '400px', marginLeft: 'auto' }} mb="xl">
            <Group justify="between" mb="xs"><Text size="sm">Tax Levies (GST 18%):</Text><Text size="sm" fw={700}>Calculated at Submission</Text></Group>
            <Group justify="between" mb="xs"><Text size="sm">Corporate Reprieve Discount:</Text><Text size="sm" fw={700}>₹0.00</Text></Group>
            <Divider my="xs" />
            <Group justify="between"><Text fw={700}>Target Gross Contract sum:</Text><Text size="lg" fw={800} c="blue">₹{(activeQuotation?.totalValue || 500000).toLocaleString('en-IN')}</Text></Group>
          </Paper>

          <Group justify="end">
            <Button variant="outline" color="gray" onClick={() => setFormOpen(false)}>Cancel / Exit View</Button>
            <Button variant="light" color="blue">Save Blueprint Draft</Button>
            <Button color="green" leftSection={<IconCheck size={16} />} onClick={() => setFormOpen(false)}>Commit & Finalize Record</Button>
          </Group>
        </Container>
      </Drawer>

      {/* 2. Manual External Validation Processing Terminal (Modal) */}
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

      {/* 3. Historical Version Control Ledger (Modal) */}
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
              <Text size="sm" fw={700} c="blue" mt={4}>₹{hist.value.toLocaleString('en-IN')}</Text>
              <Text size="xs" c="dimmed" mt={2}>Processed on {hist.date} by {hist.createdBy}</Text>
              <Text size="sm" style={{ fontStyle: 'italic' }} mt={6}>Rationale: "{hist.reason}"</Text>
              <Button size="xs" variant="subtle" mt="sm" leftSection={<IconEye size={12} />}>View Snapshot State</Button>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>

      {/* 4. Liquidity Inflow Execution Entry (Modal) */}
      <Modal
        opened={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Record Cash Inflow Ledger Entry"
        size="md"
        radius="md"
      >
        <Grid gap="sm">
          <Grid.Col span={12}><Select label="Target Contract Milestone" placeholder="Choose asset category trigger" data={['Mobilization & Initial Advance', 'Superstructure Slab Cast Target Completion', 'Handover Clearance & Final Commissioning']} /></Grid.Col>
          <Grid.Col span={12}><NumberInput label="Net Cleared Liquid Value (INR)" prefix="₹" placeholder="Enter amount received" required /></Grid.Col>
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

      {/* 5. System Invoice Document Render Workspace (Modal) */}
      <Modal
        opened={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={`Audit Vault Ledger Record | ${selectedReceipt?.id}`}
        size="lg"
        radius="md"
      >
        {selectedReceipt && (
          <Paper p="xl" withBorder style={{ backgroundColor: '#fafafa', fontFamily: 'monospace' }}>
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
                  <Table.Td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{selectedReceipt.amt.toLocaleString('en-IN')}</Table.Td>
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