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
  MultiSelect,
  Grid,
  Card,
  RingProgress,
  ActionIcon,
  Modal,
  Paper,
  Divider,
  Progress,
  Tooltip,
  Pagination,
  Menu
} from '@mantine/core';
import {
  IconSearch, IconFilter, IconDownload, IconPrinter, IconLayoutGrid, IconUsers,
  IconShoppingCart, IconArchive, IconCurrencyRupee, IconChartPie, IconMaximize,
  IconColumns, IconTrendingUp, IconAlertTriangle, IconRotate, IconCheck
} from '@tabler/icons-react';

// ==========================================
// CENTRAL COMPONENT MOCK DATA STRATEGIES
// ==========================================
const PROJECT_LIST = ['Phoenix Commercial Complex', 'Nexus Luxury Apartments', 'Vertex Tech Park'];
const STAKEHOLDER_COUNTS = { totalCust: 14, totalVend: 28, totalSub: 19, active: 48, inactive: 13 };
const PURCHASE_COUNTS = { totalPO: 142, active: 31, completed: 111, pendDeliv: 9, pendVendPay: 14, pendSubPay: 6 };
const INVENTORY_COUNTS = { totalItems: 420, avail: 380, lowStock: 32, outStock: 8, totalGodowns: 4, incoming: 12 };
const SALES_COUNTS = { totalQ: 84, accepted: 52, revision: 12, budgetAlloc: 8500000, received: 6200000, outstanding: 2300000 };
const PROJECT_COUNTS = { totalProj: 12, active: 5, completed: 6, delayed: 1, budgetUtil: 68, overallComp: 74 };

