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
  TextInput,
  ActionIcon
} from "@mantine/core";
import { 
  IconBuilding, 
  IconTruckDelivery, 
  IconPackage, 
  IconReceipt2, 
  IconPlus, 
  IconEye, 
  IconRefresh,
  IconUserCheck
} from "@tabler/icons-react";

// Mock Data structure keeping consistency with Sales Page architecture
const purchaseProjectsData = [
  {
    id: "p1",
    clientName: "Alpha Manufacturing Corp",
    procurement: { totalPoValue: 45000, activePos: 2, status: "Approved" },
    inventory: { itemsOrdered: 150, itemsReceived: 120, stockLocation: "Central Warehouse" },
    finance: { totalInvoiced: 45000, amountPaid: 30000, outstanding: 15000, subcontractorAllocation: "Delta Drywall Team" }
  },
  {
    id: "p2",
    clientName: "Omega Logistics Infrastructure",
    procurement: { totalPoValue: 185000, activePos: 5, status: "Sent" },
    inventory: { itemsOrdered: 600, itemsReceived: 150, stockLocation: "Direct-to-Site" },
    finance: { totalInvoiced: 185000, amountPaid: 50000, outstanding: 135000, subcontractorAllocation: "Apex Electrical Systems" }
  },
  {
    id: "p3",
    clientName: "Apex Retail Developers",
    procurement: { totalPoValue: 12000, activePos: 1, status: "Draft" },
    inventory: { itemsOrdered: 40, itemsReceived: 0, stockLocation: "Pending Delivery" },
    finance: { totalInvoiced: 12000, amountPaid: 0, outstanding: 12000, subcontractorAllocation: "Unassigned" }
  }
];

