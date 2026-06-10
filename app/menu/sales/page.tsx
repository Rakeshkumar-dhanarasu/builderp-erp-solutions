"use client";

import React, { useState } from "react";
import { 
  SimpleGrid, 
  Card, 
  Group, 
  Text, 
  Badge, 
  Button, 
  Tabs, 
  Table, 
  Stack, 
  Select, 
  Progress,
  ThemeIcon,
  NumberInput,
  TextInput
} from "@mantine/core";
import { 
  IconEye, 
  IconFileText, 
  IconTrendingUp, 
  IconCreditCard, 
  IconRefresh,
  IconPlus,
  IconBuilding
} from "@tabler/icons-react";

const projectsData = [
  {
    id: "p1",
    clientName: "Alpha Manufacturing Corp",
    budget: { totalCost: 120000, estRevenue: 180000, margin: 33.3 },
    quotation: { value: 185000, status: "Approved", version: "v3" },
    payments: { total: 185000, paid: 120000, pending: 65000 }
  },
  {
    id: "p2",
    clientName: "Omega Logistics Infrastructure",
    budget: { totalCost: 450000, estRevenue: 600000, margin: 25.0 },
    quotation: { value: 620000, status: "Sent", version: "v1" },
    payments: { total: 620000, paid: 200000, pending: 420000 }
  },
  {
    id: "p3",
    clientName: "Apex Retail Developers",
    budget: { totalCost: 85000, estRevenue: 140000, margin: 39.2 },
    quotation: { value: 140000, status: "Draft", version: "v2" },
    payments: { total: 140000, paid: 0, pending: 140000 }
  }
];

