"use client"

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Text,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon,
  Modal,
  Drawer,
  Grid,
  SimpleGrid,
  Paper,
  RingProgress,
  Textarea,
  NumberInput,
  Timeline,
  Divider,
  Menu,
  Alert
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { 
  IconFolder, 
  IconReportMoney, 
  IconPackage, 
  IconChartBar, 
  IconSearch, 
  IconFilter, 
  IconPlus, 
  IconDotsVertical, 
  IconEye, 
  IconEdit, 
  IconTrash, 
  IconUserPlus,
  IconArrowsRightLeft,
  IconClock,
  IconCircle,
  IconAlertCircle
} from '@tabler/icons-react';

// --- MOCK DATA TYPES ---
interface SubContractor {
  id: string;
  name: string;
  category: string;
  scope: string;
  assignedDate: string;
  status: 'Active' | 'Pending' | 'Completed';
}

interface Project {
  id: string;
  name: string;
  code: string;
  customer: string;
  type: string;
  location: string;
  manager: string;
  startDate: Date | null;
  endDate: Date | null;
  budgetAmount: number;
  budgetUsedPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  description: string;
  subContractors: SubContractor[];
}

// --- INITIAL ENTERPRISE MOCK DATA ---
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Chennai Metro Phase II Civil Work',
    code: 'PMS-PRJ-2026-001',
    customer: 'CMRL (Chennai Metro Rail Ltd)',
    type: 'Infrastructure',
    location: 'Chennai, TN',
    manager: 'Rajesh Kumar',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2027-08-30'),
    budgetAmount: 20000000, // ₹2 Crores
    budgetUsedPercent: 40,  // ₹80 Lakhs used
    status: 'In Progress',
    description: 'Elevated viaduct structure fabrication and track laying alignments.',
    subContractors: [
      { id: 'SUB-01', name: 'L&T Infra Subdiv', category: 'Piling', scope: 'Foundations Pile Cap', assignedDate: '2026-01-20', status: 'Active' },
      { id: 'SUB-02', name: 'Alpha Electricals', category: 'Electrification', scope: 'Substation cabling', assignedDate: '2026-03-05', status: 'Pending' }
    ]
  },
  {
    id: 'PRJ-002',
    name: 'Ozone IT Park Block C Enclosure',
    code: 'PMS-PRJ-2026-002',
    customer: 'Ozone Tech Developers',
    type: 'Commercial Building',
    location: 'Siruseri, Chennai',
    manager: 'Arun Mehra',
    startDate: new Date('2026-02-10'),
    endDate: new Date('2026-12-20'),
    budgetAmount: 12000000,
    budgetUsedPercent: 15,
    status: 'In Progress',
    description: 'Facade structural glazing and interior drywall partitioning.',
    subContractors: []
  },
  {
    id: 'PRJ-003',
    name: 'Warehouse Logistics Hub Expansion',
    code: 'PMS-PRJ-2026-003',
    customer: 'SafeXpress Logistics',
    type: 'Industrial',
    location: 'Sriperumbudur, TN',
    manager: 'Vikram Singh',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2026-04-15'),
    budgetAmount: 8500000,
    budgetUsedPercent: 95,
    status: 'Delayed',
    description: 'Pre-engineered steel structural building extensions.',
    subContractors: []
  }
];

const INITIAL_STOCK = [
  { id: 'STK-01', name: 'TMT Steel Bars 12mm', category: 'Structural Steel', godown: 'Sriperumbudur Yard A', available: 450, unit: 'MT' },
  { id: 'STK-02', name: 'OPC Cement 53 Grade', category: 'Cement', godown: 'Guindy Central Stores', available: 1200, unit: 'Bags' },
  { id: 'STK-03', name: 'ReadyMix Concrete M30', category: 'Concrete', godown: 'Sriperumbudur Yard A', available: 180, unit: 'Cu.m' },
];

const INITIAL_ALLOCATION_HISTORY = [
  { id: 'ALC-101', project: 'Chennai Metro Phase II Civil Work', item: 'TMT Steel Bars 12mm', qty: 50, godown: 'Sriperumbudur Yard A', date: '2026-06-10', status: 'Allocated' },
  { id: 'ALC-102', project: 'Ozone IT Park Block C Enclosure', item: 'OPC Cement 53 Grade', qty: 300, godown: 'Guindy Central Stores', date: '2026-07-02', status: 'Allocated' },
];