// ==========================================
// CORE MODULE IMPLEMENTATION
// ==========================================
export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState<string | null>('stakeholders');
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [fullscreenReport, setFullscreenReport] = useState(false);

  // Status Colors Helper
  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      'Active': 'green', 'Inactive': 'gray', 'Completed': 'green', 'Pending': 'yellow',
      'Delayed': 'red', 'Accepted': 'green', 'Under Revision': 'orange', 'Paid': 'green',
      'Overdue': 'red', 'High': 'red', 'Medium': 'orange', 'Low': 'gray'
    };
    return <Badge color={maps[status] || 'blue'} variant="light">{status}</Badge>;
  };

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* Module Title Banner */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" mb="xs" align="center">
          <div>
            <Title order={2}>Centralized Reporting & Business Analytics Center</Title>
            <Text size="sm" c="dimmed">Cross-examine ledger matrices and structural metrics aggregated across modules.</Text>
          </div>
          <Group gap="xs">
            <Button size="sm" variant="outline" color="gray" leftSection={<IconRotate size={18} />}>Reset Filters</Button>
            <Button size="sm" variant="light" leftSection={<IconPrinter size={18} />}>Print Master Dashboard</Button>
          </Group>
        </Group>
      </Paper>

      {/* ==========================================
          GLOBAL FILTER BAR SECTION
         ========================================== */}
      <Card withBorder radius="md" p="md" mb="xl">
        <Text size="xs" fw={700} c="dimmed" mb="xs">GLOBAL REPORT PARAMS</Text>
        <Grid align="end">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput type="date" label="Horizon Start Window" defaultValue="2026-01-01" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <MultiSelect label="Filter Enterprise Scope" placeholder="All Active Projects" data={PROJECT_LIST} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select label="Client Target" placeholder="Select Customer" data={['Phoenix Infra Corp', 'Nexus Living Spaces']} clearable />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Select label="Supply Vector" placeholder="Select Vendor" data={['Ambuja Cements', 'Jindal Steel']} clearable />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Button fullWidth color="blue" leftSection={<IconFilter size={16} />}>Generate</Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Navigation Layer */}
      <Tabs value={activeTab} onChange={setActiveTab} color='#DC7B0A' variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="stakeholders" leftSection={<IconUsers size={16} />}>Stakeholder Reports</Tabs.Tab>
          <Tabs.Tab value="purchase" leftSection={<IconShoppingCart size={16} />}>Purchase Reports</Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<IconArchive size={16} />}>Inventory Reports</Tabs.Tab>
          <Tabs.Tab value="sales" leftSection={<IconCurrencyRupee size={16} />}>Sales Reports</Tabs.Tab>
          <Tabs.Tab value="projects" leftSection={<IconLayoutGrid size={16} />}>Project Reports</Tabs.Tab>
        </Tabs.List>

        {/* ==========================================
            TAB 1: STAKEHOLDER ARCHIVES
           ========================================== */}
        <Tabs.Panel value="stakeholders">
          {/* Summary Panels */}
          <Grid mb="xl">
            {[
              { title: 'Total Customers', val: STAKEHOLDER_COUNTS.totalCust },
              { title: 'Total Suppliers/Vendors', val: STAKEHOLDER_COUNTS.totalVend },
              { title: 'Total Subcontractors', val: STAKEHOLDER_COUNTS.totalSub },
              { title: 'Operational Run-rate (Active)', val: STAKEHOLDER_COUNTS.active, color: 'green' }
            ].map((card, i) => (
              <Grid.Col span={{ base: 6, sm: 3 }} key={i}>
                <Paper withBorder p="sm" radius="md">
                  <Text size="xs" c="dimmed" fw={700}>{card.title.toUpperCase()}</Text>
                  <Text size="xl" fw={700} c={card.color}>{card.val}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          <ReportTableSection 
            title="Customer Enterprise Ledger Balance"
            onView={() => setViewingReport({ title: "Customer Report Archive" })}
            headers={['Customer Name', 'Projects Handled', 'Gross Quote Value', 'Payments Acquired', 'Outstanding Gap', 'Status']}
            rows={[
              ['Phoenix Infra Corp', '2 Active', '₹20,00,000', '₹13,00,000', '₹7,00,000', 'Active'],
              ['Nexus Living Spaces', '1 Active', '₹45,00,000', '₹45,00,000', '₹0.00', 'Active']
            ]}
            badgeColIndex={5}
          />
        </Tabs.Panel>

        {/* ==========================================
            TAB 2: PROCUREMENT & PURCHASING
           ========================================== */}
        <Tabs.Panel value="purchase">
          <Grid mb="xl">
            {[
              { title: 'Total PO Files Issued', val: PURCHASE_COUNTS.totalPO },
              { title: 'Active Supply Chains', val: PURCHASE_COUNTS.active, color: 'blue' },
              { title: 'Pending Deliveries Inbound', val: PURCHASE_COUNTS.pendDeliv, color: 'orange' },
              { title: 'Outstanding Vendor Liabilities', val: PURCHASE_COUNTS.pendVendPay, color: 'red' }
            ].map((card, i) => (
              <Grid.Col span={{ base: 6, sm: 3 }} key={i}>
                <Paper withBorder p="sm" radius="md">
                  <Text size="xs" c="dimmed" fw={700}>{card.title.toUpperCase()}</Text>
                  <Text size="xl" fw={700} c={card.color}>{card.val}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          <ReportTableSection 
            title="Purchase Order Ledger Records"
            onView={() => setViewingReport({ title: "Purchase Order Register" })}
            headers={['PO Identifier', 'Asset Class', 'Associated Supplier', 'Target Scope', 'Gross Value Passed', 'Status']}
            rows={[
              ['PO-2026-0041', 'Aggregates & Bulk Cement', 'Ambuja Cements Ltd', 'Phoenix Complex', '₹6,50,000', 'Completed'],
              ['PO-2026-0042', 'Structural I-Beams Structural Tonnage', 'Jindal Steel Frameworks', 'Nexus Spaces', '₹14,20,000', 'Pending']
            ]}
            badgeColIndex={5}
          />
        </Tabs.Panel>

        {/* ==========================================
            TAB 3: INVENTORY LOGISTICS
           ========================================== */}
        <Tabs.Panel value="inventory">
          <Grid mb="xl" align="stretch">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid>
                {[
                  { title: 'Total Managed Item Classes', val: INVENTORY_COUNTS.totalItems },
                  { title: 'Liquid Available Reserves', val: INVENTORY_COUNTS.avail },
                  { title: 'Deficient Critical Shortages (Low Stock)', val: INVENTORY_COUNTS.lowStock, color: 'orange' },
                  { title: 'Depleted Stockout Exposures', val: INVENTORY_COUNTS.outStock, color: 'red' }
                ].map((card, i) => (
                  <Grid.Col span={{ base: 6 }} key={i}>
                    <Paper withBorder p="sm" radius="md">
                      <Text size="xs" c="dimmed" fw={700}>{card.title.toUpperCase()}</Text>
                      <Text size="lg" fw={700} c={card.color}>{card.val}</Text>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="sm" radius="md">
                <Text size="xs" fw={700} c="dimmed" mb="xs">GODOWN UTILIZATION SUMMARY</Text>
                <div style={{ marginBottom: '10px' }}>
                  <Group justify="between" mb={4}><Text size="xs">Main Yards Warehouse A</Text><Text size="xs" fw={700}>82%</Text></Group>
                  <Progress color="blue" value={82} radius="xl" />
                </div>
                <div>
                  <Group justify="between" mb={4}><Text size="xs">Structural Storage Facility B</Text><Text size="xs" fw={700}>41%</Text></Group>
                  <Progress color="cyan" value={41} radius="xl" />
                </div>
              </Card>
            </Grid.Col>
          </Grid>

          <ReportTableSection 
            title="Real-time Inventory Allocations Status"
            onView={() => setViewingReport({ title: "In-hand Warehouse Register" })}
            headers={['Material Element Description', 'Category Set', 'Godown Yard Allocation', 'In-Hand Volume Available', 'Unit Metrics', 'Safety Status']}
            rows={[
              ['M30 Structural Concrete Grade Mix', 'Bulk Materials', 'Main Yards Warehouse A', '1,450', 'CuM', 'Active'],
              ['High-Tensile Steel Rebar Grade 500D', 'Metals & Hardware', 'Structural Storage Facility B', '12', 'Tons', 'Inactive']
            ]}
            badgeColIndex={5}
          />
        </Tabs.Panel>

        {/* ==========================================
            TAB 4: COMMERCIAL SALES LIFECYCLE
           ========================================== */}
        <Tabs.Panel value="sales">
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid>
                {[
                  { title: 'Total Generated Quotation Configurations', val: SALES_COUNTS.totalQ },
                  { title: 'Approved/Accepted Pipeline Accounts', val: SALES_COUNTS.accepted, color: 'green' },
                  { title: 'Liquid Inflows Realized (Received)', val: `₹${SALES_COUNTS.received.toLocaleString('en-IN')}` },
                  { title: 'Outstanding Receivables Exposure', val: `₹${SALES_COUNTS.outstanding.toLocaleString('en-IN')}`, color: 'orange' }
                ].map((card, i) => (
                  <Grid.Col span={{ base: 6 }} key={i}>
                    <Paper withBorder p="sm" radius="md">
                      <Text size="xs" c="dimmed" fw={700}>{card.title.toUpperCase()}</Text>
                      <Text size="md" fw={700} c={card.color}>{card.val}</Text>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" p="md">
                <Group justify="center">
                  <RingProgress
                    size={130}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: 72, color: 'green', tooltip: 'Realized Liquidity' },
                      { value: 28, color: 'orange', tooltip: 'Outstanding Balances' }
                    ]}
                    label={<Text size="xs" ta="center" fw={700} c="dimmed">72% Settled</Text>}
                  />
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          <ReportTableSection 
            title="Quotation Commit Status Tracker"
            onView={() => setViewingReport({ title: "Sales & Estimations Registry Pipeline" })}
            headers={['Quote Reference Identifier', 'Target Enterprise Framework', 'Client Profile Link', 'Gross Quoted Contract Sum', 'Status State']}
            rows={[
              ['QT-2026-001', 'Phoenix Commercial Complex', 'Phoenix Infra Corp', '₹20,00,000', 'Accepted'],
              ['QT-2026-002', 'Nexus Luxury Apartments', 'Nexus Living Spaces', '₹45,00,000', 'Under Revision']
            ]}
            badgeColIndex={4}
          />
        </Tabs.Panel>

        {/* ==========================================
            TAB 5: METRIC PROJECT INDEXES
           ========================================== */}
        <Tabs.Panel value="projects">
          <Grid mb="xl">
            {[
              { title: 'Master Project Profiles', val: PROJECT_COUNTS.totalProj },
              { title: 'Active Infrastructure Foundations', val: PROJECT_COUNTS.active, color: 'blue' },
              { title: 'Delayed / Critical Boundary Exceptions', val: PROJECT_COUNTS.delayed, color: 'red' },
              { title: 'Aggregate Completion Matrix', val: `${PROJECT_COUNTS.overallComp}%`, color: 'teal' }
            ].map((card, i) => (
              <Grid.Col span={{ base: 6, sm: 3 }} key={i}>
                <Paper withBorder p="sm" radius="md">
                  <Text size="xs" c="dimmed" fw={700}>{card.title.toUpperCase()}</Text>
                  <Text size="xl" fw={700} c={card.color}>{card.val}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>

          <ReportTableSection 
            title="Operational Project Structural Timelines Execution"
            onView={() => setViewingReport({ title: "Master Enterprise Execution Progress Profile" })}
            headers={['Infrastructure Target Project', 'Client Scope', 'Scheduled Execution Boundary', 'Completion Ratio %', 'Status Level']}
            rows={[
              ['Phoenix Commercial Complex', 'Phoenix Infra Corp', '2026-12-31 Boundary Limit', '68% Complete Ratio', 'Active'],
              ['Nexus Luxury Apartments', 'Nexus Living Spaces', '2026-10-15 Target Threshold', '100% Final Handover', 'Completed']
            ]}
            badgeColIndex={4}
          />
        </Tabs.Panel>
      </Tabs>

      {/* ==========================================
          INTERACTIVE REPORT VIEWING DRAWER/MODAL
         ========================================== */}
      <Modal
        opened={!!viewingReport}
        onClose={() => { setViewingReport(null); setFullscreenReport(false); }}
        title={viewingReport?.title || "System Report Archive Workspace"}
        size={fullscreenReport ? "100%" : "lg"}
        radius="md"
      >
        <Paper p="md" withBorder radius="md" style={{ fontFamily: 'monospace' }} mb="lg">
          <Group justify="between" mb="md">
            <div>
              <Text fw={700} size="sm">COMPLIANCE LEDGER PROFILE EXTRACT</Text>
              <Text size="xs" c="dimmed">Generated Live: July 2026 | System Secure Token: PMS-REP-SECURE</Text>
            </div>
            <Group gap="xs">
              <Tooltip label="Toggle Full Screen Layout"><ActionIcon variant="light" onClick={() => setFullscreenReport(!fullscreenReport)}><IconMaximize size={16} /></ActionIcon></Tooltip>
              <Button size="xs" color="green" leftSection={<IconCheck size={14} />} onClick={() => setViewingReport(null)}>Done</Button>
            </Group>
          </Group>
          
          <Divider my="md" />
          
          <Table variant="striped" highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Audit Data Column Index Element</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Calculated Balance Metrics</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                { label: 'Primary Active Site Infrastructure Operations Sum', val: '₹65,00,000' },
                { label: 'Realized Escrow Settlement Inflow Tonnage', val: '₹58,00,000' },
                { label: 'Deficient Outstanding Client Arrears Liability', val: '₹7,00,000' }
              ].map((row, idx) => (
                <Table.Tr key={idx}>
                  <Table.Td><Text size="xs">{row.label}</Text></Table.Td>
                  <Table.Td style={{ textAlign: 'right', fontWeight: 'bold' }}><Text size="xs" fw={700} suppressHydrationWarning>${row.val}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Group justify="end" gap="xs">
          <Button variant="default" onClick={() => setViewingReport(null)}>Close Workspace</Button>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <Button variant="light" color="blue" leftSection={<IconDownload size={14} />}>Export Formats</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconTrendingUp size={14} />}>Excel (.xlsx) Format</Menu.Item>
              <Menu.Item leftSection={<IconAlertTriangle size={14} />}>PDF High Resolution</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button color="blue" leftSection={<IconPrinter size={14} />}>Execute Local Print Job</Button>
        </Group>
      </Modal>
    </Container>
  );
}

// ==========================================
// REUSABLE PRESENTATION TABLE CONTAINER
// ==========================================
interface ReportTableSectionProps {
  title: string;
  headers: string[];
  rows: string[][];
  badgeColIndex?: number;
  onView: () => void;
}

function ReportTableSection({ title, headers, rows, badgeColIndex, onView }: ReportTableSectionProps) {
  return (
    <Card withBorder radius="md" p="md" mt="md">
      <Group justify="between" mb="md">
        <Text fw={700} size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconChartPie size={16} color="var(--mantine-color-blue-6)" /> {title}
        </Text>
        <Group gap="xs">
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm" color="gray"><IconColumns size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Column Visibility Mapping</Menu.Label>
              {headers.map((h, idx) => <Menu.Item key={idx}>{h}</Menu.Item>)}
            </Menu.Dropdown>
          </Menu>
          <Button size="xs" variant="default" leftSection={<IconSearch size={12} />} onClick={onView}>Inspect Manifest</Button>
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={600}>
        <Table variant="simple" highlightOnHover verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              {headers.map((h, i) => <Table.Th key={i}>{h}</Table.Th>)}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, rIdx) => (
              <Table.Tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <Table.Td key={cIdx} style={{ whiteSpace: 'nowrap' }}>
                    {badgeColIndex === cIdx ? (
                      <Badge color={cell === 'Active' || cell === 'Accepted' || cell === 'Completed' ? 'green' : 'orange'} variant="light">
                        {cell}
                      </Badge>
                    ) : (
                      <Text size="xs">{cell}</Text>
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Divider my="sm" />
      <Group justify="between">
        <Text size="xs" c="dimmed">Showing 1-2 of rows cataloged</Text>
        <Pagination total={1} size="xs" radius="sm" />
      </Group>
    </Card>
  );
}