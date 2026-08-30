"use client";

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Grid,
  Card,
  Table,
  Badge,
  TextInput,
  Select,
  NumberInput,
  Modal,
  Textarea,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconEye,
  IconDownload,
  IconBuildingBank,
  IconTruckDelivery,
  IconUsersGroup,
  IconReceipt,
  IconArchive
} from '@tabler/icons-react';

// ==========================================
// MOCK DATA & INTERFACES
// ==========================================
interface VendorPayment {
  id: string;
  vendorName: string;
  poNumber: string;
  orderAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string;
  status: string;
}

interface SubPayment {
  id: string;
  subName: string;
  woNumber: string;
  project: string;
  contractAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
}

interface CentralReceipt {
  id: string;
  partyName: string;
  type: 'Vendor' | 'Sub-Contractor' | 'Client';
  referenceOrder: string;
  amount: number;
  paymentDate: string;
  mode: string;
  createdBy: string;
}

const mockVendorPayments: VendorPayment[] = [
  { id: 'VP-2026-001', vendorName: 'Oman Steel Industries', poNumber: 'PO-9912', orderAmount: 12500, paidAmount: 8000, dueAmount: 4500, paymentDate: '2026-06-22', status: 'Partially Paid' },
  { id: 'VP-2026-002', vendorName: 'Muscat ReadyMix Concrete', poNumber: 'PO-9945', orderAmount: 6400, paidAmount: 6400, dueAmount: 0, paymentDate: '2026-07-05', status: 'Paid' },
  { id: 'VP-2026-003', vendorName: 'Al-Hajar Quarries', poNumber: 'PO-9988', orderAmount: 3200, paidAmount: 0, dueAmount: 3200, paymentDate: '2026-08-01', status: 'Pending' }
];

const mockSubPayments: SubPayment[] = [
  { id: 'SUB-2026-101', subName: 'Apex MEP Engineering LLC', woNumber: 'WO-401', project: 'Phoenix Commercial Complex', contractAmount: 18500, paidAmount: 10000, dueAmount: 8500, status: 'Partially Paid' },
  { id: 'SUB-2026-102', subName: 'Dhofar Foundation Services', woNumber: 'WO-388', project: 'Nexus Luxury Apartments', contractAmount: 9200, paidAmount: 9200, dueAmount: 0, status: 'Paid' }
];

const mockReceipts: CentralReceipt[] = [
  { id: 'CR-8801', partyName: 'Oman Steel Industries', type: 'Vendor', referenceOrder: 'PO-9912', amount: 8000, paymentDate: '2026-06-22', mode: 'RTGS Network', createdBy: 'Sarah J.' },
  { id: 'CR-8802', partyName: 'Dhofar Foundation Services', type: 'Sub-Contractor', referenceOrder: 'WO-388', amount: 9200, paymentDate: '2026-06-28', mode: 'NEFT Transfer', createdBy: 'Sarah J.' },
  { id: 'CR-8803', partyName: 'Phoenix Infra Corp', type: 'Client', referenceOrder: 'QT-2026-001', amount: 3000, paymentDate: '2026-07-12', mode: 'RTGS Network', createdBy: 'Sarah J.' }
];

// Helper to format values consistently in OMR
const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR' }).format(val);

const OrderStatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    'Paid': 'green',
    'Partially Paid': 'cyan',
    'Pending': 'yellow',
    'Overdue': 'red'
  };
  return <Badge color={colorMap[status] || 'gray'} variant="light" size="xs">{status}</Badge>;
};