// --- CORE EXPORTED COMPONENT ---
export default function ProjectManagementModule() {
  const [activeTab, setActiveTab] = useState<string | null>('projects');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  // Cross-module states
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <Box p="md" style={{ width: '100%' }}>
      {/* Module Title Banner */}
      <Paper withBorder p="md" radius="md" mb="md" bg="var(--mantine-color-body)">
        <Group justify="between">
          <div>
            <Title order={2} fw={700} c="indigo.8">Project Management Operations</Title>
            <Text size="sm" c="dimmed">
              Core execution tracking panel for authorized live project schedules, allocations, and ongoing financial consumption.
            </Text>
          </div>
          <Badge size="lg" variant="light" color="indigo" leftSection={<IconFolder size={14} />}>
            Operational Control
          </Badge>
        </Group>
      </Paper>

      {/* Internal Navigation Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md" color="indigo">
        <Tabs.List mb="lg">
          <Tabs.Tab value="projects" leftSection={<IconFolder size={16} />}>Projects</Tabs.Tab>
          <Tabs.Tab value="budget" leftSection={<IconReportMoney size={16} />}>Budget Tracking</Tabs.Tab>
          <Tabs.Tab value="stock" leftSection={<IconPackage size={16} />}>Stock Allocation</Tabs.Tab>
          <Tabs.Tab value="tracking" leftSection={<IconChartBar size={16} />}>Project Tracking</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="projects">
          <ProjectsTab projects={projects} setProjects={setProjects} />
        </Tabs.Panel>

        <Tabs.Panel value="budget">
          <BudgetTrackingTab projects={projects} selectedProjectId={selectedProjectId} onProjectChange={setSelectedProjectId} />
        </Tabs.Panel>

        <Tabs.Panel value="stock">
          <StockAllocationTab projects={projects} />
        </Tabs.Panel>

        <Tabs.Panel value="tracking">
          <ProjectTrackingTab projects={projects} selectedProjectId={selectedProjectId} onProjectChange={setSelectedProjectId} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

// ==========================================
// TAB 1: PROJECTS LIFECYCLE MANAGEMENT
// ==========================================
function ProjectsTab({ projects, setProjects }: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Modals & Drawer state
  const [formOpen, setFormOpen] = useState(false);
  const [subConDrawerOpen, setSubConDrawerOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Form states
  const [newProjName, setNewProjName] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newBudget, setNewBudget] = useState<number>(0);

  // Subcontractor addition form sub-states
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subScope, setSubScope] = useState('');

  const handleCreateProject = () => {
    if (!newProjName || !newCustomer) return;
    const nextCode = `PMS-PRJ-2026-00${projects.length + 1}`;
    const newProj: Project = {
      id: `PRJ-00${projects.length + 1}`,
      name: newProjName,
      code: nextCode,
      customer: newCustomer,
      type: 'Infrastructure Construction',
      location: newLocation || 'Default Location Site',
      manager: newManager || 'Unassigned',
      startDate: new Date(),
      endDate: new Date(Date.now() + 31536000000),
      budgetAmount: newBudget || 5000000,
      budgetUsedPercent: 0,
      status: 'Not Started',
      description: 'System generated core execution asset wrapper.',
      subContractors: []
    };
    setProjects([...projects, newProj]);
    setFormOpen(false);
    // Reset forms
    setNewProjName(''); setNewCustomer(''); setNewLocation(''); setNewManager(''); setNewBudget(0);
  };

  const handleAddSubContractor = () => {
    if (!activeProject || !subName) return;
    const updated = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          subContractors: [
            ...p.subContractors,
            {
              id: `SUB-${Date.now()}`,
              name: subName,
              category: subCategory || 'General Execution',
              scope: subScope || 'Full turnkey assignments',
              assignedDate: new Date().toISOString().split('T')[0],
              status: 'Active' as const
            }
          ]
        };
      }
      return p;
    });
    setProjects(updated);
    const updatedActive = updated.find(p => p.id === activeProject.id);
    if (updatedActive) setActiveProject(updatedActive);
    setSubName(''); setSubCategory(''); setSubScope('');
  };

  const handleRemoveSubContractor = (subId: string) => {
    if (!activeProject) return;
    const updated = projects.map(p => {
      if (p.id === activeProject.id) {
        return { ...p, subContractors: p.subContractors.filter(s => s.id !== subId) };
      }
      return p;
    });
    setProjects(updated);
    const updatedActive = updated.find(p => p.id === activeProject.id);
    if (updatedActive) setActiveProject(updatedActive);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.customer.toLowerCase().includes(search.toLowerCase()) ||
                          p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'In Progress': return 'blue';
      case 'Completed': return 'green';
      case 'Delayed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Stack gap="md">
      {/* Action Controls Panel */}
      <Paper withBorder p="sm" radius="md">
        <Grid align="end">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Search Projects"
              placeholder="Search via name, site location, client..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Status Filter"
              placeholder="All Statuses"
              data={['Not Started', 'In Progress', 'Completed', 'Delayed']}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 5 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button leftSection={<IconPlus size={16} />} color="indigo" onClick={() => setFormOpen(true)}>
              Create Project
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Project Matrix Table */}
      <Paper withBorder radius="md" style={{ overflowX: 'auto' }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--mantine-color-gray-0)">
            <Table.Tr>
              <Table.Th>Project Name</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Manager</Table.Th>
              <Table.Th>Budget Amount</Table.Th>
              <Table.Th>Used %</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th style={{ width: 80 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredProjects.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>
                  <Text size="sm" fw={600}>{p.name}</Text>
                  <Text size="xs" c="dimmed">{p.code}</Text>
                </Table.Td>
                <Table.Td><Text size="sm">{p.customer}</Text></Table.Td>
                <Table.Td><Text size="sm">{p.location}</Text></Table.Td>
                <Table.Td><Text size="sm">{p.manager}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600}>₹{(p.budgetAmount / 100000).toFixed(1)} Lakhs</Text></Table.Td>
                <Table.Td>
                  <Group gap={5}>
                    <RingProgress size={34} thickness={4} sections={[{ value: p.budgetUsedPercent, color: p.budgetUsedPercent > 90 ? 'red' : 'indigo' }]} />
                    <Text size="xs" fw={500}>{p.budgetUsedPercent}%</Text>
                  </Group>
                </Table.Td>
                <Table.Td><Badge color={getStatusColor(p.status)} variant="light">{p.status}</Badge></Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16} /></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Operational Actions</Menu.Label>
                      <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>Edit Parameters</Menu.Item>
                      <Menu.Item 
                        leftSection={<IconUserPlus size={14} />} 
                        onClick={() => { setActiveProject(p); setSubConDrawerOpen(true); }}
                      >
                        Sub-contractors
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item color="red" leftSection={<IconTrash size={14} />}>Archive Project</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
            {filteredProjects.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={8} align="center"><Text c="dimmed" py="xl">No enterprise projects found matching parameters.</Text></Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* CREATE PROJECT MODAL (Dedicated Full-Page Variant Alternative Form) */}
      <Modal opened={formOpen} onClose={() => setFormOpen(false)} title="Initialize New Project Wrapper" size="xl" radius="md">
        <Stack gap="md">
          <Alert color="indigo" title="Pre-Approved Scope Warning" icon={<IconAlertCircle size={16} />}>
            Financial baseline metrics and raw initial quotations are exclusively imported from the Sales validation pipeline modules.
          </Alert>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Project Name" placeholder="e.g., Solar Array Structural Alignment" required value={newProjName} onChange={(e) => setNewProjName(e.target.value)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Project Code" description="Auto-generated structure hash" disabled placeholder="PMS-PRJ-2026-XXX" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Customer / Client Entity" placeholder="Select or type client name" required value={newCustomer} onChange={(e) => setNewCustomer(e.target.value)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select label="Project Domain Classification" placeholder="Choose domain" data={['Infrastructure', 'Commercial Building', 'Industrial Plant', 'Residential Development']} defaultValue="Infrastructure" />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput label="Site Location Geo-Coordinates / Address" placeholder="e.g., Plot 4B, SIPCOT Industrial Park, Irungattukottai" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <DateInput label="Scheduled Work Activation Date" placeholder="Select date" defaultValue={new Date()} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <DateInput label="Contractual Completion Target" placeholder="Select target date" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Assigned Prime Project Manager" placeholder="e.g., Rajesh Kumar" value={newManager} onChange={(e) => setNewManager(e.target.value)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <NumberInput label="Assigned Allocation Budget Cap (₹)" placeholder="Value in INR" hideControls value={newBudget} onChange={(v) => setNewBudget(Number(v))} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Core Operations Scope Description" placeholder="Detailed engineering instructions, safety guidelines, and log directives..." rows={3} />
            </Grid.Col>
          </Grid>
          <Group justify="end" mt="md">
            <Button variant="outline" color="gray" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button color="indigo" onClick={handleCreateProject}>Provision Project Blueprint</Button>
          </Group>
        </Stack>
      </Modal>

      {/* MANAGING SUB-CONTRACTORS DRAWER */}
      <Drawer 
        opened={subConDrawerOpen} 
        onClose={() => setSubConDrawerOpen(false)} 
        title={`Stakeholder Board: ${activeProject?.name}`} 
        position="right" 
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Provision, modify, or terminate field execution tasks handled by specialized external partner sub-contractors.
          </Text>

          <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
            <Text fw={600} size="sm" mb="xs">Assign Vendor / Sub-contractor</Text>
            <Stack gap="xs">
              <TextInput label="Vendor Corporate Entity Name" size="xs" placeholder="e.g., Technoelectra Pvt Ltd" value={subName} onChange={(e) => subName !== undefined && setSubName(e.target.value)} />
              <SimpleGrid cols={2}>
                <TextInput label="Work Category Classification" size="xs" placeholder="e.g., Plumbing / HVAC" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
                <TextInput label="Assigned Scope Limits" size="xs" placeholder="e.g., Piping Layout & Testing" value={subScope} onChange={(e) => setSubScope(e.target.value)} />
              </SimpleGrid>
              <Button size="xs" color="indigo" mt="xs" leftSection={<IconPlus size={14} />} onClick={handleAddSubContractor}>
                Commit Vendor Assignment
              </Button>
            </Stack>
          </Paper>

          <Divider label="Active Field Subcontractors" labelPosition="center" />

          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Sub-contractor</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Scope Status</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {activeProject?.subContractors.map((sub) => (
                <Table.Tr key={sub.id}>
                  <Table.Td>
                    <Text size="xs" fw={600}>{sub.name}</Text>
                    <Text size="10px" c="dimmed">Assigned: {sub.assignedDate}</Text>
                  </Table.Td>
                  <Table.Td><Badge size="xs" color="gray" variant="outline">{sub.category}</Badge></Table.Td>
                  <Table.Td><Text size="xs" lineClamp={1}>{sub.scope}</Text></Table.Td>
                  <Table.Td>
                    <ActionIcon size="xs" color="red" variant="subtle" onClick={() => handleRemoveSubContractor(sub.id)}>
                      <IconTrash size={12} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
              {(!activeProject?.subContractors || activeProject.subContractors.length === 0) && (
                <Table.Tr>
                  <Table.Tr><Table.Td colSpan={4} align="center"><Text size="xs" c="dimmed" py="md">No active external vendors assigned to this project site map.</Text></Table.Td></Table.Tr>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Stack>
      </Drawer>
    </Stack>
  );
}

// ==========================================
// TAB 2: FINANCIAL BUDGET TRACKING INTERFACE
// ==========================================
function BudgetTrackingTab({ projects, selectedProjectId, onProjectChange }: { projects: Project[]; selectedProjectId: string; onProjectChange: (val: string) => void }) {
  const currentProj = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Derive structural values for dashboard display mapping
  const totalApproved = currentProj.budgetAmount;
  const amountUsed = totalApproved * (currentProj.budgetUsedPercent / 100);
  const remainingBudget = totalApproved - amountUsed;

  return (
    <Stack gap="md">
      {/* Project Selector Anchor */}
      <Paper withBorder p="sm" radius="md">
        <Group justify="between">
          <Text size="sm" fw={600} c="dimmed">Financial Tracking Dashboard Target View:</Text>
          <Select
            placeholder="Switch Active Project View"
            data={projects.map(p => ({ value: p.id, label: p.name }))}
            value={selectedProjectId}
            onChange={(val) => val && onProjectChange(val)}
            style={{ minWidth: 350 }}
          />
        </Group>
      </Paper>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Approved Value Baseline</Text>
          <Title order={3} fw={700} mt="xs">₹{(totalApproved / 10000000).toFixed(2)} Cr</Title>
          <Text size="xs" c="green" mt="xs">Sourced from validated Sales Contract</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Consumed Cost Drawdown</Text>
          <Title order={3} fw={700} mt="xs" c="red.7">₹{(amountUsed / 100000).toFixed(1)} Lakhs</Title>
          <Text size="xs" c="dimmed" mt="xs">Physical resource bills & field advances</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">Remaining Safe Liquidity</Text>
          <Title order={3} fw={700} mt="xs" c="indigo.7">₹{(remainingBudget / 10000000).toFixed(2)} Cr</Title>
          <Text size="xs" c="dimmed" mt="xs">Available allocation bandwidth</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="between" wrap="nowrap">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Burn Rate</Text>
              <Text size="xl" fw={700} mt="xs">{currentProj.budgetUsedPercent}%</Text>
            </div>
            <RingProgress 
              size={65} 
              thickness={6} 
              sections={[{ value: currentProj.budgetUsedPercent, color: 'indigo' }]} 
              label={<Text size="xs" ta="center" fw={700}>{currentProj.budgetUsedPercent}%</Text>}
            />
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Breakdown Metrics */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper withBorder p="md" radius="md" style={{ height: '100%' }}>
            <Title order={4} mb="md" fw={600}>Operational Segment Breakdowns</Title>
            <Stack gap="sm">
              <Box>
                <Group justify="between" mb={4}>
                  <Text size="sm" fw={500}>Material Procurement Allocation</Text>
                  <Text size="xs" c="dimmed">₹45.00 Lakhs Allocated | ₹32.4 Lakhs Consumed</Text>
                </Group>
                <div style={{ height: 8, backgroundColor: 'var(--mantine-color-gray-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--mantine-color-indigo-6)' }}></div>
                </div>
              </Box>

              <Box>
                <Group justify="between" mb={4}>
                  <Text size="sm" fw={500}>Subcontractor Contract Valuations</Text>
                  <Text size="xs" c="dimmed">₹30.00 Lakhs Contracted | ₹12.0 Lakhs Paid</Text>
                </Group>
                <div style={{ height: 8, backgroundColor: 'var(--mantine-color-gray-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--mantine-color-teal-6)' }}></div>
                </div>
              </Box>

              <Box>
                <Group justify="between" mb={4}>
                  <Text size="sm" fw={500}>Logistics & Machine Overhead Allowances</Text>
                  <Text size="xs" c="dimmed">₹5.00 Lakhs Planned | ₹4.8 Lakhs Actual Outflow</Text>
                </Group>
                <div style={{ height: 8, backgroundColor: 'var(--mantine-color-gray-2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '96%', height: '100%', backgroundColor: 'var(--mantine-color-orange-6)' }}></div>
                </div>
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="md" bg="var(--mantine-color-indigo-0)" style={{ height: '100%' }}>
            <Title order={4} mb="xs" c="indigo.9" fw={600}>Sales Synchronization Data Ledger</Title>
            <Text size="xs" c="indigo.8" mb="md">
              The following reference values are dynamically fetched from locked client contracts inside the core commercial billing engine.
            </Text>
            <SimpleGrid cols={2} spacing="xs">
              <div>
                <Text size="10px" c="dimmed" tt="uppercase">Approved Quotation Ref</Text>
                <Text size="sm" fw={600}>QTN-2026-X8890</Text>
              </div>
              <div>
                <Text size="10px" c="dimmed" tt="uppercase">Contract Sign Date</Text>
                <Text size="sm" fw={600}>Jan 02, 2026</Text>
              </div>
              <div>
                <Text size="10px" c="dimmed" tt="uppercase">Retention Clause Hold</Text>
                <Text size="sm" fw={600}>10% Max Outflow</Text>
              </div>
              <div>
                <Text size="10px" c="dimmed" tt="uppercase">Tax Ledger Base Map</Text>
                <Text size="sm" fw={600}>GST 18% Exclusive</Text>
              </div>
            </SimpleGrid>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Transaction Records */}
      <Paper withBorder radius="md">
        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={4} fw={600}>Recent Project Transaction Logs</Title>
        </Box>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--mantine-color-gray-0)">
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Classification Group</Table.Th>
              <Table.Th>Reference Hash</Table.Th>
              <Table.Th>Operational Description</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Outflow Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td><Text size="sm">2026-07-12</Text></Table.Td>
              <Table.Td><Badge color="indigo" variant="light">Material Purchase</Badge></Table.Td>
              <Table.Td><Text size="sm" style={{ fontFamily: 'monospace' }}>PO-778902</Text></Table.Td>
              <Table.Td><Text size="sm">Procurement invoice settlement for 50MT Steel Reinforcement Bars</Text></Table.Td>
              <Table.Td align="right"><Text size="sm" fw={600}>₹24,50,000</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td><Text size="sm">2026-07-05</Text></Table.Td>
              <Table.Td><Badge color="teal" variant="light">Sub-contractor Pay</Badge></Table.Td>
              <Table.Td><Text size="sm" style={{ fontFamily: 'monospace' }}>VND-PMT-098</Text></Table.Td>
              <Table.Td><Text size="sm">Milestone 1 execution clearance payment to L&T Infra Subdiv</Text></Table.Td>
              <Table.Td align="right"><Text size="sm" fw={600}>₹12,00,000</Text></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td><Text size="sm">2026-06-28</Text></Table.Td>
              <Table.Td><Badge color="orange" variant="light">Direct Expense</Badge></Table.Td>
              <Table.Td><Text size="sm" style={{ fontFamily: 'monospace' }}>EXP-CASH-441</Text></Table.Td>
              <Table.Td><Text size="sm">Diesel fuel supply provisioning for site generators & earthmovers</Text></Table.Td>
              <Table.Td align="right"><Text size="sm" fw={600}>₹1,80,000</Text></Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

// ==========================================
// TAB 3: INVENTORY STOCK ALLOCATION TRACKING
// ==========================================
function StockAllocationTab({ projects }: { projects: Project[] }) {
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [availableStock, setAvailableStock] = useState(INITIAL_STOCK);
  const [allocationHistory, setAllocationHistory] = useState(INITIAL_ALLOCATION_HISTORY);

  // Form states
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [allocQty, setAllocQty] = useState<number>(0);
  const [siteLocationText, setSiteLocationText] = useState('');

  const currentStockItem = availableStock.find(s => s.id === selectedStockId);

  const handleCommitAllocation = () => {
    if (!targetProjectId || !selectedStockId || allocQty <= 0 || !currentStockItem) return;
    
    // Validation check: ensure we don't over-allocate stock
    if (allocQty > currentStockItem.available) {
      alert('Error: Specified allocation quantity exceeds currently verifiable warehouse inventory levels.');
      return;
    }

    const matchedProj = projects.find(p => p.id === targetProjectId);

    // Update warehouse counts
    setAvailableStock(availableStock.map(s => {
      if (s.id === selectedStockId) {
        return { ...s, available: s.available - allocQty };
      }
      return s;
    }));

    // Add record to allocation history logs
    setAllocationHistory([
      {
        id: `ALC-${Date.now()}`,
        project: matchedProj ? matchedProj.name : 'Unknown Pipeline Target',
        item: currentStockItem.name,
        qty: allocQty,
        godown: currentStockItem.godown,
        date: new Date().toISOString().split('T')[0],
        status: 'Allocated'
      },
      ...allocationHistory
    ]);

    setAllocationModalOpen(false);
    setSelectedStockId(null);
    setAllocQty(0);
  };

  return (
    <Stack gap="md">
      {/* Allocation Context Headers */}
      <Paper withBorder p="sm" radius="md">
        <Group justify="between">
          <div>
            <Text fw={600} size="sm">Warehouse Material Allocation Interface Bridge</Text>
            <Text size="xs" c="dimmed">Pull authenticated warehouse inventories into specific active operational site grids.</Text>
          </div>
          <Button leftSection={<IconArrowsRightLeft size={16} />} color="indigo" onClick={() => setAllocationModalOpen(true)}>
            Allocate Stock To Site
          </Button>
        </Group>
      </Paper>

      <Grid>
        {/* Core Stock Ledger Checklist Panel */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md" fw={600}>Verifiable Central Store Stocks</Title>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Material Item Description</Table.Th>
                  <Table.Th>Godown Location</Table.Th>
                  <Table.Th align="right">Available Qty</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {availableStock.map(stk => (
                  <Table.Tr key={stk.id}>
                    <Table.Td>
                      <Text size="xs" fw={600}>{stk.name}</Text>
                      <Text size="10px" c="dimmed">{stk.category}</Text>
                    </Table.Td>
                    <Table.Td><Text size="xs">{stk.godown}</Text></Table.Td>
                    <Table.Td align="right"><Text size="xs" fw={700} color="indigo">{stk.available} {stk.unit}</Text></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>

        {/* Allocation History Ledger Map */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md" fw={600}>Site Dispatch Allocation History Logs</Title>
            <Table verticalSpacing="sm">
              <Table.Thead bg="var(--mantine-color-gray-0)">
                <Table.Tr>
                  <Table.Th>Target Destination Project</Table.Th>
                  <Table.Th>Material</Table.Th>
                  <Table.Th>Dispatched Volume</Table.Th>
                  <Table.Th>Source Godown</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allocationHistory.map(hist => (
                  <Table.Tr key={hist.id}>
                    <Table.Td>
                      <Text size="xs" fw={600} lineClamp={1}>{hist.project}</Text>
                    </Table.Td>
                    <Table.Td><Text size="xs">{hist.item}</Text></Table.Td>
                    <Table.Td><Badge color="teal" variant="light" size="xs">{hist.qty} Units</Badge></Table.Td>
                    <Table.Td><Text size="xs" c="dimmed">{hist.godown}</Text></Table.Td>
                    <Table.Td><Text size="xs">{hist.date}</Text></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* STRATEGIC ALLOCATION WORKFLOW FORM MODAL */}
      <Modal opened={allocationModalOpen} onClose={() => setAllocationModalOpen(false)} title="Issue Material Allocation Request" size="md" radius="md">
        <Stack gap="sm">
          <Select 
            label="Destination Project Target Site" 
            placeholder="Select operational project"
            required
            data={projects.map(p => ({ value: p.id, label: p.name }))}
            value={targetProjectId}
            onChange={setTargetProjectId}
          />
          <TextInput 
            label="Drop Site Specific Terminal Address" 
            placeholder="e.g., Block A Staging Area"
            value={siteLocationText}
            onChange={(e) => setSiteLocationText(e.target.value)}
          />
          <Select
            label="Source Storage Pool Hub (Godown)"
            placeholder="Select material batch"
            required
            data={availableStock.map(s => ({ value: s.id, label: `${s.name} (${s.godown})` }))}
            value={selectedStockId}
            onChange={setSelectedStockId}
          />
          {currentStockItem && (
            <Alert color="blue" variant="light" py="xs">
              Current Available Inventory Balance: **{currentStockItem.available} {currentStockItem.unit}**
            </Alert>
          )}
          <NumberInput
            label="Allocation Transference Quantity"
            placeholder="Input numeric allocation capacity"
            min={1}
            required
            value={allocQty}
            onChange={(v) => setAllocQty(Number(v))}
          />
          <DateInput label="Dispatch Log Entry Date" placeholder="Choose execution window" defaultValue={new Date()} />
          <Textarea label="Log Dispatch Annotations / Remarks" placeholder="Input driver details, transport parameters, delivery vehicle license stamps..." rows={2} />
          
          <Group justify="end" mt="md">
            <Button variant="outline" color="gray" onClick={() => setAllocationModalOpen(false)}>Cancel</Button>
            <Button color="indigo" onClick={handleCommitAllocation} disabled={!targetProjectId || !selectedStockId || allocQty <= 0}>
              Authorize Dispatch Link
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

// ==========================================
// TAB 4: PROJECT EXECUTION TRACKING TIMELINE
// ==========================================
function ProjectTrackingTab({ projects, selectedProjectId, onProjectChange }: { projects: Project[]; selectedProjectId: string; onProjectChange: (val: string) => void }) {
  const currentProj = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <Stack gap="md">
      {/* Project Switch Board */}
      <Paper withBorder p="sm" radius="md">
        <Group justify="between">
          <Text size="sm" fw={600} c="dimmed">Milestone Engine Context Selector:</Text>
          <Select
            placeholder="Switch Track Target"
            data={projects.map(p => ({ value: p.id, label: p.name }))}
            value={selectedProjectId}
            onChange={(val) => val && onProjectChange(val)}
            style={{ minWidth: 350 }}
          />
        </Group>
      </Paper>

      <Grid>
        {/* Core Timeline Milestone Blueprint Map */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="md" style={{ height: '100%' }}>
            <Title order={4} mb="lg" fw={600}>Phased Development Progression</Title>
            
            <Timeline active={2} bulletSize={24} lineWidth={2}>
              <Timeline.Item bullet={<IconCircle size={14} />} title="Phase 1: Planning & Setup Architecture">
                <Text c="dimmed" size="xs">Site clearances, survey layouts finalized, baseline allocations imported.</Text>
                <Text size="10px" mt={4} fw={700} c="green">Status: Fully Discharged</Text>
              </Timeline.Item>

              <Timeline.Item bullet={<IconCircle size={14} />} title="Phase 2: Material Preparation & Marshaling">
                <Text c="dimmed" size="xs">Stock routing setup from central godowns completed. High volume storage enabled.</Text>
                <Text size="10px" mt={4} fw={700} c="green">Status: Fully Discharged</Text>
              </Timeline.Item>

              <Timeline.Item bullet={<IconClock size={14} />} title="Phase 3: Heavy Infrastructure Execution">
                <Text c="dimmed" size="xs">Current ongoing physical construction framework activity logs running.</Text>
                <Text size="10px" mt={4} fw={700} c="blue">Status: Active Execution Window</Text>
              </Timeline.Item>

              <Timeline.Item bullet={<IconAlertCircle size={14} />} title="Phase 4: Inspection, Compliance & Handoff">
                <Text c="dimmed" size="xs">Quality sign-off loops, final measurements clearance from master customer board.</Text>
                <Text size="10px" mt={4} fw={700} c="gray">Status: Pending Subsequent Gateways</Text>
              </Timeline.Item>
            </Timeline>
          </Paper>
        </Grid.Col>

        {/* Detailed Status Overview & History Log Grid */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md" style={{ height: '100%' }}>
            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="md" fw={600}>Project Snapshot Parameters</Title>
              <SimpleGrid cols={2} spacing="sm">
                <Box>
                  <Text size="10px" c="dimmed" tt="uppercase">Project Manager Anchor</Text>
                  <Text size="sm" fw={600}>{currentProj.manager}</Text>
                </Box>
                <Box>
                  <Text size="10px" c="dimmed" tt="uppercase">Baseline Operational Status</Text>
                  <Badge variant="dot" size="sm" color={currentProj.status === 'Delayed' ? 'red' : 'indigo'}>
                    {currentProj.status}
                  </Badge>
                </Box>
                <Box>
                  <Text size="10px" c="dimmed" tt="uppercase">Execution Window Range</Text>
                  <Text size="xs" fw={500}>
                    {currentProj.startDate?.toLocaleDateString()} to {currentProj.endDate?.toLocaleDateString()}
                  </Text>
                </Box>
                <Box>
                  <Text size="10px" c="dimmed" tt="uppercase">Budget Depletion Vector</Text>
                  <Text size="xs" fw={600} c="indigo">{currentProj.budgetUsedPercent}% Total Drawdown Outflow</Text>
                </Box>
              </SimpleGrid>
            </Paper>

            <Paper withBorder radius="md" style={{ flexGrow: 1 }}>
              <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Title order={4} fw={600}>Historical Site Activity Audit Trail</Title>
              </Box>
              <Table verticalSpacing="xs">
                <Table.Thead bg="var(--mantine-color-gray-0)">
                  <Table.Tr>
                    <Table.Th>Timestamp</Table.Th>
                    <Table.Th>Logged Activity</Table.Th>
                    <Table.Th>Assigned Stakeholder</Table.Th>
                    <Table.Th>Status Update</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td><Text size="xs">2026-07-14</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={500}>Foundational concrete pouring block 2B</Text></Table.Td>
                    <Table.Td><Text size="xs">Field Eng. Srinivasan</Text></Table.Td>
                    <Table.Td><Badge size="xs" color="green">Verified</Badge></Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><Text size="xs">2026-07-10</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={500}>Subcontractor initial site layout framing mapping</Text></Table.Td>
                    <Table.Td><Text size="xs">L&T Supervisor Team</Text></Table.Td>
                    <Table.Td><Badge size="xs" color="green">Verified</Badge></Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td><Text size="xs">2026-07-01</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={500}>Safety clearance inspection baseline review</Text></Table.Td>
                    <Table.Td><Text size="xs">Rajesh Kumar (PM)</Text></Table.Td>
                    <Table.Td><Badge size="xs" color="orange">Pending Review</Badge></Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}