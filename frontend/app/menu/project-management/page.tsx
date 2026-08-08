"use client"
import React, { useState } from 'react';
import {
  Container,
  Stack,
  Paper,
  Group,
  Title,
  Text,
  Button,
  Tabs,
  Grid,
  SimpleGrid,
  TextInput,
  Select,
  MultiSelect,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Pagination,
  RingProgress,
  Progress,
  Timeline,
  Modal,
  Drawer,
  Textarea,
  NumberInput,
  Skeleton,
  Divider
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
  IconRefresh,
  IconLockSquare,
  IconAlertTriangle,
  IconCircleCheck
} from '@tabler/icons-react';

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
// MAIN COMPONENT MATCHING YOUR EXACT LAYOUT & SPACING
// ============================================================================
export default function ProjectManagementModule() {
  const [activeTab, setActiveTab] = useState<string | null>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [projectDrawerOpened, setProjectDrawerOpened] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [subcontractorModal, setSubcontractorModal] = useState<boolean>(false);
  const [allocateStockModal, setAllocateStockModal] = useState<boolean>(false);

  const triggerStateRefresh = (targetTab: string | null) => {
    setActiveTab(targetTab);
    setIsLoading(true);
    const delay = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(delay);
  };

  const handleOpenCreateDrawer = () => {
    setDrawerMode('create');
    setProjectDrawerOpened(true);
  };

  const handleOpenEditDrawer = (projId: string) => {
    setSelectedProjectId(projId);
    setDrawerMode('edit');
    setProjectDrawerOpened(true);
  };

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

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
      
      {/* ====================================================================
          1. HEADER WRAPPER PAPER (Matching your exact header structure)
         ==================================================================== */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2} className="enterprise-title">Project Lifecycle Engine</Title>
            <Text size="sm" c="dimmed">Track physical lifecycles, budget parameters, inventory drawdowns, and progress.</Text>
          </Stack>
          <Select
            label="Active Enterprise Project"
            placeholder="Switch Scope"
            value={selectedProjectId}
            onChange={(val) => val && setSelectedProjectId(val)}
            data={MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }))}
          />
        </Group>
      </Paper>

      {/* ====================================================================
          2. MODULE TABS (Variant: pills, radius: md, mb: lg)
         ==================================================================== */}
      <Tabs value={activeTab} onChange={triggerStateRefresh} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="projects" leftSection={<IconFolder size={16} />}>Projects</Tabs.Tab>
          <Tabs.Tab value="budget" leftSection={<IconReportMoney size={16} />}>Budget Tracking</Tabs.Tab>
          <Tabs.Tab value="stock" leftSection={<IconBoxSeam size={16} />}>Stock Allocation</Tabs.Tab>
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
                color="indigo"
                leftSection={<IconPlus size={16} />} 
                onClick={handleOpenCreateDrawer}
              >
                Create Project
              </Button>
            </Group>
          </Paper>

          <Stack gap="md">
            {/* Filters */}
            <Paper p="sm" radius="md" withBorder>
              <Grid gap="sm" align="end">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput placeholder="Search project name, customer, location..." leftSection={<IconSearch size={16} />} size="xs" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <MultiSelect placeholder="Project Status" data={['Not Started', 'In Progress', 'Completed', 'Delayed']} size="xs" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select placeholder="Customer" data={['Phoenix Infra Corp', 'Nexus Living Spaces']} clearable size="xs" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 2 }}>
                  <Button fullWidth variant="filled" color="blue" leftSection={<IconFilter size={14} />} size="xs">Filter</Button>
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
                        <Table.Th>Location</Table.Th>
                        <Table.Th>Project Manager</Table.Th>
                        <Table.Th>Dates</Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>Budget Amount</Table.Th>
                        <Table.Th>Budget Used</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th style={{ width: 50 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {MOCK_PROJECTS.map((proj) => (
                        <Table.Tr key={proj.id}>
                          <Table.Td>
                            <Stack gap={2}>
                              <Text size="xs" fw={600} c="blue">{proj.name}</Text>
                              <Text size="10px" c="dimmed">{proj.code}</Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td><Text size="xs">{proj.customer}</Text></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{proj.location}</Text></Table.Td>
                          <Table.Td><Text size="xs">{proj.projectManager}</Text></Table.Td>
                          <Table.Td>
                            <Stack gap={2}>
                              <Text size="10px">Start: {proj.startDate}</Text>
                              <Text size="10px" c="orange">Exp: {proj.expectedCompletion}</Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600} suppressHydrationWarning>₹{(proj.budgetAmount).toLocaleString('en-IN')}</Text></Table.Td>
                          <Table.Td style={{ minWidth: 100 }}>
                            <Group gap={4} mb={2} justify="space-between">
                              <Text size="10px" fw={600}>{proj.budgetUsedPct}%</Text>
                            </Group>
                            <Progress color={proj.budgetUsedPct > 90 ? 'red' : 'blue'} value={proj.budgetUsedPct} size="xs" radius="xl" />
                          </Table.Td>
                          <Table.Td>{renderStatusBadge(proj.status)}</Table.Td>
                          <Table.Td>
                            <Menu shadow="md" position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle" color="gray" size="sm"><IconDotsVertical size={14} /></ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconEye size={14} />} onClick={() => { setSelectedProjectId(proj.id); triggerStateRefresh('tracking'); }}>View Project</Menu.Item>
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEditDrawer(proj.id)}>Edit Project</Menu.Item>
                                <Menu.Item leftSection={<IconArchive size={14} />} color="red">Archive Project</Menu.Item>
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
                <Text size="xs" c="dimmed">Showing 2 projects</Text>
                <Pagination total={1} size="xs" radius="sm" />
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* ==========================================
            TAB 2: BUDGET TRACKING
           ========================================== */}
        <Tabs.Panel value="budget">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Budget Tracking Engine</Title>
                <Text size="sm" c="dimmed">Monitor financial consumption, remaining balance, and historical PO drawdowns.</Text>
              </Stack>
              <Button 
                size="sm"
                variant="default"
                leftSection={<IconRefresh size={16} />} 
                onClick={() => triggerStateRefresh('budget')}
              >
                Sync Financials
              </Button>
            </Group>
          </Paper>

          <Stack gap="md">
            {isLoading ? (
              <Stack gap="xs">
                <Skeleton height={80} />
                <Skeleton height={120} />
              </Stack>
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">TOTAL APPROVED BUDGET</Text>
                    <Text size="lg" fw={700} my={4} suppressHydrationWarning>₹{(selectedProject.budgetAmount).toLocaleString('en-IN')}</Text>
                    <Text size="10px" c="dimmed">Approved from Sales module quotation</Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">AMOUNT USED</Text>
                    <Text size="lg" fw={700} c="orange" my={4} suppressHydrationWarning>₹{((selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-IN')}</Text>
                    <Text size="10px" c="dimmed">Total consumption to date</Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">REMAINING BUDGET</Text>
                    <Text size="lg" fw={700} c="green" my={4} suppressHydrationWarning>₹{(selectedProject.budgetAmount - (selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-IN')}</Text>
                    <Group gap={4} mt={2}>
                      <RingProgress size={20} thickness={3} sections={[{ value: selectedProject.budgetUsedPct, color: 'blue' }]} />
                      <Text size="10px" fw={600}>{100 - selectedProject.budgetUsedPct}% Available</Text>
                    </Group>
                  </Paper>
                </SimpleGrid>

                <Paper p="md" radius="md" withBorder>
                  <Text fw={600} size="sm" mb="md">Budget Breakdown</Text>
                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    {[
                      { title: 'Material Cost', alloc: '₹80,00,000', consumed: '₹55,00,000', pct: 68 },
                      { title: 'Sub-contractor Cost', alloc: '₹1,00,00,000', consumed: '₹75,00,000', pct: 75 },
                      { title: 'Other Expenses', alloc: '₹20,00,000', consumed: '₹6,00,000', pct: 30 }
                    ].map((b, i) => (
                      <Paper p="sm" bg="var(--mantine-color-default-hover)" radius="md" key={i}>
                        <Text size="xs" fw={600}>{b.title}</Text>
                        <Divider my="xs" />
                        <Group justify="space-between" mb={2}><Text size="10px" c="dimmed">Allocated:</Text><Text size="10px" fw={600}>{b.alloc}</Text></Group>
                        <Group justify="space-between" mb={6}><Text size="10px" c="dimmed">Consumed:</Text><Text size="10px" fw={600} c="orange">{b.consumed}</Text></Group>
                        <Progress size="xs" color="orange" value={b.pct} radius="xl" />
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                  <Text fw={600} size="sm" mb="sm">Budget Transactions</Text>
                  <Table.ScrollContainer minWidth={600}>
                    <Table variant="striped" verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Transaction Type</Table.Th>
                          <Table.Th>Reference Number</Table.Th>
                          <Table.Th>Description</Table.Th>
                          <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
                          <Table.Th>Status</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {MOCK_TRANSACTIONS.map((t, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td><Text size="xs">{t.date}</Text></Table.Td>
                            <Table.Td><Badge size="xs" color="gray">{t.type}</Badge></Table.Td>
                            <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{t.ref}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{t.desc}</Text></Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600} c="red" suppressHydrationWarning>- ₹{t.amount.toLocaleString('en-IN')}</Text></Table.Td>
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

        {/* ==========================================
            TAB 3: STOCK ALLOCATION
           ========================================== */}
        <Tabs.Panel value="stock">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Stock Allocation Engine</Title>
                <Text size="sm" c="dimmed">Allocate godown inventory directly to active construction sites.</Text>
              </Stack>
              <Button 
                size="sm"
                color="indigo"
                leftSection={<IconPlus size={16} />} 
                onClick={() => setAllocateStockModal(true)}
              >
                Allocate Stock
              </Button>
            </Group>
          </Paper>

          <Stack gap="md">
            <Paper p="md" radius="md" withBorder>
              <Text fw={600} size="sm" mb="md">Available Stock View</Text>
              <Table.ScrollContainer minWidth={600}>
                <Table variant="simple" verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item Name</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Godown</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>Available Quantity</Table.Th>
                      <Table.Th>Unit</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {MOCK_STOCK.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td><Text size="xs" fw={600}>{item.name}</Text></Table.Td>
                        <Table.Td><Text size="xs">{item.category}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="dimmed">{item.godown}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600}>{item.qty}</Text></Table.Td>
                        <Table.Td><Text size="xs" c="dimmed">{item.unit}</Text></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Text fw={600} size="sm" mb="sm">Allocated Stock History</Text>
              <Table.ScrollContainer minWidth={600}>
                <Table variant="striped" verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Project</Table.Th>
                      <Table.Th>Item</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>Quantity Allocated</Table.Th>
                      <Table.Th>Godown</Table.Th>
                      <Table.Th>Allocation Date</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th style={{ width: 80 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {MOCK_ALLOC_HISTORY.map((h, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td><Text size="xs" fw={600}>{h.project}</Text></Table.Td>
                        <Table.Td><Text size="xs">{h.item}</Text></Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600}>{h.qty}</Text></Table.Td>
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

        {/* ==========================================
            TAB 4: PROJECT TRACKING
           ========================================== */}
        <Tabs.Panel value="tracking">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Project Tracking Engine</Title>
                <Text size="sm" c="dimmed">Review site milestones, timelines, and sign-off blockers.</Text>
              </Stack>
            </Group>
          </Paper>

          <Stack gap="md">
            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Text size="xs" fw={600} c="dimmed" mb="xs">PROJECT SUMMARY: {selectedProject.name}</Text>
                  <Grid gap="xs" mt="xs">
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Customer:</Text><Text size="xs" fw={600}>{selectedProject.customer}</Text></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Status:</Text><div>{renderStatusBadge(selectedProject.status)}</div></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Timeline:</Text><Text size="xs" fw={600}>{selectedProject.startDate} to {selectedProject.expectedCompletion}</Text></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Approved Budget:</Text><Text size="xs" fw={600} suppressHydrationWarning>₹{selectedProject.budgetAmount.toLocaleString('en-IN')}</Text></Grid.Col>
                  </Grid>

                  <Divider my="md" />

                  <Grid gap="sm">
                    <Grid.Col span={6}>
                      <Group justify="space-between" mb={2}><Text size="10px">Completion</Text><Text size="10px" fw={600}>74%</Text></Group>
                      <Progress color="teal" value={74} size="sm" radius="xl" />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group justify="space-between" mb={2}><Text size="10px">Budget Used</Text><Text size="10px" fw={600}>{selectedProject.budgetUsedPct}%</Text></Group>
                      <Progress color="orange" value={selectedProject.budgetUsedPct} size="sm" radius="xl" />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Text size="xs" fw={600} c="dimmed" mb="sm">PROJECT STATUS CONTROL</Text>
                  <Stack gap="xs">
                    <Select size="xs" label="Current Stage" data={['Planning', 'Material Preparation', 'Execution', 'Completion']} defaultValue="Execution" />
                    <TextInput size="xs" label="Action Required" defaultValue="Acquire MEP Clearance Sign-off" />
                    <Grid gap="xs">
                      <Grid.Col span={6}><TextInput size="xs" type="date" label="Next Review Date" defaultValue="2026-08-05" /></Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>

            <Paper p="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="lg">Project Status Timeline</Text>
              <Timeline active={2} bulletSize={22} lineWidth={2} radius="xl">
                <Timeline.Item bullet={<IconCircleCheck size={12} />} title="Planning">
                  <Text size="xs" c="dimmed">Approved architectural site profiles generated.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconCircleCheck size={12} />} title="Material Preparation">
                  <Text size="xs" c="dimmed">Initial bulk allocations routed.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconFilter size={12} />} title="Execution">
                  <Text size="xs" c="dimmed">Ongoing site civil work and pouring.</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconLockSquare size={12} />} title="Completion">
                  <Text size="xs" c="dimmed">Final handover and testing.</Text>
                </Timeline.Item>
              </Timeline>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Text fw={600} size="sm" mb="sm">Project Activity History</Text>
              <Table.ScrollContainer minWidth={600}>
                <Table variant="striped" verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Activity</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Action Required</Table.Th>
                      <Table.Th>Responsible Person</Table.Th>
                      <Table.Th>Remarks</Table.Th>
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
      </Tabs>

      {/* ====================================================================
          3. DRAWER: CREATE / EDIT PROJECT (Hydration-safe title)
         ==================================================================== */}
      <Drawer
        opened={projectDrawerOpened}
        onClose={() => setProjectDrawerOpened(false)}
        title={
          <Text fw={700} size="lg">
            {drawerMode === 'create' ? 'Create New Project' : `Edit: ${selectedProject.name}`}
          </Text>
        }
        position="right"
        size="lg"
      >
        <Stack gap="lg" style={{ paddingTop: 'var(--mantine-spacing-sm)' }}>
          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Project Name" placeholder="Enter project name" required defaultValue={drawerMode === 'edit' ? selectedProject.name : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Project Code" disabled value={drawerMode === 'edit' ? selectedProject.code : 'PMS-GEN-2026-X'} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Customer" placeholder="Select customer" required data={['Phoenix Infra Corp', 'Nexus Living Spaces']} defaultValue={drawerMode === 'edit' ? selectedProject.customer : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Project Type" data={['Commercial Real Estate', 'Residential High-Rise']} defaultValue={drawerMode === 'edit' ? selectedProject.type : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput label="Project Location" placeholder="Enter location" required defaultValue={drawerMode === 'edit' ? selectedProject.location : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput type="date" label="Start Date" defaultValue={drawerMode === 'edit' ? selectedProject.startDate : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput type="date" label="Expected Completion Date" defaultValue={drawerMode === 'edit' ? selectedProject.expectedCompletion : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Select label="Project Manager" data={['Arjun Mehta', 'Sarah Dsouza']} defaultValue={drawerMode === 'edit' ? selectedProject.projectManager : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Textarea label="Description / Notes" minRows={3} defaultValue={drawerMode === 'edit' ? selectedProject.description : ''} />
            </Grid.Col>
          </Grid>

          <Paper p="md" withBorder radius="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">Sub-contractors</Text>
              <Button size="xs" variant="outline" leftSection={<IconUserPlus size={14} />} onClick={() => setSubcontractorModal(true)}>Add Sub-contractor</Button>
            </Group>

            <Table.ScrollContainer minWidth={450}>
              <Table variant="simple" verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th style={{ width: 40 }}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {MOCK_SUBCONTRACTORS.map((sc) => (
                    <Table.Tr key={sc.id}>
                      <Table.Td><Text size="xs" fw={600}>{sc.name}</Text></Table.Td>
                      <Table.Td><Text size="xs">{sc.category}</Text></Table.Td>
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

          <Group justify="end" mt="md">
            <Button variant="default" onClick={() => setProjectDrawerOpened(false)}>Cancel</Button>
            <Button color="blue" onClick={() => setProjectDrawerOpened(false)}>Save Project</Button>
          </Group>
        </Stack>
      </Drawer>

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

      <Modal
        opened={allocateStockModal}
        onClose={() => setAllocateStockModal(false)}
        title={<Text fw={600}>Allocate Stock</Text>}
        centered
        radius="md"
        size="lg"
      >
        <Stack gap="md">
          <Grid gap="sm">
            <Grid.Col span={12}><Select size="sm" label="Project" value={selectedProjectId} data={MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name }))} disabled /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><Select size="sm" label="Source Godown" placeholder="Select godown" data={['Structural Storage Facility B', 'Main Yards Warehouse A']} required /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><Select size="sm" label="Item" placeholder="Select item" data={['High-Tensile Steel Rebar 500D', 'M30 Structural Concrete Mix']} required /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><NumberInput size="sm" label="Available Quantity" value={45} disabled /></Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}><NumberInput size="sm" label="Allocation Quantity" required min={1} max={45} /></Grid.Col>
            <Grid.Col span={12}><TextInput size="sm" placeholder="Enter remarks" label="Remarks" /></Grid.Col>
          </Grid>

          <Group justify="end" mt="md">
            <Button variant="default" size="sm" onClick={() => setAllocateStockModal(false)}>Cancel</Button>
            <Button size="sm" color="blue" leftSection={<IconCalendar size={16} />} onClick={() => setAllocateStockModal(false)}>Allocate Stock</Button>
          </Group>
        </Stack>
      </Modal>

    </Container>
  );
}