// ==========================================
// CORE FINANCE PAGE COMPONENT
// ==========================================
export default function FinanceModule() {
  const [activeTab, setActiveTab] = useState<string | null>('client-pay');

  // Modals Control
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* Page Header */}
      <Paper p="md" radius="md" mb='xl' withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2}>Enterprise Treasury & Finance Control</Title>
            <Text size="sm" c="dimmed">
              Integrated Liquidity Ledger: Client Receivables, Supply Chain Capital Outflows, and Central Audit Register.
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="client-pay" leftSection={<IconBuildingBank size={16} />}>
            Client Payments
          </Tabs.Tab>
          <Tabs.Tab value="vendor-pay" leftSection={<IconTruckDelivery size={16} />}>
            Vendor Outflows
          </Tabs.Tab>
          <Tabs.Tab value="sub-pay" leftSection={<IconUsersGroup size={16} />}>
            Sub-Contractor Valuation
          </Tabs.Tab>
          <Tabs.Tab value="central-cash" leftSection={<IconReceipt size={16} />}>
            Central Cash Register
          </Tabs.Tab>
          <Tabs.Tab value="receipts-archive" leftSection={<IconArchive size={16} />}>
            Receipts Archive
          </Tabs.Tab>
        </Tabs.List>

        {/* ==========================================
            TAB 1: CLIENT PAYMENTS (INBOUND)
           ========================================== */}
        <Tabs.Panel value="client-pay">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={3}>Receivable Ledger Matrix</Title>
              <Text size="sm" c="dimmed">Cross-examine asset receipts against structural target intervals.</Text>
            </div>
            <Button leftSection={<Text size="xs" fw={700}>OMR</Text>} onClick={() => setPaymentOpen(true)}>
              Record Client Payment
            </Button>
          </Group>

          {/* KPI Metrics */}
          <Grid mb="xl">
            {[
              { label: 'GROSS PROJECT VALUE', val: formatOMR(7836.22), c: 'dark' },
              { label: 'ACQUIRED LIQUIDITY', val: formatOMR(5000), c: 'green' },
              { label: 'ESCROW RECEIVABLES BALANCE', val: formatOMR(2836.22), c: 'orange' },
              { label: 'PAST DUE EXPOSURES', val: formatOMR(0), c: 'gray' }
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
                  { m: 'Mobilization & Initial Advance', plan: 2000, paid: 2000, due: 0, date: '2026-06-20', status: 'Paid' },
                  { m: 'Superstructure Slab Cast Target Completion', plan: 3000, paid: 3000, due: 0, date: '2026-07-10', status: 'Paid' },
                  { m: 'Handover Clearance & Final Commissioning', plan: 2836.22, paid: 0, due: 2836.22, date: '2026-09-30', status: 'Pending' }
                ].map((row, i) => (
                  <Table.Tr key={i}>
                    <Table.Td fw={600}>{row.m}</Table.Td>
                    <Table.Td>{formatOMR(row.plan)}</Table.Td>
                    <Table.Td c="green">{formatOMR(row.paid)}</Table.Td>
                    <Table.Td c={row.due > 0 ? 'orange' : 'gray'}>{formatOMR(row.due)}</Table.Td>
                    <Table.Td>{row.date}</Table.Td>
                    <Table.Td><OrderStatusBadge status={row.status} /></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Tabs.Panel>

        {/* ==========================================
            TAB 2: VENDOR PAYMENTS OUTBOUND CONTROL
           ========================================== */}
        <Tabs.Panel value="vendor-pay">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Vendor Capital Outflows Ledger</Text>
                <Button size="xs" leftSection={<IconPlus size={14} />}>New Vendor Disbursement</Button>
              </Group>
              <Table.ScrollContainer minWidth={800}>
                <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px' }}>Payment ID</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Vendor Business Entity</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Linked PO Reference</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Order Commitment</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Disbursed Liquidity</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Outstanding Obligation</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Value Timestamp</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>State</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockVendorPayments.map((v) => (
                      <Table.Tr key={v.id}>
                        <Table.Td><Text size="xs" fw={700}>{v.id}</Text></Table.Td>
                        <Table.Td><Text size="xs" fw={600}>{v.vendorName}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="indigo" fw={600}>{v.poNumber}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs">{formatOMR(v.orderAmount)}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="teal" fw={600}>{formatOMR(v.paidAmount)}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="red" fw={600}>{formatOMR(v.dueAmount)}</Text></Table.Td>
                        <Table.Td><Text size="xs">{v.paymentDate}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={v.status} /></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* ==========================================
            TAB 3: SUB-CONTRACTOR DISBURSEMENTS
           ========================================== */}
        <Tabs.Panel value="sub-pay">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Trade Contract Sub-Contractor Valuation Matrix</Text>
                <Button size="xs" leftSection={<IconPlus size={14} />}>Add Trade Certificate</Button>
              </Group>
              <Table.ScrollContainer minWidth={850}>
                <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px' }}>Disbursement ID</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Sub-Contractor Entity</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Linked Work Order</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Project Allocation Context</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Contract Baseline Valuation</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Released Capital</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Retention Balance Due</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>State Class</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockSubPayments.map((s) => (
                      <Table.Tr key={s.id}>
                        <Table.Td><Text size="xs" fw={700}>{s.id}</Text></Table.Td>
                        <Table.Td><Text size="xs" fw={600}>{s.subName}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="orange" fw={600}>{s.woNumber}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="dimmed">{s.project}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs">{formatOMR(s.contractAmount)}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="teal" fw={600}>{formatOMR(s.paidAmount)}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="red" fw={600}>{formatOMR(s.dueAmount)}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={s.status} /></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* ==========================================
            TAB 4: CENTRAL CASH REGISTER
           ========================================== */}
        <Tabs.Panel value="central-cash">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Immutable Central Cash Book Receipts Register</Text>
              <Table.ScrollContainer minWidth={850}>
                <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '11px' }}>Receipt Index Key</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Counterparty Legal Name</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Class Classification</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Reference Binding Key</Table.Th>
                      <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Executed Value Volume</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Settlement Date</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Banking Channel Mode</Table.Th>
                      <Table.Th style={{ fontSize: '11px' }}>Auditing Operator Token</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockReceipts.map((r) => (
                      <Table.Tr key={r.id}>
                        <Table.Td><Text size="xs" fw={700}>{r.id}</Text></Table.Td>
                        <Table.Td><Text size="xs" fw={600}>{r.partyName}</Text></Table.Td>
                        <Table.Td>
                          <Badge size="xs" variant="dot" color={r.type === "Vendor" ? "blue" : r.type === "Sub-Contractor" ? "orange" : "green"}>
                            {r.type}
                          </Badge>
                        </Table.Td>
                        <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{r.referenceOrder}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={700} c="teal">{formatOMR(r.amount)}</Text></Table.Td>
                        <Table.Td><Text size="xs">{r.paymentDate}</Text></Table.Td>
                        <Table.Td><Text size="xs" fw={500}>{r.mode}</Text></Table.Td>
                        <Table.Td><Text size="10px" c="dimmed">{r.createdBy}</Text></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* ==========================================
            TAB 5: RECEIPTS ARCHIVE
           ========================================== */}
        <Tabs.Panel value="receipts-archive">
          <Title order={3} mb="xs">Cleared Transaction Archive</Title>
          <Text size="sm" c="dimmed" mb="lg">Retrieve generated tax receipts and compliance clearance forms.</Text>

          {/* Filter Bar */}
          <Card withBorder radius="md" p="xs" mb="md">
            <Grid align="center">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput placeholder="Search receipt registry identifier..." leftSection={<IconSearch size={16} />} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select placeholder="Filter Payment Mechanism" data={['NEFT Transfer', 'RTGS Network', 'Corporate Cheque']} clearable />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Button variant="light" fullWidth leftSection={<IconFilter size={16} />}>Execute Query</Button>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Receipts Vault Registry Table */}
          <Table.ScrollContainer minWidth={800}>
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
                  { id: 'REC-2026-8891', proj: 'Phoenix Commercial Complex', client: 'Phoenix Infra Corp', ref: 'NFX261709827', amt: 2000, date: '2026-06-18', mode: 'NEFT' },
                  { id: 'REC-2026-9042', proj: 'Phoenix Commercial Complex', client: 'Phoenix Infra Corp', ref: 'RTGS88726154A', amt: 3000, date: '2026-07-12', mode: 'RTGS' }
                ].map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{r.id}</Table.Td>
                    <Table.Td>{r.proj}</Table.Td>
                    <Table.Td>{r.client}</Table.Td>
                    <Table.Td style={{ fontFamily: 'monospace' }}>{r.ref}</Table.Td>
                    <Table.Td fw={700}>{formatOMR(r.amt)}</Table.Td>
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
          </Table.ScrollContainer>
        </Tabs.Panel>
      </Tabs>

      {/* ==========================================
          MODALS
         ========================================== */}

      {/* 1. Record Payment Modal */}
      <Modal opened={paymentOpen} onClose={() => setPaymentOpen(false)} title="Record Cash Inflow Ledger Entry" size="md" radius="md">
        <Grid gap="sm">
          <Grid.Col span={12}>
            <Select label="Target Contract Milestone" placeholder="Choose asset category trigger" data={['Mobilization & Initial Advance', 'Superstructure Slab Cast Target Completion', 'Handover Clearance & Final Commissioning']} />
          </Grid.Col>
          <Grid.Col span={12}>
            <NumberInput label="Net Cleared Liquid Value (OMR)" prefix="ر.ع. " decimalScale={3} placeholder="Enter amount received" required />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select label="Routing Channel" placeholder="Route type" data={['NEFT Transfer', 'RTGS Network', 'Corporate Cheque', 'Escrow Account Drop']} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Interbank Trace Ref ID" placeholder="e.g. UTR Number" />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput label="Settlement Execution Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
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

      {/* 2. Receipt Viewer Modal */}
      <Modal opened={receiptOpen} onClose={() => setReceiptOpen(false)} title={`Audit Vault Ledger Record | ${selectedReceipt?.id}`} size="lg" radius="md">
        {selectedReceipt && (
          <Paper p="xl" withBorder style={{ fontFamily: 'monospace' }}>
            <Group justify="space-between" mb="xl">
              <div>
                <Title order={4}>CASH CLEARANCE RECEIPT</Title>
                <Text size="xs" c="dimmed">AUTOMATED REGISTRY RECORD SYSTEM</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text fw={700}>{selectedReceipt.id}</Text>
                <Text size="xs">{selectedReceipt.date}</Text>
              </div>
            </Group>

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

            <Group justify="space-between" mt="xl">
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