export default function PurchasePage() {
  const [activeProjectId, setActiveProjectId] = useState<string>("p1");
  const [activeTab, setActiveTab] = useState<string | null>("procurement");

  const currentProject = purchaseProjectsData.find(p => p.id === activeProjectId) || purchaseProjectsData[0];

  const selectOptions = purchaseProjectsData.map(p => ({
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
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Procurement Workspace Context</Text>
            <Text size="md" fw={700} c="indigo" visibleFrom="sm">
              Active Project: {currentProject.clientName}
            </Text>
          </Stack>
          
          <Select
            placeholder="Select a client/project"
            data={selectOptions}
            value={activeProjectId}
            onChange={(value) => value && setActiveProjectId(value)}
            allowDeselect={false}
            searchable
            nothingFoundMessage="No active projects located"
            leftSection={<IconBuilding size={16} stroke={1.5} />}
            style={{ width: "100%", maxWidth: 320 }}
            radius="md"
          />
        </Group>
      </Card>

      {/* QUICK INSIGHTS BOXES */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        
        {/* BOX 1: PROCUREMENT SUMMARY */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="indigo" variant="light" size="sm"><IconTruckDelivery size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Procurement Orders</Text>
              </Group>
              <Badge color="indigo" variant="light">{currentProject.procurement.activePos} Active POs</Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{formatCurrency(currentProject.procurement.totalPoValue)}</Text>
              <Text size="xs" c="dimmed">Committed Value</Text>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>Latest Status Stage: {currentProject.procurement.status}</Text>
          </div>
          <Button variant="light" color="indigo" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("procurement")}>
            Explore Procurement
          </Button>
        </Card>

        {/* BOX 2: MATERIAL FLOW & STOCK */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="orange" variant="light" size="sm"><IconPackage size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Material Flow Log</Text>
              </Group>
              <Badge color="orange" variant="light">{currentProject.inventory.stockLocation}</Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{currentProject.inventory.itemsReceived} / {currentProject.inventory.itemsOrdered}</Text>
              <Text size="xs" c="dimmed">Units Received</Text>
            </Group>
            <Progress value={(currentProject.inventory.itemsReceived / currentProject.inventory.itemsOrdered) * 100} color="orange" size="sm" radius="xl" mt="xs" />
          </div>
          <Button variant="light" color="orange" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("material")}>
            Explore Stock Flow
          </Button>
        </Card>

        {/* BOX 3: OUTSTANDING LIABILITY & CONTRACTORS */}
        <Card withBorder shadow="xs" radius="md" p="md" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon color="teal" variant="light" size="sm"><IconReceipt2 size={14} /></ThemeIcon>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Vendor & Sub Liabilities</Text>
              </Group>
              <Badge color="teal" variant="light">
                {currentProject.finance.outstanding === 0 ? "No Exposure" : "Open Balance"}
              </Badge>
            </Group>
            <Group align="baseline" gap="xs" mt="sm">
              <Text size="xl" fw={700}>{formatCurrency(currentProject.finance.amountPaid)}</Text>
              <Text size="xs" c="green" fw={600}>Disbursed Funds</Text>
            </Group>
            <Text size="xs" c="red" mt={4}>Pending Payables Exposure: {formatCurrency(currentProject.finance.outstanding)}</Text>
          </div>
          <Button variant="light" color="teal" fullWidth mt="md" size="xs" rightSection={<IconEye size={14} />} onClick={() => setActiveTab("payments")}>
            Explore Financials
          </Button>
        </Card>

      </SimpleGrid>

      {/* BOTTOM HALF PANEL */}
      <Card withBorder shadow="sm" radius="md" p="md">
        <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
          <Tabs.List>
            <Tabs.Tab value="procurement">Procurement & Vendors</Tabs.Tab>
            <Tabs.Tab value="material">Material Flow & Stock</Tabs.Tab>
            <Tabs.Tab value="payments">Payments & Sub-Contractors</Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: PROCUREMENT PLANNING & VENDOR MANAGEMENT */}
          <Tabs.Panel value="procurement" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700} size="md">Project Purchase Order Pipeline & Active Vendors</Text>
                <Group gap="sm">
                  <Button size="xs" leftSection={<IconPlus size={14} />} color="indigo">Onboard Vendor</Button>
                  <Button size="xs" leftSection={<IconPlus size={14} />} color="indigo" variant="outline">Generate PO</Button>
                </Group>
              </Group>
              
              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>PO Reference</Table.Th>
                    <Table.Th>Assigned Vendor</Table.Th>
                    <Table.Th>Procurement Category</Table.Th>
                    <Table.Th>Expected Delivery</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>PO Gross Value</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={700}>PO-2026-081</Table.Td>
                    <Table.Td fw={500}>Matrix Timber Mills</Table.Td>
                    <Table.Td><Badge color="gray" variant="light">Raw Materials</Badge></Table.Td>
                    <Table.Td>June 24, 2026</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.procurement.totalPoValue * 0.7)}</Table.Td>
                    <Table.Td style={{ display: "flex", justifyContent: "center" }}>
                      <Badge color={currentProject.procurement.status === "Approved" ? "green" : "blue"} variant="filled">
                        {currentProject.procurement.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>PO-2026-082</Table.Td>
                    <Table.Td fw={500}>Lumina Architectural Lighting</Table.Td>
                    <Table.Td><Badge color="gray" variant="light">Fixtures & Fittings</Badge></Table.Td>
                    <Table.Td>July 02, 2026</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.procurement.totalPoValue * 0.3)}</Table.Td>
                    <Table.Td style={{ display: "flex", justifyContent: "center" }}><Badge color="gray" variant="light">Draft</Badge></Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Tabs.Panel>

          {/* TAB 2: MATERIAL FLOW & STOCK MANAGEMENT */}
          <Tabs.Panel value="material" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text fw={700} size="md">Chain of Custody Ledger (Traceability Matrix)</Text>
                  <Text size="xs" c="dimmed">Current Routing Pipeline: Vendor → Central Stock → Site Routing</Text>
                </Stack>
                <Group gap="sm">
                  <Button size="xs" leftSection={<IconRefresh size={14} />} color="orange">Initiate Stock Transfer</Button>
                </Group>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" fw={600} mb="xs">Item Quality Verification & Receiving Gate</Text>
                  <Stack gap="sm">
                    <TextInput label="Validate Inbound PO Target" placeholder="Enter PO-2026-081 Line Items" />
                    <Group grow gap="sm">
                      <TextInput label="Qty Dispatched Match" placeholder="Verified count value" />
                      <Select label="QA Status Flag" placeholder="Pass Assessment" data={["Pass", "Conditional Pass", "Rejected"]} />
                    </Group>
                  </Stack>
                </Card>
                
                <Card withBorder p="sm" radius="md">
                  <Text size="sm" fw={600} mb="xs">Current Allocations Across Nodes</Text>
                  <Table variant="simple" verticalSpacing="xs">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Node Location</Table.Th>
                        <Table.Th style={{ textAlign: "right" }}>Stock Share %</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>Central Warehouse Hub</Table.Td>
                        <Table.Td style={{ textAlign: "right" }} fw={600}>65%</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>Active Site Layout Frame</Table.Td>
                        <Table.Td style={{ textAlign: "right" }} fw={600}>35%</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Card>
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* TAB 3: PAYMENTS & SUB-CONTRACTOR MANAGEMENT */}
          <Tabs.Panel value="payments" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700} size="md">Financial Disbursals & Execution Sub-Contracts</Text>
                <Text size="sm" fw={600} c="red">Outstanding Ledger Exposure: {formatCurrency(currentProject.finance.outstanding)}</Text>
              </Group>
              
              <Table variant="simple" verticalSpacing="sm" withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Payee Entity</Table.Th>
                    <Table.Th>Scope Anchor Type</Table.Th>
                    <Table.Th>Milestone Cleared</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Disbursed</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Remaining Balance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={700}>Matrix Timber Mills</Table.Td>
                    <Table.Td><Badge color="indigo" variant="light">Vendor (PO)</Badge></Table.Td>
                    <Table.Td>Advance Mobilization (Paid)</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.finance.amountPaid * 0.6)}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.finance.outstanding * 0.5)}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={700}>{currentProject.finance.subcontractorAllocation}</Table.Td>
                    <Table.Td><Badge color="teal" variant="light">Subcontractor</Badge></Table.Td>
                    <Table.Td>Structural Framework Layout Signoff</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.finance.amountPaid * 0.4)}</Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>{formatCurrency(currentProject.finance.outstanding * 0.5)}</Table.Td>
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