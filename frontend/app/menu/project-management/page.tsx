"use client"

import React, { useState, useEffect } from 'react';
import {
  Container,
  Divider,
  Stack,
  Paper,
  Group,
  Title,
  Text,
  Button,
  Tabs,
  Grid,
  TextInput,
  Select,
  MultiSelect,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Tooltip,
  Pagination,
  RingProgress,
  Progress,
  Timeline,
  Modal,
  Textarea,
  NumberInput,
  Skeleton
} from '@mantine/core';
import {
  IconFolder,
  IconReportMoney,
  IconBoxSeam,
  IconTrack,
  IconPlus,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconUserPlus,
  IconArchive,
  IconCalendar,
  IconArrowLeft,
  IconRefresh,
  IconLockSquare,
  IconAlertTriangle,
  IconCircleCheck
} from '@tabler/icons-react';

// ============================================================================
// TYPES & MOCK DATA STRUCTURES
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

const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-2026-001',
    name: 'Phoenix Commercial Complex',
    code: 'PMS-PHX-001',
    customer: 'Phoenix Infra Corp',
    location: 'Zone 4 Elevated Yards, Chennai',
    projectManager: 'Arjun Mehta',
    startDate: '2026-01-15',
    expectedCompletion: '2026-12-20',
    budgetAmount: 20000000,
    budgetUsedPct: 68,
    status: 'In Progress',
    type: 'Commercial Real Estate',
    description: 'Multi-tiered grade-A commercial base execution containing structural optimization cores.'
  },
  {
    id: 'PRJ-2026-002',
    name: 'Nexus Luxury Apartments',
    code: 'PMS-NXS-002',
    customer: 'Nexus Living Spaces',
    location: 'Block C Core Infrastructure, Bangalore',
    projectManager: 'Sarah Dsouza',
    startDate: '2025-08-10',
    expectedCompletion: '2026-10-15',
    budgetAmount: 45000000,
    budgetUsedPct: 91,
    status: 'Delayed',
    type: 'Residential High-Rise',
    description: 'Premium luxury residential tower implementation with sustainable water and power baselines.'
  }
];

const MOCK_SUBCONTRACTORS = [
  { id: '1', name: 'Vanguard Foundations', category: 'Civil & Earthworks', scope: 'Excavation and Piling Substructure', date: '2026-01-20', status: 'Active' },
  { id: '2', name: 'Sterling MEP Systems', category: 'Electrical & Plumbing', scope: 'HVAC Ducting and Main Conduit Runs', date: '2026-03-05', status: 'Active' }
];

const MOCK_STOCK = [
  { id: 's1', name: 'High-Tensile Steel Rebar 500D', category: 'Metals & Hardware', godown: 'Structural Storage Facility B', qty: 45, unit: 'Tons' },
  { id: 's2', name: 'M30 Structural Concrete Mix', category: 'Bulk Materials', godown: 'Main Yards Warehouse A', qty: 1200, unit: 'CuM' }
];

const MOCK_ALLOC_HISTORY = [
  { project: 'Phoenix Commercial Complex', item: 'High-Tensile Steel Rebar 500D', qty: 12, godown: 'Structural Storage Facility B', date: '2026-07-10', status: 'Allocated' },
  { project: 'Nexus Luxury Apartments', item: 'M30 Structural Concrete Mix', qty: 450, godown: 'Main Yards Warehouse A', date: '2026-07-14', status: 'Allocated' }
];

const MOCK_TRANSACTIONS = [
  { date: '2026-07-01', type: 'Purchase Order', ref: 'PO-2026-8812', desc: 'Procurement of structural foundation aggregate mix', amount: 450000, status: 'Settled' },
  { date: '2026-07-08', type: 'Sub-contractor Pay', ref: 'SC-PAY-4410', desc: 'Milestone 2 Slab Clearance Payment', amount: 1200000, status: 'Settled' }
];

const MOCK_ACTIVITIES = [
  { date: '2026-07-18', activity: 'Core Foundation Slab Casting Phase 2', status: 'Completed', actionReq: 'None', owner: 'Arjun Mehta', remarks: 'Passed quality inspections successfully.' },
  { date: '2026-07-15', activity: 'MEP Clearance Review Gate 1', status: 'Delayed', actionReq: 'Approval needed from local zoning authority', owner: 'Sarah Dsouza', remarks: 'Awaiting structural sign-off.' }
];

