"use client";

import React, { useState } from "react";
import {
  Stack,
  Card,
  Group,
  Text,
  Select,
  Tabs,
  Table,
  Badge,
  Button,
  SimpleGrid,
  ThemeIcon,
  ActionIcon,
  Progress,
  Tooltip,
  Textarea,
  NumberInput,
  TextInput,
  Modal,
  Divider
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBuilding,
  IconClipboardCheck,
  IconTruckDelivery,
  IconReceipt2,
  IconPlus,
  IconCheck,
  IconX,
  IconArrowBackUp,
  IconPackage,
  IconTrendingDown,
  IconUser,
  IconInfoCircle
} from "@tabler/icons-react";

// Shared Project Context Ledger
const projectsList = [
  { id: "p1", clientName: "Alpha Manufacturing Corp", activeSite: "Sector 4 Factory Build" },
  { id: "p2", clientName: "Omega Logistics Infrastructure", activeSite: "Hub Terminal Delta" },
  { id: "p3", clientName: "Apex Retail Developers", activeSite: "Plaza Commercial Complex" }
];

// Central Stock Catalog Visibility (Shared across context)
const centralStockData = [
  { item: "Structural I-Beams (Grade A)", available: 140, unit: "Pcs" },
  { item: "Portland Cement Premium", available: 850, unit: "Bags" },
  { item: "Reinforcement Steel Rebar 12mm", available: 420, unit: "Bundles" },
  { item: "Heavy Duty Conduit Piping", available: 300, unit: "Meters" }
];