export default function SalesPage() {
  const [activeProjectId, setActiveProjectId] = useState<string>("p1");
  const [activeTab, setActiveTab] = useState<string | null>("budget");

  const currentProject = projectsData.find(p => p.id === activeProjectId) || projectsData[0];

  const selectOptions = projectsData.map(p => ({
    value: p.id,
    label: p.clientName
  }));

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <Stack gap="lg" style={{ width: "100%" }}>
      
      {/* HEADER CONTROLLER PANEL */}
      <Card withBorder radius="md" p="sm" shadow="xs">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Stack gap={2}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Current Context Workspace</Text>
            <Text size="md" fw={700} c="indigo" visibleFrom="sm">
              Active Focus: {currentProject.clientName}
            </Text>
          </Stack>
          
          <Select
            placeholder="Select a client/project"
            data={selectOptions}
            value={activeProjectId}
            onChange={(value) => value && setActiveProjectId(value)}
            allowDeselect={false}
            searchable
            nothingFoundMessage="No projects located"
            leftSection={<IconBuilding size={16} stroke={1.5} />}
            style={{ width: "100%", maxWidth: 320 }}
            radius="md"
          />
        </Group>
      </Card>

      {/* QUICK INSIGHTS BOXES */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        
        {/* BOX 1: BUDGET CARDS */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="indigo" variant="light" size="sm"><IconTrendingUp size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Budget Projection</Text>
              </Group>
              <Badge color="indigo" variant="light">{currentProject.budget.margin}% Margin</Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{formatCurrency(currentProject.budget.estRevenue)}</Text>
              <Text size="xs" c="dimmed">Est. Revenue</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>Est. Operating Cost: {formatCurrency(currentProject.budget.totalCost)}</Text>
          </div>
          <Button variant="light" color="indigo" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("budget")}>
            Explore Budget
          </Button>
        </Card>

        {/* BOX 2: QUOTATION CONTAINER */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="orange" variant="light" size="sm"><IconFileText size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Quotation Index</Text>
              </Group>
              <Badge 
                color={currentProject.quotation.status === "Approved" ? "green" : currentProject.quotation.status === "Sent" ? "blue" : "gray"} 
                variant="light"
              >
                {currentProject.quotation.status} ({currentProject.quotation.version})
              </Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{formatCurrency(currentProject.quotation.value)}</Text>
              <Text size="xs" c="dimmed">Gross Offer</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>Lifecycle Stage: Finalized Ledger File</Text>
          </div>
          <Button variant="light" color="orange" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("quotation")}>
            Explore Quotation
          </Button>
        </Card>

        {/* BOX 3: PAYMENTS SUMMARY */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="teal" variant="light" size="sm"><IconCreditCard size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Payments Summary</Text>
              </Group>
              <Badge color="teal" variant="light">
                {currentProject.payments.pending === 0 ? "Settled" : "Outstanding"}
              </Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{formatCurrency(currentProject.payments.paid)}</Text>
              <Text size="xs" c="green" fw={600}>Collected</Text>
            </Group>
            <Progress value={(currentProject.payments.paid / currentProject.payments.total) * 100} color="teal" size="sm" radius="xl" mt="xs" />
          </div>
          <Button variant="light" color="teal" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("payments")}>
            Explore Payments
          </Button>
        </Card>

      </SimpleGrid>

      {/* BOTTOM HALF PANEL */}
      <Card withBorder shadow="sm" radius="md" p="md">
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
          <Tabs.List>
            <Tabs.Tab value="budget">Cost Budgeting</Tabs.Tab>
            <Tabs.Tab value="quotation">Quotation Engine</Tabs.Tab>
            <Tabs.Tab value="workorder">Work Orders</Tabs.Tab>
            <Tabs.Tab value="payments">Financial Collections</Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: BUDGET CONTENT */}
          <Tabs.Panel value="budget" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700} size="md">Operational Cost Estimation Sheets</Text>
                <Button size="xs" leftSection={<IconPlus size={14} />} color="indigo">Add Item Allocation</Button>
              </Group>
              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Line Item Category</Table.Th>
                    <Table.Th>Cost Component Type</Table.Th>
                    <Table.Th>Allocated Base Weight</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Projected Cost</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={500}>Raw Material Elements</Table.Td>
                    <Table.Td><Badge color="gray" variant="light">Direct Material</Badge></Table.Td>
                    <Table.Td>Bulk Structural Grade</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.budget.totalCost * 0.6)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Engineering Labor Allocation</Table.Td>
                    <Table.Td><Badge color="gray" variant="light">Direct Labor</Badge></Table.Td>
                    <Table.Td>Hourly Field Crews</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.budget.totalCost * 0.4)}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>

          {/* TAB 2: QUOTATION ENGINE */}
          <Tabs.Panel value="quotation" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text fw={700} size="md">Quotation Construction Workspace</Text>
                  <Text size="xs" c="dimmed">Active Variant: {currentProject.quotation.version} | Status Check: {currentProject.quotation.status}</Text>
                </Stack>
                <Group gap="sm">
                  <Select 
                    size="xs" 
                    placeholder="Historical Iteration Logs" 
                    data={["v3 (Current Active)", "v2 (Superseded)", "v1 (Archived)"]} 
                    defaultValue="v3 (Current Active)"
                    style={{ width: 180 }}
                  />
                  <Button size="xs" leftSection={<IconRefresh size={14} />} color="orange">Trigger New Revision</Button>
                </Group>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" fw={600} mb="xs">Pricing Calculation Adjustments</Text>
                  <Stack gap="sm">
                    <NumberInput label="Total Target Sales Offer" value={currentProject.quotation.value} prefix="$" decimalScale={2} disabled />
                    <TextInput label="Contract Terms Reference" placeholder="Net 30 Core Milestone Schedule" />
                  </Stack>
                </Card>
                <Card withBorder p="sm" radius="md" style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text size="sm" fw={600} c="dimmed">Quotation Pipeline Flow Information State</Text>
                  <Text size="xs" c="dimmed" style={{ textAlign: "center", maxWidth: 280 }} mt={4}>
                    Revising this blueprint freezes the values in the active version and increments your workspace state to structural build iteration logs.
                  </Text>
                </Card>
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* TAB 3: WORK ORDERS LAYOUT */}
          <Tabs.Panel value="workorder" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700} size="md">Downstream Operations & Execution Work Orders</Text>
                <Badge color="blue" size="lg">Awaiting Engineering Blueprint Push</Badge>
              </Group>
              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>WO Reference</Table.Th>
                    <Table.Th>Operational Scope</Table.Th>
                    <Table.Th>Dispatch Assignment</Table.Th>
                    <Table.Th>Status Flag</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={700}>WO-2026-0041</Table.Td>
                    <Table.Td>Structural Foundations Preparation Assemblies</Table.Td>
                    <Table.Td>Plant Floor Fleet Unit B</Table.Td>
                    <Table.Td><Badge color="yellow" variant="filled">Pending Clear</Badge></Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>

          {/* TAB 4: PAYMENTS COLLECTIONS SUMMARY */}
          <Tabs.Panel value="payments" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700} size="md">Invoicing Balance Ledgers</Text>
                <Text size="sm" fw={600} c="red">Remaining Open Exposure: {formatCurrency(currentProject.payments.pending)}</Text>
              </Group>
              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice System Key</Table.Th>
                    <Table.Th>Issued Milestone</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Total Amount Due</Table.Th>
                    {/* FIXED THE GAP SPACE TYPO IN THE CLOSING TAG BELOW */}
                    <Table.Th style={{ textAlign: "center" }}>Collection Progress Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={600}>INV-99810</Table.Td>
                    <Table.Td>Initial Project Mobilization Advance (Cleared)</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.payments.paid)}</Table.Td>
                    <Table.Td style={{ display: "flex", justifyContent: "center" }}><Badge color="green">Paid & Fully Settled</Badge></Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={600}>INV-99811</Table.Td>
                    <Table.Td>Structural Execution Core Phase Signoff (Open)</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.payments.pending)}</Table.Td>
                    <Table.Td style={{ display: "flex", justifyContent: "center" }}><Badge color="orange" variant="outline">Awaiting Electronic Fund Transfer</Badge></Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Stack>
  );
}