// ============================================================================
// MASTER ROOT UNIFIED MODULE COMPONENT
// ============================================================================
export default function ProjectManagementModule() {
  // Page Navigation & View Controls
  const [activeTab, setActiveTab] = useState<string | null>('projects');
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Sub-states
  const [subcontractorModal, setSubcontractorModal] = useState<boolean>(false);
  const [allocateStockModal, setAllocateStockModal] = useState<boolean>(false);

  // Unified Simulated Data Loading State Switcher
  const triggerStateRefresh = (targetTab: string | null) => {
    setActiveTab(targetTab);
    setIsLoading(true);
    const delay = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(delay);
  };

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  // System Status Color Badges Helper
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
    <Container fluid p={0} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-xl)', width: '100%' }}>
      
      {/* ====================================================================
          1. SYSTEM HEADER WORKSPACE
         ==================================================================== */}
      {currentView === 'list' && (
        <Paper p="lg" radius="md" withBorder>
          <Group justify="between" align="center">
            <div>
              <Title order={2} style={{ letterSpacing: '-0.5px' }}>Project Management Operational Center</Title>
              <Text size="sm" c="dimmed">Track physical lifecycles, budget parameters, inventory drawdowns, and performance streams.</Text>
            </div>
            <Group gap="sm">
              <Select
                size="sm"
                label="Active Workspace Filter"
                value={selectedProjectId}
                onChange={(val) => setSelectedProjectId(val || MOCK_PROJECTS[0].id)}
                data={MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }))}
                style={{ width: 260 }}
              />
              <Button 
                size="sm" 
                variant="light" 
                color="gray" 
                leftSection={<IconRefresh size={16} />}
                onClick={() => triggerStateRefresh(activeTab)}
              >
                Sync Data
              </Button>
            </Group>
          </Group>
        </Paper>
      )}

      {/* ====================================================================
          2. APPLICATION WORKSPACE FLOWS (LIST VS FORMS)
         ==================================================================== */}
      {currentView !== 'list' ? (
        // FORM ARCHITECTURE FLOW (FULL-PAGE EQUIVALENT EDIT VIEW)
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="between">
              <Group gap="xs">
                <ActionIcon variant="subtle" color="gray" onClick={() => setCurrentView('list')}>
                  <IconArrowLeft size={20} />
                </ActionIcon>
                <Title order={3}>{currentView === 'create' ? 'Initiate New Capital Venture' : `Modify Scope: ${selectedProject.name}`}</Title>
              </Group>
              <Badge variant="filled" color="blue" radius="xs">Secure Form Ledger</Badge>
            </Group>

            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 6 }}><TextInput label="Project Name" placeholder="Enter corporate moniker" required defaultValue={currentView === 'edit' ? selectedProject.name : ''} /></Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}><TextInput label="Project Code Allocation" disabled description="Auto-generated ledger standard" value={currentView === 'edit' ? selectedProject.code : 'PMS-GEN-2026-X'} /></Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}><Select label="Target Customer Entity" placeholder="Select customer group" required data={['Phoenix Infra Corp', 'Nexus Living Spaces', 'Vertex Hubs']} defaultValue={currentView === 'edit' ? selectedProject.customer : undefined} /></Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}><Select label="Operational Venture Sector" data={['Commercial Real Estate', 'Residential High-Rise', 'Industrial Outpost']} defaultValue={currentView === 'edit' ? selectedProject.type : undefined} /></Grid.Col>
              <Grid.Col span={{ base: 12 }}><TextInput label="Geographic Deployment Location" placeholder="Coordinates or clear postal plot identifiers" required defaultValue={currentView === 'edit' ? selectedProject.location : ''} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}><TextInput type="date" label="Venture Start Date" defaultValue={currentView === 'edit' ? selectedProject.startDate : ''} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}><TextInput type="date" label="Projected Target Close Date" defaultValue={currentView === 'edit' ? selectedProject.expectedCompletion : ''} /></Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}><Select label="Designated Site Project Manager" data={['Arjun Mehta', 'Sarah Dsouza', 'Kabir Singh']} defaultValue={currentView === 'edit' ? selectedProject.projectManager : undefined} /></Grid.Col>
              <Grid.Col span={{ base: 12 }}><Textarea label="Venture Execution Parameters / Scope Summaries" minRows={3} defaultValue={currentView === 'edit' ? selectedProject.description : ''} /></Grid.Col>
            </Grid>

            <Paper p="md" withBorder radius="md" mt="md">
              <Group justify="between" mb="md">
                <div>
                  <Text fw={700} size="sm">Subcontractor Allocation Vectors</Text>
                  <Text size="xs" c="dimmed">Assign and check active contractual work categories allocated to this localized execution framework.</Text>
                </div>
                <Button size="xs" variant="outline" leftSection={<IconUserPlus size={14} />} onClick={() => setSubcontractorModal(true)}>Add Sub-contractor</Button>
              </Group>

              <Table.ScrollContainer minWidth={600}>
                <Table variant="simple" verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Sub-contractor Corporate Identity</Table.Th>
                      <Table.Th>Work Category</Table.Th>
                      <Table.Th>Operational Scope</Table.Th>
                      <Table.Th>Assigned Benchmark Date</Table.Th>
                      <Table.Th>Operational Status</Table.Th>
                      <Table.Th style={{ width: 80 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {MOCK_SUBCONTRACTORS.map((sc) => (
                      <Table.Tr key={sc.id}>
                        <Table.Td><Text size="xs" fw={700}>{sc.name}</Text></Table.Td>
                        <Table.Td><Text size="xs">{sc.category}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="dimmed">{sc.scope}</Text></Table.Td>
                        <Table.Td><Text size="xs">{sc.date}</Text></Table.Td>
                        <Table.Td>{renderStatusBadge(sc.status)}</Table.Td>
                        <Table.Td>
                          <ActionIcon variant="subtle" color="red" size="sm"><IconArchive size={14} /></ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>

            <Group justify="end" mt="xl">
              <Button variant="default" onClick={() => setCurrentView('list')}>Abort Operations</Button>
              <Button color="blue" onClick={() => setCurrentView('list')}>Commit Configuration Records</Button>
            </Group>
          </Stack>
        </Paper>
      ) : (
        // CORE TAB CONTAINER LAYOUT
        <Tabs value={activeTab} onChange={triggerStateRefresh} variant="pills" radius="md">
          <Tabs.List style={{ borderRadius: '8px 8px 0 0' }}>
            <Tabs.Tab value="projects" leftSection={<IconFolder size={16} />}>Corporate Venture Directory</Tabs.Tab>
            <Tabs.Tab value="budget" leftSection={<IconReportMoney size={16} />}>Budget Ledger Optimization</Tabs.Tab>
            <Tabs.Tab value="stock" leftSection={<IconBoxSeam size={16} />}>Logistics Stock Allocations</Tabs.Tab>
            <Tabs.Tab value="tracking" leftSection={<IconTrack size={16} />}>Venture Lifecycle Track</Tabs.Tab>
          </Tabs.List>

          <div style={{ marginTop: 'var(--mantine-spacing-md)' }}>
            
            {/* ====================================================================
                TAB 1 PANEL: VENTURE DIRECTORY LISTING
               ==================================================================== */}
            <Tabs.Panel value="projects">
              <Stack gap="md">
                {/* Global Filters Sub-Segment */}
                <Paper p="md" radius="md" withBorder>
                  <Grid gap="sm" align="end">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput placeholder="Search project clusters, operational targets or clients..." leftSection={<IconSearch size={16} />} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                      <MultiSelect placeholder="Filter Pipeline Status" data={['Not Started', 'In Progress', 'Completed', 'Delayed']} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                      <Select placeholder="Filter Client Anchor" data={['Phoenix Infra Corp', 'Nexus Living Spaces']} clearable />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 2 }}>
                      <Button fullWidth variant="filled" color="blue" leftSection={<IconFilter size={16} />}>Apply Parameters</Button>
                    </Grid.Col>
                  </Grid>
                </Paper>

                {/* Main Data Render Frame */}
                <Paper p="md" radius="md" withBorder>
                  <Group justify="between" mb="md">
                    <div>
                      <Text fw={700} size="sm">Active Enterprise Registry Matrix</Text>
                      <Text size="xs" c="dimmed">Catalog showing verified strategic master metrics across ongoing engineering frameworks.</Text>
                    </div>
                    <Button size="xs" color="blue" leftSection={<IconPlus size={14} />} onClick={() => setCurrentView('create')}>Initiate Master Project</Button>
                  </Group>

                  {isLoading ? (
                    <Stack gap="xs">
                      <Skeleton height={40} radius="xs" />
                      <Stack gap="sm">{Array.from({ length: 3 }).map((_, index) => (<Skeleton key={index} height={30} radius="xs" />))}</Stack>
                    </Stack>
                  ) : (
                    <Table.ScrollContainer minWidth={900}>
                      <Table variant="simple" highlightOnHover verticalSpacing="md">
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Venture Designation</Table.Th>
                            <Table.Th>Client Target</Table.Th>
                            <Table.Th>Deployment Site Location</Table.Th>
                            <Table.Th>Project Manager</Table.Th>
                            <Table.Th>Timeline Metrics</Table.Th>
                            <Table.Th style={{ textAlign: 'right' }}>Approved Capital Pool</Table.Th>
                            <Table.Th>Budget Efficiency</Table.Th>
                            <Table.Th>Status State</Table.Th>
                            <Table.Th style={{ width: 60 }}></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {MOCK_PROJECTS.map((proj) => (
                            <Table.Tr key={proj.id}>
                              <Table.Td>
                                <Stack gap={2}>
                                  <Text size="xs" fw={700} c="blue">{proj.name}</Text>
                                  <Text size="9px" c="dimmed" style={{ fontFamily: 'monospace' }}>{proj.code}</Text>
                                </Stack>
                              </Table.Td>
                              <Table.Td><Text size="xs">{proj.customer}</Text></Table.Td>
                              <Table.Td><Text size="xs" c="dimmed" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.location}</Text></Table.Td>
                              <Table.Td><Text size="xs">{proj.projectManager}</Text></Table.Td>
                              <Table.Td>
                                <Stack gap={2}>
                                  <Text size="10px" fw={600}>Start: {proj.startDate}</Text>
                                  <Text size="10px" c="orange">Target: {proj.expectedCompletion}</Text>
                                </Stack>
                              </Table.Td>
                              <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={700} suppressHydrationWarning>₹{(proj.budgetAmount).toLocaleString('en-IN')}</Text></Table.Td>
                              <Table.Td style={{ minWidth: 120 }}>
                                <Group gap={4} mb={2} justify="between">
                                  <Text size="10px" c="dimmed">Utilization Ratio</Text>
                                  <Text size="10px" fw={700}>{proj.budgetUsedPct}%</Text>
                                </Group>
                                <Progress color={proj.budgetUsedPct > 90 ? 'red' : 'blue'} value={proj.budgetUsedPct} size="xs" radius="xl" />
                              </Table.Td>
                              <Table.Td>{renderStatusBadge(proj.status)}</Table.Td>
                              <Table.Td>
                                <Menu shadow="md" position="bottom-end">
                                  <Menu.Target>
                                    <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16} /></ActionIcon>
                                  </Menu.Target>
                                  <Menu.Dropdown>
                                    <Menu.Item leftSection={<IconEye size={14} />} onClick={() => { setSelectedProjectId(proj.id); triggerStateRefresh('tracking'); }}>View Venture Workspace</Menu.Item>
                                    <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => { setSelectedProjectId(proj.id); setCurrentView('edit'); }}>Modify Operational Scope</Menu.Item>
                                    <Menu.Item leftSection={<IconArchive size={14} />} color="red">Archive Venture Trace</Menu.Item>
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
                  <Group justify="between">
                    <Text size="xs" c="dimmed">Showing 1-2 of 2 localized venture targets cataloged</Text>
                    <Pagination total={1} size="sm" radius="sm" />
                  </Group>
                </Paper>
              </Stack>
            </Tabs.Panel>

            {/* ====================================================================
                TAB 2 PANEL: BUDGET LEDGER OPTIMIZATION
               ==================================================================== */}
            <Tabs.Panel value="budget">
              <Stack gap="md">
                <Paper p="md" radius="md" withBorder bg="var(--mantine-color-blue-0)">
                  <Group justify="between">
                    <div>
                      <Text fw={700} size="sm" c="blue-dark">Active Capital Stream Focus Target</Text>
                      <Text size="xs" c="dimmed">Displaying system-validated quotation values and downstream ledger transactions for: <b>{selectedProject.name}</b></Text>
                    </div>
                  </Group>
                </Paper>

                {isLoading ? (
                  <Grid>
                    <Grid.Col span={4}><Skeleton height={80} /></Grid.Col>
                    <Grid.Col span={4}><Skeleton height={80} /></Grid.Col>
                    <Grid.Col span={4}><Skeleton height={80} /></Grid.Col>
                  </Grid>
                ) : (
                  <>
                    {/* Metrics Dashboard Layout */}
                    <Grid gap="md" align="stretch">
                      <Grid.Col span={{ base: 12, md: 8 }}>
                        <Grid gap="sm">
                          {[
                            { title: 'Approved Capital Pipeline Allocation', val: `₹${(selectedProject.budgetAmount).toLocaleString('en-IN')}`, desc: 'Aggregated base values pulled from Sales Module clearance.' },
                            { title: 'Realized Outflow Burn Volume (Used)', val: `₹${((selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-IN')}`, color: 'orange', desc: 'Committed ledger settlements and stock consumption.' },
                            { title: 'Liquid Unallocated Variance (Remaining)', val: `₹${(selectedProject.budgetAmount - (selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-IN')}`, color: 'green', desc: 'Free operational capital reserves available for site optimization.' }
                          ].map((metric, idx) => (
                            <Grid.Col span={{ base: 12, sm: 4 }} key={idx}>
                              <Paper withBorder p="md" radius="md" style={{ height: '100%' }}>
                                <Text size="10px" fw={700} c="dimmed" style={{ letterSpacing: '0.5px' }}>{metric.title.toUpperCase()}</Text>
                                <Text size="lg" fw={700} c={metric.color} my={4} suppressHydrationWarning>{metric.val}</Text>
                                <Text size="9px" c="dimmed">{metric.desc}</Text>
                              </Paper>
                            </Grid.Col>
                          ))}
                        </Grid>
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <Paper withBorder p="md" radius="md" style={{ display: 'flex', alignItems: 'center', justifyItem: 'center', height: '100%' }}>
                          <Group justify="center" style={{ width: '100%' }}>
                            <RingProgress
                              size={110}
                              thickness={12}
                              roundCaps
                              sections={[{ value: selectedProject.budgetUsedPct, color: selectedProject.budgetUsedPct > 80 ? 'red' : 'blue' }]}
                              label={<Text size="xs" ta="center" fw={700}>{selectedProject.budgetUsedPct}% Burned</Text>}
                            />
                            <div>
                              <Text size="xs" fw={700}>System Capital Run-Rate</Text>
                              <Text size="9px" c="dimmed">Visualizing relative expenditure thresholds against master limits.</Text>
                            </div>
                          </Group>
                        </Paper>
                      </Grid.Col>
                    </Grid>

                    {/* Breakdown Ledger Sub-Panels */}
                    <Paper p="md" radius="md" withBorder>
                      <Text fw={700} size="sm" mb="md">Categorized Operational Cost Center Variance Matrices</Text>
                      <Grid gap="md">
                        {[
                          { title: 'Material Cost Allocation Pool', alloc: '₹80,00,000', consumption: '₹55,00,000', metric: 68 },
                          { title: 'Subcontractor Main Work Contract Volume', alloc: '₹1,00,00,000', consumption: '₹75,00,000', metric: 75 },
                          { title: 'Other Overheads & Site Contingencies', alloc: '₹20,00,000', consumption: '₹6,00,000', metric: 30 }
                        ].map((row, i) => (
                          <Grid.Col span={{ base: 12, md: 4 }} key={i}>
                            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
                              <Text size="xs" fw={700}>{row.title}</Text>
                              <Divider my="xs" />
                              <Group justify="between" mb={4}><Text size="10px" c="dimmed">Approved Bounds:</Text><Text size="10px" fw={600} suppressHydrationWarning>{row.alloc}</Text></Group>
                              <Group justify="between" mb={6}><Text size="10px" c="dimmed">Realized Consumed:</Text><Text size="10px" fw={600} c="orange" suppressHydrationWarning>{row.consumption}</Text></Group>
                              <Progress size="xs" color="orange" value={row.metric} radius="xl" />
                            </Paper>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Paper>

                    {/* Transaction Audit Records */}
                    <Paper p="md" radius="md" withBorder>
                      <Text fw={700} size="sm" mb="sm">Audit Ledger Trail (Latest Project Inflows & Outflows)</Text>
                      <Table.ScrollContainer minWidth={600}>
                        <Table variant="striped" verticalSpacing="xs">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Transaction Timestamp</Table.Th>
                              <Table.Th>Vector System Type</Table.Th>
                              <Table.Th>Secure Reference Link</Table.Th>
                              <Table.Th>Audit Trace Line Context</Table.Th>
                              <Table.Th style={{ textAlign: 'right' }}>Settled Volume</Table.Th>
                              <Table.Th>System State</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {MOCK_TRANSACTIONS.map((t, idx) => (
                              <Table.Tr key={idx}>
                                <Table.Td><Text size="xs">{t.date}</Text></Table.Td>
                                <Table.Td><Badge size="xs" color="gray">{t.type}</Badge></Table.Td>
                                <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{t.ref}</Text></Table.Td>
                                <Table.Td><Text size="xs" c="dimmed">{t.desc}</Text></Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={700} c="red" suppressHydrationWarning>- ₹{t.amount.toLocaleString('en-IN')}</Text></Table.Td>
                                <Table.Td>{renderStatusBadge(t.status)}</Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Table.ScrollContainer>
                    </Paper>
                  </>
                )}
              </Stack>
            </Tabs.Panel>

            {/* ====================================================================
                TAB 3 PANEL: LOGISTICS STOCK ALLOCATIONS
               ==================================================================== */}
            <Tabs.Panel value="stock">
              <Stack gap="md">
                <Paper p="md" radius="md" withBorder>
                  <Group justify="between" mb="md">
                    <div>
                      <Text fw={700} size="sm">Available Logistics Reserves Matrix</Text>
                      <Text size="xs" c="dimmed">Query inventory balances maintained inside secure enterprise godown segments before executing site supply line movements.</Text>
                    </div>
                    <Button size="xs" color="blue" leftSection={<IconPlus size={14} />} onClick={() => setAllocateStockModal(true)}>Execute New Site Allocation</Button>
                  </Group>

                  {/* Available Stock Filters Sub-Segment */}
                  <Grid gap="xs" mb="md">
                    <Grid.Col span={{ base: 12, sm: 4 }}><TextInput size="xs" placeholder="Search item specs..." leftSection={<IconSearch size={12} />} /></Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 4 }}><Select size="xs" placeholder="Filter Category" data={['Metals & Hardware', 'Bulk Materials']} clearable /></Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 4 }}><Select size="xs" placeholder="Filter Godown Yard" data={['Structural Storage Facility B', 'Main Yards Warehouse A']} clearable /></Grid.Col>
                  </Grid>

                  <Table.ScrollContainer minWidth={600}>
                    <Table variant="simple" verticalSpacing="sm">
                      <Table.Thead style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                        <Table.Tr>
                          <Table.Th>Inventory Item Class Reference</Table.Th>
                          <Table.Th>Material Category</Table.Th>
                          <Table.Th>Source Storage Godown</Table.Th>
                          <Table.Th style={{ textAlign: 'right' }}>Liquid Balance Available</Table.Th>
                          <Table.Th>Unit Metric</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {MOCK_STOCK.map((item) => (
                          <Table.Tr key={item.id}>
                            <Table.Td><Text size="xs" fw={700}>{item.name}</Text></Table.Td>
                            <Table.Td><Text size="xs">{item.category}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{item.godown}</Text></Table.Td>
                            <Table.Td style={{ textAlign: 'right', color: 'var(--mantine-color-blue-7)' }}><Text size="xs" fw={700}>{item.qty}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{item.unit}</Text></Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Paper>

                {/* Allocated Stock History Logs */}
                <Paper p="md" radius="md" withBorder>
                  <Text fw={700} size="sm" mb="sm">Historical Site Transfer Logs Archive</Text>
                  <Table.ScrollContainer minWidth={600}>
                    <Table variant="striped" verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Target Project Frame</Table.Th>
                          <Table.Th>Material Dispatched</Table.Th>
                          <Table.Th style={{ textAlign: 'right' }}>Volume Dispatched</Table.Th>
                          <Table.Th>Source Godown Origins</Table.Th>
                          <Table.Th>Allocation Timestamp</Table.Th>
                          <Table.Th>Ledger Status State</Table.Th>
                          <Table.Th style={{ width: 80 }}></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {MOCK_ALLOC_HISTORY.map((h, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td><Text size="xs" fw={600}>{h.project}</Text></Table.Td>
                            <Table.Td><Text size="xs">{h.item}</Text></Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={700}>{h.qty}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{h.godown}</Text></Table.Td>
                            <Table.Td><Text size="xs">{h.date}</Text></Table.Td>
                            <Table.Td>{renderStatusBadge(h.status)}</Table.Td>
                            <Table.Td>
                              <Button size="9px" variant="light" color="orange">Return Stock</Button>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Paper>
              </Stack>
            </Tabs.Panel>

            {/* ====================================================================
                TAB 4 PANEL: VENTURE LIFECYCLE TRACKING
               ==================================================================== */}
            <Tabs.Panel value="tracking">
              <Stack gap="md">
                <Grid gap="md" align="stretch">
                  {/* Detailed Venture Summary Parameters Card */}
                  <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                      <Text size="xs" fw={700} c="dimmed" mb="xs">COMPREHENSIVE RUNTIME SUMMARY: {selectedProject.name.toUpperCase()}</Text>
                      <Grid gap="xs" mt="sm">
                        <Grid.Col span={6}><Text size="11px" c="dimmed">Associated Client Anchor:</Text><Text size="xs" fw={600}>{selectedProject.customer}</Text></Grid.Col>
                        <Grid.Col span={6}><Text size="11px" c="dimmed">Operational Status Classification:</Text><div>{renderStatusBadge(selectedProject.status)}</div></Grid.Col>
                        <Grid.Col span={6}><Text size="11px" c="dimmed">Venture Baseline Operations Window:</Text><Text size="xs" fw={600}>{selectedProject.startDate} to {selectedProject.expectedCompletion}</Text></Grid.Col>
                        <Grid.Col span={6}><Text size="11px" c="dimmed">Venture Capital Base Structure:</Text><Text size="xs" fw={600} suppressHydrationWarning>₹{selectedProject.budgetAmount.toLocaleString('en-IN')}</Text></Grid.Col>
                      </Grid>

                      <Divider my="md" />

                      <Text size="xs" fw={700} mb={6} c="dimmed">AGGREGATED RUNTIME RATIOS</Text>
                      <Grid gap="sm">
                        <Grid.Col span={6}>
                          <Group justify="between" mb={2}><Text size="10px">Physical Completion Value</Text><Text size="10px" fw={700}>74%</Text></Group>
                          <Progress color="teal" value={74} size="sm" radius="xl" />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Group justify="between" mb={2}><Text size="10px">Financial Burn Thresholds</Text><Text size="10px" fw={700}>{selectedProject.budgetUsedPct}%</Text></Group>
                          <Progress color="orange" value={selectedProject.budgetUsedPct} size="sm" radius="xl" />
                        </Grid.Col>
                      </Grid>
                    </Paper>
                  </Grid.Col>

                  {/* Interactive Status Gate Execution Manager */}
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                      <Text size="xs" fw={700} c="dimmed" mb="sm">CRITICAL CRITERIA AND ACTION REGISTRY</Text>
                      <Stack gap="xs">
                        <Select size="xs" label="Active Phase Node Location" data={['Planning', 'Material Preparation', 'Execution', 'Completion']} defaultValue="Execution" />
                        <TextInput size="xs" label="System Action Items Pending" defaultValue="Acquire MEP Clearance Sign-off from Municipal Architect" />
                        <Grid gap="xs">
                          <Grid.Col span={6}><TextInput size="xs" type="date" label="Next Board Review Gate" defaultValue="2026-08-05" /></Grid.Col>
                          <Grid.Col span={6}><Select size="xs" label="Critical Severity Index" data={['High', 'Medium', 'Low']} defaultValue="Medium" /></Grid.Col>
                        </Grid>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                </Grid>

                {/* Milestone Node Path Graphic Timeline */}
                <Paper p="xl" radius="md" withBorder>
                  <Text fw={700} size="sm" mb="xl">Venture Lifecycle Stage Gates Progress Path</Text>
                  <Timeline active={2} bulletSize={24} lineWidth={2} radius="xl">
                    <Timeline.Item bullet={<IconCircleCheck size={14} />} title="Phase 1: Conceptual Architecture & Planning">
                      <Text size="xs" c="dimmed">Approved architectural site profiles generated. Baseline structural models passed into secondary system nodes.</Text>
                      <Text size="10px" mt={4} fw={600}>Cleared: Feb 2026</Text>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconCircleCheck size={14} />} title="Phase 2: Logistics & Material Preparation">
                      <Text size="xs" c="dimmed">Initial bulk allocations routed. Secondary supplier matrices synced with master godown structures.</Text>
                      <Text size="10px" mt={4} fw={600}>Cleared: April 2026</Text>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconFilter size={14} />} title="Phase 3: Active Ground Execution Matrix">
                      <Text size="xs" c="dimmed">Ongoing site civil pouring, structural beam installation, mechanical ducting routing, and core testing.</Text>
                      <Badge color="blue" size="xs" variant="light" mt={4}>Active Node Process</Badge>
                    </Timeline.Item>

                    <Timeline.Item bullet={<IconLockSquare size={14} />} title="Phase 4: Final Inspection & Closeout Handover">
                      <Text size="xs" c="dimmed">Asset commissioning, client sign-off verification, and financial clearance steps.</Text>
                    </Timeline.Item>
                  </Timeline>
                </Paper>

                {/* Granular Activity Action History Logs */}
                <Paper p="md" radius="md" withBorder>
                  <Text fw={700} size="sm" mb="sm">Site Operations Activity Logs (Latest Trace Entries)</Text>
                  <Table.ScrollContainer minWidth={600}>
                    <Table variant="striped" verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Timestamp</Table.Th>
                          <Table.Th>Logged Engineering Event</Table.Th>
                          <Table.Th>Execution State</Table.Th>
                          <Table.Th>Critical Mitigation Action Needed</Table.Th>
                          <Table.Th>Responsible Owner</Table.Th>
                          <Table.Th>System Remarks</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {MOCK_ACTIVITIES.map((act, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td><Text size="xs">{act.date}</Text></Table.Td>
                            <Table.Td><Text size="xs" fw={600}>{act.activity}</Text></Table.Td>
                            <Table.Td>
                              <Badge size="xs" variant="dot" color={act.status === 'Completed' ? 'green' : 'red'}>{act.status}</Badge>
                            </Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                {act.actionReq !== 'None' && <IconAlertTriangle size={12} color="var(--mantine-color-red-6)" />}
                                <Text size="xs" c={act.actionReq !== 'None' ? 'red' : 'dimmed'}>{act.actionReq}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td><Text size="xs">{act.owner}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{act.remarks}</Text></Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Paper>
              </Stack>
            </Tabs.Panel>

          </div>
        </Tabs>
      )}

      {/* ====================================================================
          3. AUXILIARY MODAL SUB-COMPONENTS (SUB-CONTRACTOR ASSIGNMENTS)
         ==================================================================== */}
      <Modal
        opened={subcontractorModal}
        onClose={() => setSubcontractorModal(false)}
        title="Route Subcontractor Operations Assignment Block"
        centered
        radius="md"
      >
        <Stack gap="sm">
          <Select label="Select Subcontractor Corporate Group" placeholder="Select verified entity" data={['Vanguard Foundations', 'Sterling MEP Systems', 'Apex Glassworks']} required />
          <Select label="Work Category Allocation" data={['Civil & Earthworks', 'Electrical & Plumbing', 'Façade Structures']} required />
          <TextInput label="Contractual Scope Parameters" placeholder="Specify targeted bounds clearly" required />
          <TextInput type="date" label="Contract Target Commencement Date" />
          <Group justify="end" mt="md">
            <Button variant="default" size="xs" onClick={() => setSubcontractorModal(false)}>Cancel</Button>
            <Button size="xs" color="blue" onClick={() => setSubcontractorModal(false)}>Commit Assignment</Button>
          </Group>
        </Stack>
      </Modal>

      {/* ====================================================================
          4. AUXILIARY MODAL SUB-COMPONENTS (LOGISTICS SUPPLY MOVEMENT)
         ==================================================================== */}
      <Modal
        opened={allocateStockModal}
        onClose={() => setAllocateStockModal(false)}
        title="Execute Inbound Site Supply Allocation Authorization"
        centered
        radius="md"
        size="lg"
      >
        <Stack gap="md">
          <Paper p="sm" bg="var(--mantine-color-amber-0)" radius="md">
            <Group gap="xs" align="start">
              <IconAlertTriangle size={16} color="var(--mantine-color-amber-7)" style={{ marginTop: 2 }} />
              <Text size="xs" c="amber-dark">Allocation parameters are evaluated immediately against real-time godown metric levels. You cannot override existing physical safety caps.</Text>
            </Group>
          </Paper>

          <Grid gap="sm">
            <Grid.Col span={12}><Select size="sm" label="Target Project Frame Domain" value={selectedProjectId} data={MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }))} disabled /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><Select size="sm" label="Source Dispatch Storage Godown" placeholder="Select pickup node" data={['Structural Storage Facility B', 'Main Yards Warehouse A']} required /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><Select size="sm" label="Material Asset Selection" placeholder="Choose item" data={['High-Tensile Steel Rebar 500D', 'M30 Structural Concrete Mix']} required /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><NumberInput size="sm" label="Available Quantities Checked" value={45} disabled description="Live database yard pull" /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><NumberInput size="sm" label="Target Allocation Desired Volume" required min={1} max={45} placeholder="Must stay beneath yard levels" /></Grid.Col>
            <Grid.Col span={12}><TextInput size="sm" placeholder="Enter vehicle log codes or logistics driver references" label="Venture Logistics Notes" /></Grid.Col>
          </Grid>

          <Group justify="end" mt="md">
            <Button variant="default" size="sm" onClick={() => setAllocateStockModal(false)}>Abort Dispatches</Button>
            <Button size="sm" color="blue" leftSection={<IconCalendar size={16} />} onClick={() => setAllocateStockModal(false)}>Authorize Dispatch Chain</Button>
          </Group>
        </Stack>
      </Modal>

    </Container>
  );
}