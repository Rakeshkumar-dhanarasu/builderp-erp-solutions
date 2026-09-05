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
    budgetAmount: 7836.22,
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
    budgetAmount: 18096,
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
  { date: '2026-07-01', type: 'Purchase Order', ref: 'PO-2026-8812', desc: 'Procurement of structural foundation aggregate mix', amount: 176.31, status: 'Settled' },
  { date: '2026-07-08', type: 'Sub-contractor Pay', ref: 'SC-PAY-4410', desc: 'Milestone 2 Slab Clearance Payment', amount: 470.17, status: 'Settled' }
];

const MOCK_ACTIVITIES = [
  { date: '2026-07-18', activity: 'Core Foundation Slab Casting Phase 2', status: 'Completed', actionReq: 'None', owner: 'Arjun Mehta', remarks: 'Passed quality inspections successfully.' },
  { date: '2026-07-15', activity: 'MEP Clearance Review Gate 1', status: 'Delayed', actionReq: 'Approval needed from local zoning authority', owner: 'Sarah Dsouza', remarks: 'Awaiting structural sign-off.' }
];

const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR' }).format(val);

// ============================================================================
// MAIN COMPONENT MATCHING YOUR EXACT LAYOUT & SPACING
// ============================================================================
export default function ProjectManagementModule() {
  const [activeTab, setActiveTab] = useState<string | null>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [projectModalOpened, setprojectModalOpened] = useState<boolean>(false);
  const [modalMode, setmodalMode] = useState<'create' | 'edit'>('create');
  const [subcontractorModal, setSubcontractorModal] = useState<boolean>(false);

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
        </Group>
      </Paper>

      {/* ====================================================================
          2. MODULE TABS (Variant: pills, radius: md, mb: lg)
         ==================================================================== */}
      <Tabs value={activeTab} onChange={triggerStateRefresh} color='brandOrange'variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="projects" leftSection={<IconFolder size={16} />}>Project List</Tabs.Tab>
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
                              <Text size="sm" fw={600}>{proj.name}</Text>
                              <Text size="10px" c="dimmed">{proj.code}</Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td><Text size="sm">{proj.customer}</Text></Table.Td>
                          <Table.Td><Text size="sm" c="dimmed">{proj.location}</Text></Table.Td>
                          <Table.Td><Text size="sm">{proj.projectManager}</Text></Table.Td>
                          <Table.Td>
                            <Stack gap={2}>
                              <Text size="10px">Start: {proj.startDate}</Text>
                              <Text size="10px" c="orange">Exp: {proj.expectedCompletion}</Text>
                            </Stack>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right' }}><Text size="sm" fw={600} suppressHydrationWarning>ر.ع. {proj.budgetAmount}</Text></Table.Td>
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
                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEditModal(proj.id)}>Edit Project</Menu.Item>
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
                    <Text size="lg" fw={700} my={4} suppressHydrationWarning> ر.ع.{(selectedProject.budgetAmount).toLocaleString('en-OM')}</Text>
                    <Text size="10px" c="dimmed">Approved from Sales module quotation</Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">AMOUNT USED</Text>
                    <Text size="lg" fw={700} c="orange" my={4} suppressHydrationWarning> ر.ع.{((selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-OM')}</Text>
                    <Text size="10px" c="dimmed">Total consumption to date</Text>
                  </Paper>

                  <Paper withBorder p="md" radius="md">
                    <Text size="xs" fw={600} c="dimmed">REMAINING BUDGET</Text>
                    <Text size="lg" fw={700} c="green" my={4} suppressHydrationWarning> ر.ع.{(selectedProject.budgetAmount - (selectedProject.budgetAmount * selectedProject.budgetUsedPct) / 100).toLocaleString('en-OM')}</Text>
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
                      { title: 'Material Cost', alloc: 'ر.ع. 3,134.49', consumed: 'ر.ع. 2,154.96', pct: 68.75 },
                      { title: 'Sub-contractor Cost', alloc: 'ر.ع. 3,918.11', consumed: 'ر.ع. 2,938.58', pct: 75 },
                      { title: 'Other Expenses', alloc: 'ر.ع. 783.62', consumed: 'ر.ع. 235.09', pct: 30 }
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
                            <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600} c="red" suppressHydrationWarning>- ر.ع.{t.amount.toLocaleString('en-OM')}</Text></Table.Td>
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
            TAB 3: PROJECT TRACKING
           ========================================== */}
        <Tabs.Panel value="tracking">
          <Paper p="md" radius="md" mb="xl" withBorder>
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Title order={4}>Project Tracking Engine</Title>
                <Text size="sm" c="dimmed">Review site milestones, timelines, and sign-off blockers.</Text>
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

          <Stack gap="md">
            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Text size="xs" fw={600} c="dimmed" mb="xs">PROJECT SUMMARY: {selectedProject.name}</Text>
                  <Grid gap="xs" mt="xs">
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Customer:</Text><Text size="xs" fw={600}>{selectedProject.customer}</Text></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Status:</Text><div>{renderStatusBadge(selectedProject.status)}</div></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Timeline:</Text><Text size="xs" fw={600}>{selectedProject.startDate} to {selectedProject.expectedCompletion}</Text></Grid.Col>
                    <Grid.Col span={6}><Text size="11px" c="dimmed">Approved Budget:</Text><Text size="xs" fw={600} suppressHydrationWarning> ر.ع.{selectedProject.budgetAmount.toLocaleString('en-OM')}</Text></Grid.Col>
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
      <Modal
        opened={projectModalOpened}
        onClose={() => setprojectModalOpened(false)}
        title={
          <Text fw={700} size="lg">
            {modalMode === 'create' ? 'Create New Project' : `Edit: ${selectedProject.name}`}
          </Text>
        }
        size="70%"
      >
        <Stack gap="lg" style={{ paddingTop: 'var(--mantine-spacing-sm)' }}>
          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Project Name" placeholder="Enter project name" required defaultValue={modalMode === 'edit' ? selectedProject.name : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Project Code" disabled value={modalMode === 'edit' ? selectedProject.code : 'PMS-GEN-2026-X'} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Customer" placeholder="Select customer" required data={['Phoenix Infra Corp', 'Nexus Living Spaces']} defaultValue={modalMode === 'edit' ? selectedProject.customer : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Project Type" data={['Commercial Real Estate', 'Residential High-Rise']} defaultValue={modalMode === 'edit' ? selectedProject.type : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <TextInput label="Project Location" placeholder="Enter location" required defaultValue={modalMode === 'edit' ? selectedProject.location : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput type="date" label="Start Date" defaultValue={modalMode === 'edit' ? selectedProject.startDate : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput type="date" label="Expected Completion Date" defaultValue={modalMode === 'edit' ? selectedProject.expectedCompletion : ''} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Select label="Project Manager" data={['Arjun Mehta', 'Sarah Dsouza']} defaultValue={modalMode === 'edit' ? selectedProject.projectManager : undefined} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Textarea label="Description / Notes" minRows={3} defaultValue={modalMode === 'edit' ? selectedProject.description : ''} />
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
            <Button variant="default" onClick={() => setprojectModalOpened(false)}>Cancel</Button>
            <Button color="blue" onClick={() => setprojectModalOpened(false)}>Save Project</Button>
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

    </Container>
  );
}