export default function ProjectManagementPage() {
  const [activeProjectId, setActiveProjectId] = useState<string>("p1");
  const [activeTab, setActiveTab] = useState<string | null>("requests");
  
  // Role Simulation State (Toggle for testing hidden constraints)
  const [currentRole, setCurrentRole] = useState<string>("admin");

  // Form Modals states
  const [requestModalOpened, { open: openRequestModal, close: closeRequestModal }] = useDisclosure(false);
  const [expenseModalOpened, { open: openExpenseModal, close: closeExpenseModal }] = useDisclosure(false);

  const currentProject = projectsList.find(p => p.id === activeProjectId) || projectsList[0];

  // Pipeline State Framework Logic (Mocking real-time storage transitions)
  const [requests, setRequests] = useState([
    { id: "REQ-01", item: "Structural I-Beams (Grade A)", qty: 25, unit: "Pcs", site: currentProject.activeSite, status: "Pending", requestedBy: "Site Eng. Smith" },
    { id: "REQ-02", item: "Portland Cement Premium", qty: 200, unit: "Bags", site: currentProject.activeSite, status: "Approved", requestedBy: "Site Eng. Smith" },
    { id: "REQ-03", item: "Reinforcement Steel Rebar 12mm", qty: 50, unit: "Bundles", site: currentProject.activeSite, status: "Rejected", requestedBy: "Site Eng. Jones" },
    { id: "REQ-04", item: "Heavy Duty Conduit Piping", qty: 120, unit: "Meters", site: currentProject.activeSite, status: "Transferred", requestedBy: "Site Eng. Smith" }
  ]);

  const [transfers, setTransfers] = useState([
    { id: "TRN-881", item: "Heavy Duty Conduit Piping", qty: 120, unit: "Meters", site: currentProject.activeSite, status: "Delivered", date: "2026-06-02" },
    { id: "TRN-882", item: "Portland Cement Premium", qty: 200, unit: "Bags", site: currentProject.activeSite, status: "Dispatched", date: "2026-06-08" }
  ]);

  const [returns, setReturns] = useState([
    { id: "RET-102", item: "Heavy Duty Conduit Piping", qty: 15, unit: "Meters", sourceSite: currentProject.activeSite, status: "Restored", date: "2026-06-07" }
  ]);

  const [expenses, setExpenses] = useState([
    { id: "EXP-501", date: "2026-06-01", category: "Labor", amount: 4500, site: currentProject.activeSite, notes: "Emergency overtime foundation pouring shifts" },
    { id: "EXP-502", date: "2026-06-04", category: "Transport", amount: 1200, site: currentProject.activeSite, notes: "Flatbed freight delivery surcharge for I-Beams" },
    { id: "EXP-503", date: "2026-06-06", category: "Misc Charges", amount: 650, site: currentProject.activeSite, notes: "On-site equipment hardware replacements" }
  ]);

  // Calculations engine metrics
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  // Pipeline state handlers
  const handleApproval = (id: string, newStatus: "Approved" | "Rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleInitiateTransfer = (request: typeof requests[0]) => {
    setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: "Transferred" } : r));
    setTransfers(prev => [
      {
        id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
        item: request.item,
        qty: request.qty,
        unit: request.unit,
        site: request.site,
        status: "Dispatched",
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
  };

  return (
    <Stack gap="lg" style={{ width: "100%" }}>
      
      {/* 🎯 GLOBAL PROJECT WORKSPACE CONTEXT SWITCHER */}
      <Card withBorder radius="md" p="sm" shadow="xs">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Project Management Scope Context</Text>
            <Group gap="xs">
              <Text size="md" fw={700} c="indigo">Active Focus: {currentProject.clientName}</Text>
              <Badge variant="dot" color="blue">{currentProject.activeSite}</Badge>
            </Group>
          </Stack>
          
          <Group gap="sm">
            <Select
              size="xs"
              label="Simulate Workspace View Role"
              data={[{ value: "admin", label: "Admin / PM Head" }, { value: "site", label: "Site Supervisor" }]}
              value={currentRole}
              onChange={(val) => val && setCurrentRole(val)}
              style={{ width: 160 }}
            />
            <Select
              label="Switch Active Target Project"
              placeholder="Select project"
              data={projectsList.map(p => ({ value: p.id, label: p.clientName }))}
              value={activeProjectId}
              onChange={(value) => value && setActiveProjectId(value)}
              allowDeselect={false}
              leftSection={<IconBuilding size={16} stroke={1.5} />}
              style={{ width: 260 }}
              radius="md"
            />
          </Group>
        </Group>
      </Card>

      {/* 📦 CENTRAL STOCK MONITORING BANNER */}
      <Card withBorder radius="md" p="md" bg="var(--mantine-color-default-element)">
        <Group mb="xs" gap="xs">
          <IconPackage size={18} style={{ color: "var(--mantine-color-indigo-filled)" }} />
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">Central Stock Registry Visibility (Real-Time Availability Check)</Text>
        </Group>
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
          {centralStockData.map((stock, i) => (
            <Card withBorder key={i} p="xs" radius="sm" shadow="none">
              <Text size="xs" c="dimmed" fw={500} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stock.item}</Text>
              <Text size="md" fw={700} mt={2}>{stock.available} <Text span size="xs" fw={500} c="dimmed">{stock.unit}</Text></Text>
            </Card>
          ))}
        </SimpleGrid>
      </Card>

      {/* 🔄 CORE PIPELINE TAB CONTROLLER ENTRY POINT */}
      <Card withBorder shadow="sm" radius="md" p="md">
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
          <Tabs.List>
            <Tabs.Tab value="requests" leftSection={<IconClipboardCheck size={16} />}>
              1. Requests & Approvals
            </Tabs.Tab>
            <Tabs.Tab value="transfers" leftSection={<IconTruckDelivery size={16} />}>
              2. Transfers & Returns
            </Tabs.Tab>
            <Tabs.Tab value="expenses" leftSection={<IconReceipt2 size={16} />}>
              3. Expenses Tracking
            </Tabs.Tab>
          </Tabs.List>

          {/* =======================================
              TAB 1: REQUESTS & APPROVALS WORKSPACE 
             ======================================= */}
          <Tabs.Panel value="requests" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text fw={700} size="md">Inventory Authorization Controls</Text>
                  <Text size="xs" c="dimmed">Rule validation: Nothing leaves material storage without explicit structural sign-off approval flags.</Text>
                </div>
                <Button size="xs" leftSection={<IconPlus size={14} />} color="indigo" onClick={openRequestModal}>
                  Create Allocation Request
                </Button>
              </Group>

              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead bg="var(--mantine-color-neutral-light)">
                  <Table.Tr>
                    <Table.Th>Request ID</Table.Th>
                    <Table.Th>Material Item</Table.Th>
                    <Table.Th>Qty Requested</Table.Th>
                    <Table.Th>Destination Site Target</Table.Th>
                    <Table.Th>Requested By</Table.Th>
                    <Table.Th>Status State</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Pipeline Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {requests.map((req) => (
                    <Table.Tr key={req.id}>
                      <Table.Td fw={700}><Text size="sm" fw={700}>{req.id}</Text></Table.Td>
                      <Table.Td fw={500}><Text size="sm" fw={500}>{req.item}</Text></Table.Td>
                      <Table.Td><Text size="sm" fw={600}>{req.qty} {req.unit}</Text></Table.Td>
                      <Table.Td><Badge variant="light" color="gray">{req.site}</Badge></Table.Td>
                      <Table.Td><Text size="sm" c="dimmed">{req.requestedBy}</Text></Table.Td>
                      <Table.Td>
                        <Badge 
                          color={req.status === "Approved" ? "green" : req.status === "Pending" ? "yellow" : req.status === "Transferred" ? "blue" : "red"} 
                          variant="filled"
                        >
                          {req.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {req.status === "Pending" && currentRole === "admin" && (
                          <Group gap="xs" justify="flex-end">
                            <Tooltip label="Approve Allocation">
                              <ActionIcon variant="light" color="green" size="sm" radius="md" onClick={() => handleApproval(req.id, "Approved")}>
                                <IconCheck size={14} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Reject Allocation">
                              <ActionIcon variant="light" color="red" size="sm" radius="md" onClick={() => handleApproval(req.id, "Rejected")}>
                                <IconX size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        )}
                        {req.status === "Approved" && (
                          <Button size="xs" color="blue" leftSection={<IconTruckDelivery size={12} />} onClick={() => handleInitiateTransfer(req)}>
                            Dispatch Material
                          </Button>
                        )}
                        {req.status === "Transferred" && (
                          <Text size="xs" c="dimmed" fs="italic">Moved to Log Logs</Text>
                        )}
                        {req.status === "Rejected" && <Text size="xs" c="red" fw={500}>Request Denied</Text>}
                        {req.status === "Pending" && currentRole === "site" && (
                          <Text size="xs" c="dimmed">Awaiting Admin Signoff</Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>

          {/* =======================================
              TAB 2: TRANSFERS & RETURNS LOGISTICS 
             ======================================= */}
          <Tabs.Panel value="transfers" pt="md">
            <Stack gap="lg">
              
              {/* SECTION A: MATERIAL DISPATCH ENTRIES */}
              <div>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon color="blue" size="sm" radius="sm"><IconTruckDelivery size={14} /></ThemeIcon>
                    <Text fw={700} size="md">Active Site Material Transfers</Text>
                  </Group>
                  <Badge color="blue" variant="outline">Accountability Dispatch Track</Badge>
                </Group>
                <Table variant="simple" verticalSpacing="xs" withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Transfer Key</Table.Th>
                      <Table.Th>Item Name</Table.Th>
                      <Table.Th>Dispatched Volume</Table.Th>
                      <Table.Th>Destination Node</Table.Th>
                      <Table.Th>Date Dispatched</Table.Th>
                      <Table.Th>Status Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {transfers.map((trn) => (
                      <Table.Tr key={trn.id}>
                        <Table.Td fw={700}><Text size="sm" fw={700}>{trn.id}</Text></Table.Td>
                        <Table.Td><Text size="sm">{trn.item}</Text></Table.Td>
                        <Table.Td><Text size="sm" fw={600}>{trn.qty} {trn.unit}</Text></Table.Td>
                        <Table.Td><Badge color="gray" variant="light">{trn.site}</Badge></Table.Td>
                        <Table.Td><Text size="sm" c="dimmed">{trn.date}</Text></Table.Td>
                        <Table.Td>
                          <Badge color={trn.status === "Delivered" ? "green" : "blue"} variant="light">
                            {trn.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>

              <Divider size="xs" />

              {/* SECTION B: REVERSE LOGISTICS RETURN SETTLEMENTS */}
              <div>
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon color="teal" size="sm" radius="sm"><IconArrowBackUp size={14} /></ThemeIcon>
                    <Text fw={700} size="md">Material Restorations & Site Surplus Returns</Text>
                  </Group>
                  <Button size="xs" variant="light" color="teal" leftSection={<IconPlus size={14} />}>
                    Record Site Return Intake
                  </Button>
                </Group>
                <Table variant="simple" verticalSpacing="xs" withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Return Slip ID</Table.Th>
                      <Table.Th>Item Reclaimed</Table.Th>
                      <Table.Th>Returned Volume</Table.Th>
                      <Table.Th>Originating Source Site</Table.Th>
                      <Table.Th>Date Checked In</Table.Th>
                      <Table.Th>Stock Reconciliation Flag</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {returns.map((ret) => (
                      <Table.Tr key={ret.id}>
                        <Table.Td fw={700}><Text size="sm" fw={700}>{ret.id}</Text></Table.Td>
                        <Table.Td><Text size="sm">{ret.item}</Text></Table.Td>
                        <Table.Td><Text size="sm" fw={600} c="teal">{ret.qty} {ret.unit}</Text></Table.Td>
                        <Table.Td><Badge color="gray" variant="light">{ret.sourceSite}</Badge></Table.Td>
                        <Table.Td><Text size="sm" c="dimmed">{ret.date}</Text></Table.Td>
                        <Table.Td>
                          <Badge color="teal" variant="filled" leftSection={<IconCheck size={10} />}>
                            {ret.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Stack>
          </Tabs.Panel>

          {/* =======================================
              TAB 3: FINANCIAL EXPENSES TRACKING 
             ======================================= */}
          <Tabs.Panel value="expenses" pt="md">
            <Stack gap="md">
              
              {/* TOP FINANCIAL BREAKDOWN DASH SUMMARY CARDS */}
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Card withBorder p="sm" radius="md">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">Aggregated Site Expenditures</Text>
                  <Text size="xl" fw={700} c="red" mt={4}>{formatCurrency(totalExpenses)}</Text>
                  <Progress value={65} color="red" size="xs" mt="sm" radius="md" />
                </Card>
                <Card withBorder p="sm" radius="md">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">Labor vs Surcharges Distribution</Text>
                  <Text size="sm" fw={600} mt={6}>Direct Resource Crews: 70.8%</Text>
                  <Text size="xs" c="dimmed">Logistics / Moving Assets: 29.2%</Text>
                </Card>
                <Card withBorder p="sm" radius="md" style={{ justifyContent: "center" }}>
                  <Button fullWidth size="xs" color="indigo" leftSection={<IconPlus size={14} />} onClick={openExpenseModal}>
                    Log Real-Time Site Expense Entry
                  </Button>
                </Card>
              </SimpleGrid>

              {/* SITE EXPENSE ENTRIES FINANCIAL TABLE */}
              <Table variant="simple" verticalSpacing="xs" withTableBorder mt="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Posting Date</Table.Th>
                    <Table.Th>Category Allocation</Table.Th>
                    <Table.Th>Financial Cost Amount</Table.Th>
                    <Table.Th>Associated Location Scope</Table.Th>
                    <Table.Th>Traceability Documentation Notes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {expenses.map((exp) => (
                    <Table.Tr key={exp.id}>
                      <Table.Td><Text size="sm" fw={500}>{exp.date}</Text></Table.Td>
                      <Table.Td>
                        <Badge 
                          color={exp.category === "Labor" ? "blue" : exp.category === "Transport" ? "orange" : "violet"} 
                          variant="light"
                        >
                          {exp.category}
                        </Badge>
                      </Table.Td>
                      <Table.Td><Text size="sm" fw={700}>{formatCurrency(exp.amount)}</Text></Table.Td>
                      <Table.Td><Text size="xs" c="dimmed">{exp.site}</Text></Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {exp.notes}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* =======================================
          FORM DIALOGS FOR SIMULATING ACTIONS
         ======================================= */}
      
      {/* DIALOG A: MATERIAL ALLOCATION REQUEST MODAL */}
      <Modal opened={requestModalOpened} onClose={closeRequestModal} title="Submit New Site Inventory Allocation Slip" centered radius="md">
        <Stack gap="sm">
          <Select 
            label="Select Material Inventory Line" 
            placeholder="Choose item" 
            data={centralStockData.map(s => s.item)}
            required
          />
          <NumberInput label="Requested Dynamic Volume Quantity" placeholder="Input raw integer units" required min={1} />
          <TextInput label="Site Location Binding Origin" value={currentProject.activeSite} disabled />
          <Textarea label="Justification Notes / Intended Workfront Reference" placeholder="State task assignment context" rows={3} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" size="xs" onClick={closeRequestModal}>Cancel</Button>
            <Button size="xs" color="indigo" onClick={closeRequestModal}>Route into Pipeline</Button>
          </Group>
        </Stack>
      </Modal>

      {/* DIALOG B: ON-SITE DIRECT EXPENDITURE SHEET MODAL */}
      <Modal opened={expenseModalOpened} onClose={closeExpenseModal} title="Record Native Site Operational Expenditure Slip" centered radius="md">
        <Stack gap="sm">
          <Select 
            label="Cost Classification Group" 
            placeholder="Select tracking category" 
            data={["Labor", "Transport", "Material Surcharge", "Equipment Hire", "Misc Charges"]}
            required
          />
          <NumberInput label="Total Cash Ledger Invoice Amount" prefix="$" placeholder="0.00" decimalScale={2} required />
          <TextInput label="Target Project Site Attribution" value={currentProject.activeSite} disabled />
          <Textarea label="Auditable Field Line Item Descriptions" placeholder="Itemize details here" rows={3} required />
          <Group justify="flex-end" mt="md">
            <Button variant="default" size="xs" onClick={closeExpenseModal}>Cancel</Button>
            <Button size="xs" color="indigo" onClick={closeExpenseModal}>Commit Financial Ledger Entry</Button>
          </Group>
        </Stack>
      </Modal>

    </Stack>
  );
}