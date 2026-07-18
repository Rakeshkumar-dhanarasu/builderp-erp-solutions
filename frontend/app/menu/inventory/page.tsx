"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Group,
  Text,
  Badge,
  Stack,
  TextInput,
  Tabs,
  Button,
  Table,
  ActionIcon,
  Select,
  Grid,
  SimpleGrid,
  Alert,
  Divider,
  NumberInput,
  Textarea,
  Drawer,
  Modal,
  ThemeIcon,
  Menu,
  ScrollArea,
  Box,
  Progress,
  SegmentedControl
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconBan,
  IconPhone,
  IconMapPin,
  IconFilter,
  IconDotsVertical,
  IconNotes,
  IconArrowsRightLeft,
  IconAlertCircle,
  IconReceipt,
  IconTruckDelivery,
  IconFolder,
  IconLayersIntersect,
  IconScale,
  IconArchive,
  IconDownload,
  IconCalendar,
  IconUsers,
  IconPackage,
  IconChevronRight
} from "@tabler/icons-react";

// ==========================================
// ENTERPRISE PMS INVENTORY MOCK DATA
// ==========================================
const mockGodowns = [
  {
    id: "GDN-01",
    name: "Primary Central Yard - Hub Alpha",
    location: "Chennai Port Zone",
    address: "Gate 4, Sourcing Terminal, Chennai, TN",
    contactPerson: "Rajesh Kannan",
    contactNumber: "+91 98401 23456",
    totalCapacity: 50000,
    usedSpace: 38500,
    capacityUnit: "Sq.ft",
    status: "Active"
  },
  {
    id: "GDN-02",
    name: "Ancillary Storage - Hub Beta",
    location: "Sriperumbudur Industrial Corridor",
    address: "Plot 12B, SIPCOT, Sriperumbudur, TN",
    contactPerson: "Amir Khan",
    contactNumber: "+91 98401 98765",
    totalCapacity: 30000,
    usedSpace: 12000,
    capacityUnit: "Sq.ft",
    status: "Active"
  },
  {
    id: "GDN-03",
    name: "Cold Storage Warehouse - Delta",
    location: "Oragadam Automotive Area",
    address: "Sector 3, Junction Bypass, Oragadam, TN",
    contactPerson: "Deepika Sen",
    contactNumber: "+91 99622 11223",
    totalCapacity: 10000,
    usedSpace: 9500,
    capacityUnit: "Cubic Meter",
    status: "Active"
  }
];

const mockCurrentStock = [
  { itemCode: "ITEM-CEM-53", itemName: "High-Grade Structural Cement (OPC 53)", category: "Cement", type: "Raw Material", unit: "Bags", godown: "Primary Central Yard - Hub Alpha", availableQty: 1200, reservedQty: 300, minStock: 200, maxStock: 5000, status: "Available", lastUpdated: "2026-07-14" },
  { itemCode: "ITEM-STL-08", itemName: "TMT Reinforcement Steel Bars (8mm)", category: "Steel", type: "Raw Material", unit: "Metric Tons", godown: "Primary Central Yard - Hub Alpha", availableQty: 18, reservedQty: 12, minStock: 25, maxStock: 100, status: "Low Stock", lastUpdated: "2026-07-13" },
  { itemCode: "ITEM-ELC-02", itemName: "Heavy-Duty PVC Conduit Pipes 25mm", category: "Electrical", type: "Consumables", unit: "Nos", godown: "Ancillary Storage - Hub Beta", availableQty: 450, reservedQty: 0, minStock: 100, maxStock: 1500, status: "Available", lastUpdated: "2026-07-12" },
  { itemCode: "ITEM-PLM-11", itemName: "Brass Ball Valves (1.5 Inch)", category: "Plumbing", type: "Consumables", unit: "Nos", godown: "Cold Storage Warehouse - Delta", availableQty: 0, reservedQty: 0, minStock: 20, maxStock: 200, status: "Out of Stock", lastUpdated: "2026-07-10" }
];

const mockIncomingStock = [
  { poNumber: "PO-2026-001", vendorName: "Titan ReadyMix & Aggregate", itemName: "High-Strength Structural Concrete (Grade M40)", orderedQty: 300, receivedQty: 180, pendingQty: 120, expectedDate: "2026-07-15", status: "Partially Received" },
  { poNumber: "PO-2026-004", vendorName: "Vulcan Rebar Logistics", itemName: "TMT Reinforcement Steel Bars (12mm)", orderedQty: 50, receivedQty: 0, pendingQty: 50, expectedDate: "2026-07-20", status: "Ordered" },
  { poNumber: "PO-2026-002", vendorName: "Supreme Polymers Ltd", itemName: "Heavy-Duty PVC Conduit Pipes 25mm", orderedQty: 1000, receivedQty: 1000, pendingQty: 0, expectedDate: "2026-07-10", status: "Received" }
];

const mockStockMovement = [
  { txId: "TX-MV-8821", item: "High-Grade Structural Cement (OPC 53)", type: "Stock Transfer", ref: "ST-9001", qty: 250, from: "Primary Central Yard - Hub Alpha", to: "Ancillary Storage - Hub Beta", date: "2026-07-12", createdBy: "S. Raghavan (Store Keeper)" },
  { txId: "TX-RC-3320", item: "Heavy-Duty PVC Conduit Pipes 25mm", type: "Purchase Receipt", ref: "PO-2026-002", qty: 1000, from: "Vendor Sourcing", to: "Ancillary Storage - Hub Beta", date: "2026-07-10", createdBy: "S. Raghavan (Store Keeper)" },
  { txId: "TX-AD-1011", item: "TMT Reinforcement Steel Bars (8mm)", type: "Adjustment", ref: "Audit Discrepancy #3", qty: -2, from: "Primary Central Yard - Hub Alpha", to: "Damaged Scrap Bin", date: "2026-07-09", createdBy: "A. Khan (Auditor)" }
];

const mockCategories = [
  { name: "Cement", description: "All structural and auxiliary cement grades (OPC 43, OPC 53, PPC)", count: 4, status: "Active" },
  { name: "Steel", description: "Reinforcement structures, structural framing angles, beams, and binding wires", count: 8, status: "Active" },
  { name: "Electrical", description: "Conduit wiring, distributions, DB blocks, switches and trunking panels", count: 14, status: "Active" },
  { name: "Plumbing", description: "High-density PVC pipeline tracks, flow control valves, brass unions, joints", count: 11, status: "Active" }
];

const mockTypes = [
  { name: "Raw Material", description: "Base structural components applied directly to core building structures", count: 18, status: "Active" },
  { name: "Consumables", description: "Small structural accessories, fitting couplers, bonding agents, or adhesives", count: 24, status: "Active" },
  { name: "Tool", description: "Deployable hand machinery, dynamic balance gauges, laser aligners", count: 8, status: "Active" },
  { name: "Equipment", description: "Static industrial plant pumps, temporary hoppers, staging power panels", count: 5, status: "Active" }
];

const mockUnits = [
  { name: "Metric Tons", symbol: "MT", description: "Large-scale weight measuring used in steel procurement and aggregate loads", status: "Active" },
  { name: "Bags", symbol: "Bags", description: "Default packaging format representing 50KG dry mass units", status: "Active" },
  { name: "Numbers", symbol: "Nos", description: "Discrete singular entity units mapping layout fixtures, valves, or pipe bundles", status: "Active" },
  { name: "Sq.ft", symbol: "Sq.ft", description: "Area mapping metric for tiles, structural surface sheet claddings", status: "Active" }
];

// ==========================================
// SYSTEM HELPER BADGE STYLES
// ==========================================
function StockStatusBadge({ status }: { status: string }) {
  let color = "gray";
  if (status === "Available" || status === "Received") color = "teal";
  if (status === "Low Stock" || status === "Partially Received") color = "orange";
  if (status === "Out of Stock" || status === "Delayed") color = "red";
  if (status === "Ordered") color = "blue";

  return <Badge size="xs" variant="light" color={color}>{status}</Badge>;
}

export default function InventoryManagementPage() {
  const [activeModuleTab, setActiveModuleTab] = useState<string | null>("godown");
  const [activeMasterTab, setActiveMasterTab] = useState<string>("items");
  const [activeStockSubTab, setActiveStockSubTab] = useState<string>("current");

  // Common Filtering State Coordinates
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>("All");
  const [sortOrder, setSortOrder] = useState<string | null>("None");

  // Client Hydration Buffer Strategy
  const [clientDateStamp, setClientDateStamp] = useState("");
  useEffect(() => {
    setClientDateStamp(new Date().toISOString().split("T")[0]);
  }, []);

  // Disclosure Hooks for Interactive Panels
  const [godownFormOpened, { open: openGodownForm, close: closeGodownForm }] = useDisclosure(false);
  const [transferFormOpened, { open: openTransferForm, close: closeTransferForm }] = useDisclosure(false);
  const [itemFormOpened, { open: openItemForm, close: closeItemForm }] = useDisclosure(false);
  const [inspectDrawerOpened, { open: openInspectDrawer, close: closeInspectDrawer }] = useDisclosure(false);

  // Form State Configurations
  const [selectedGodown, setSelectedGodown] = useState(mockGodowns[0]);
  const [transferFromGodown, setTransferFromGodown] = useState<string | null>(mockGodowns[0].name);
  const [transferToGodown, setTransferToGodown] = useState<string | null>(null);
  const [transferItem, setTransferItem] = useState<string | null>(null);
  const [transferQty, setTransferQty] = useState<number>(0);

  // Derived available quantity limit for selected transfer item
  const selectedStockItemInfo = mockCurrentStock.find(
    s => s.itemName === transferItem && s.godown === transferFromGodown
  );
  const maxAvailableForTransfer = selectedStockItemInfo ? selectedStockItemInfo.availableQty : 0;

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* MODULE HEADER BAR */}
      <Card withBorder radius="md" p="md" bg="var(--mantine-color-body)">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="xl" fw={800} style={{ letterSpacing: "-0.5px" }}>Inventory & Warehousing Hub</Text>
            <Text size="xs" c="dimmed">Track available stock balances, regulate multi-location storage yards, orchestrate cross-dock transfers, and manage core product items.</Text>
          </Stack>
        </Group>
      </Card>

      {/* CORE MODULE INTERNAL TABS */}
      <Tabs value={activeModuleTab} onChange={setActiveModuleTab} color="indigo">
        <Tabs.List>
          <Tabs.Tab value="godown" leftSection={<IconMapPin size={14} />}>1. Godown (Locations)</Tabs.Tab>
          <Tabs.Tab value="stock" leftSection={<IconPackage size={14} />}>2. Stock Management</Tabs.Tab>
          <Tabs.Tab value="item-master" leftSection={<IconArchive size={14} />}>3. Item Master Directory</Tabs.Tab>
        </Tabs.List>

        {/* ========================================================
            TAB 1: GODOWN MANAGEMENT 
            ======================================================== */}
        <Tabs.Panel value="godown" mt="md">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Storage Location Matrices</Text>
                <Button
                  size="xs"
                  color="indigo"
                  leftSection={<IconPlus size={14} />}
                  onClick={openGodownForm}
                >
                  Add Godown
                </Button>
              </Group>

              {/* Filtering Array */}
              <Grid columns={12} gap="sm" align="flex-end">
                <Grid.Col span={{ base: 12, sm: 5 }}>
                  <TextInput
                    placeholder="Search by Godown Name..."
                    size="xs"
                    leftSection={<IconSearch size={14} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Select
                    label="Filter by Location"
                    placeholder="All Regions"
                    size="xs"
                    data={["All", "Chennai Port Zone", "Sriperumbudur Industrial Corridor", "Oragadam Automotive Area"]}
                    value={locationFilter}
                    onChange={setLocationFilter}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Select
                    label="Sort by Space Allocation"
                    placeholder="No Sorting"
                    size="xs"
                    data={["None", "Highest Available Space", "Lowest Available Space"]}
                    value={sortOrder}
                    onChange={setSortOrder}
                  />
                </Grid.Col>
              </Grid>

              {/* Listing Matrix */}
              <Card withBorder p={0} radius="sm" style={{ overflowX: "auto" }}>
                <Table horizontalSpacing="xs" verticalSpacing="xs" highlightOnHover>
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: "11px" }}>Godown Name</Table.Th>
                      <Table.Th style={{ fontSize: "11px" }}>Location Zone</Table.Th>
                      <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Total Capacity</Table.Th>
                      <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Used Space</Table.Th>
                      <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Available Space</Table.Th>
                      <Table.Th style={{ fontSize: "11px", width: "15%" }}>Utilization Progress</Table.Th>
                      <Table.Th style={{ fontSize: "11px" }}>Contact Person</Table.Th>
                      <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Status</Table.Th>
                      <Table.Th style={{ fontSize: "11px", width: 40 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockGodowns
                      .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .filter(g => locationFilter === "All" || g.location === locationFilter)
                      .sort((a, b) => {
                        if (sortOrder === "Highest Available Space") return (b.totalCapacity - b.usedSpace) - (a.totalCapacity - a.usedSpace);
                        if (sortOrder === "Lowest Available Space") return (a.totalCapacity - a.usedSpace) - (b.totalCapacity - b.usedSpace);
                        return 0;
                      })
                      .map((g) => {
                        const avail = g.totalCapacity - g.usedSpace;
                        const percent = Math.round((g.usedSpace / g.totalCapacity) * 100);
                        const isOverloaded = percent > 85;

                        return (
                          <Table.Tr key={g.id}>
                            <Table.Td>
                              <Text size="xs" fw={700}>{g.name}</Text>
                              <Text size="10px" c="dimmed">{g.id}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                <IconMapPin size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs">{g.location}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "right" }}><Text size="xs">{g.totalCapacity.toLocaleString()} {g.capacityUnit}</Text></Table.Td>
                            <Table.Td style={{ textAlign: "right" }}><Text size="xs">{g.usedSpace.toLocaleString()} {g.capacityUnit}</Text></Table.Td>
                            <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={600}>{avail.toLocaleString()} {g.capacityUnit}</Text></Table.Td>
                            <Table.Td>
                              <Stack gap={2}>
                                <Group justify="space-between"><Text size="10px" fw={700}>{percent}%</Text></Group>
                                <Progress value={percent} size="sm" color={isOverloaded ? "red" : percent > 60 ? "orange" : "teal"} animated />
                              </Stack>
                            </Table.Td>
                            <Table.Td>
                              <Text size="xs" fw={600}>{g.contactPerson}</Text>
                              <Text size="10px" c="dimmed">{g.contactNumber}</Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}><Badge size="xs" color="teal">{g.status}</Badge></Table.Td>
                            <Table.Td>
                              <Menu position="bottom-end" shadow="md" width={160}>
                                <Menu.Target>
                                  <ActionIcon variant="subtle" color="gray" size="sm">
                                    <IconDotsVertical size={14} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item leftSection={<IconEye size={14} />} onClick={() => { setSelectedGodown(g); openInspectDrawer(); }}>View Yard Map</Menu.Item>
                                  <Menu.Item leftSection={<IconEdit size={14} />}>Modify Parameters</Menu.Item>
                                  <Menu.Divider />
                                  <Menu.Item leftSection={<IconBan size={14} />} color="red">Deactivate Location</Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </Card>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* ========================================================
            TAB 2: STOCK MANAGEMENT (SUB-TABBED FLOWS)
            ======================================================== */}
        <Tabs.Panel value="stock" mt="md">
          <Stack gap="md">
            <SegmentedControl
              size="xs"
              color="indigo"
              value={activeStockSubTab}
              onChange={setActiveStockSubTab}
              data={[
                { label: "Available Raw Stocks", value: "current" },
                { label: "Incoming Sourcing Pipe (Purchase Link)", value: "incoming" },
                { label: "Yard-to-Yard Transfers", value: "transfer" },
                { label: "Transaction Audit History Logs", value: "history" }
              ]}
            />

            {/* SUB-SECTION 1: CURRENT AVAILABLE STOCK */}
            {activeStockSubTab === "current" && (
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">Live Raw Materials Directory</Text>
                  
                  <Grid columns={12} gap="xs">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        placeholder="Search items by designation index, item specs name..."
                        size="xs"
                        leftSection={<IconSearch size={14} />}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Select
                        placeholder="All Warehouses"
                        size="xs"
                        data={mockGodowns.map(g => g.name)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <Select
                        placeholder="Safety Status"
                        size="xs"
                        data={["All", "Available", "Low Stock", "Out of Stock"]}
                      />
                    </Grid.Col>
                  </Grid>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Item Code</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Specifications Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Category</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Type Code</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Current Storage Godown</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Available Qty</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Reserved Qty</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Stock Status</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Refreshed At</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockCurrentStock.map((s) => (
                        <Table.Tr key={s.itemCode}>
                          <Table.Td><Text size="xs" fw={700}>{s.itemCode}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{s.itemName}</Text></Table.Td>
                          <Table.Td><Text size="xs">{s.category}</Text></Table.Td>
                          <Table.Td><Text size="10px" c="dimmed">{s.type}</Text></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed" lineClamp={1}>{s.godown}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={700}>{s.availableQty} {s.unit}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" c="indigo">{s.reservedQty} {s.unit}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><StockStatusBadge status={s.status} /></Table.Td>
                          <Table.Td><Text size="10px" c="dimmed">{s.lastUpdated}</Text></Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            )}

            {/* SUB-SECTION 2: INCOMING EXPECTED MATERIALS */}
            {activeStockSubTab === "incoming" && (
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Alert color="indigo" icon={<IconTruckDelivery size={16} />} title="Purchase Module Pipeline Integration System">
                    The items documented below reflect active purchase contracts generated inside the Purchase Management ledger. Use this pipeline to receive, verify, and catalog incoming cargo parameters at designated destination yards.
                  </Alert>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Purchase Order Index</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Contractor Sourcing Vendor</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Material Description Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Contracted Qty</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Received Qty</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Remaining Qty</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>ETA Target Date</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Delivery State</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 140 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockIncomingStock.map((inc) => (
                        <Table.Tr key={inc.poNumber}>
                          <Table.Td><Text size="xs" fw={700}>{inc.poNumber}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{inc.vendorName}</Text></Table.Td>
                          <Table.Td><Text size="xs">{inc.itemName}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs">{inc.orderedQty}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" c="teal">{inc.receivedQty}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" c="red" fw={700}>{inc.pendingQty}</Text></Table.Td>
                          <Table.Td><Text size="xs">{inc.expectedDate}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><StockStatusBadge status={inc.status} /></Table.Td>
                          <Table.Td>
                            <Button size="xs" color="indigo" variant="light" fullWidth>
                              Record Receipt
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            )}

            {/* SUB-SECTION 3: STOCK TRANSFER MATRIX */}
            {activeStockSubTab === "transfer" && (
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Yard Transfer Actions</Text>
                    <Button
                      size="xs"
                      color="indigo"
                      leftSection={<IconArrowsRightLeft size={14} />}
                      onClick={openTransferForm}
                    >
                      New Internal Transfer Dispatch
                    </Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Transfer ID</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Material Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Quantity</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Source Sourcing Origin</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Destination Terminal Target</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Transfer Date</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Responsible Operator</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockStockMovement
                        .filter(m => m.type === "Stock Transfer")
                        .map((mov) => (
                          <Table.Tr key={mov.txId}>
                            <Table.Td><Text size="xs" fw={700}>{mov.txId}</Text></Table.Td>
                            <Table.Td><Text size="xs" fw={600}>{mov.item}</Text></Table.Td>
                            <Table.Td><Text size="xs" fw={700} c="indigo">{mov.qty} Units</Text></Table.Td>
                            <Table.Td><Text size="xs">{mov.from}</Text></Table.Td>
                            <Table.Td><Text size="xs">{mov.to}</Text></Table.Td>
                            <Table.Td><Text size="xs">{mov.date}</Text></Table.Td>
                            <Table.Td><Text size="10px" c="dimmed">{mov.createdBy}</Text></Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            )}

            {/* SUB-SECTION 4: COMPREHENSIVE STOCK MOVEMENT HISTORY */}
            {activeStockSubTab === "history" && (
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">System Stock Reconciliation History Trail</Text>
                  
                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Transaction ID</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Operational Material Item</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Transaction Class</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Reference Index Link</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Quantity Mod</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Source Location</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Destination Target</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Timestamp</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Operator</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockStockMovement.map((m) => (
                        <Table.Tr key={m.txId}>
                          <Table.Td><Text size="xs" fw={700}>{m.txId}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{m.item}</Text></Table.Td>
                          <Table.Td>
                            <Badge
                              size="xs"
                              variant="dot"
                              color={m.type === "Stock Transfer" ? "indigo" : m.type === "Purchase Receipt" ? "teal" : "red"}
                            >
                              {m.type}
                            </Badge>
                          </Table.Td>
                          <Table.Td><Text size="10px" style={{ fontFamily: "monospace" }}>{m.ref}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}>
                            <Text size="xs" fw={700} color={m.qty > 0 ? "teal" : "red"}>
                              {m.qty > 0 ? `+${m.qty}` : m.qty}
                            </Text>
                          </Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{m.from}</Text></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{m.to}</Text></Table.Td>
                          <Table.Td><Text size="xs">{m.date}</Text></Table.Td>
                          <Table.Td><Text size="10px" c="dimmed">{m.createdBy}</Text></Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        {/* ========================================================
            TAB 3: ITEM MASTER DIRECTORY
            ======================================================== */}
        <Tabs.Panel value="item-master" mt="md">
          <Tabs value={activeMasterTab} onChange={(val) => val && setActiveMasterTab(val)} color="indigo">
            <Tabs.List>
              <Tabs.Tab value="items" leftSection={<IconPackage size={14} />}>Product Items</Tabs.Tab>
              <Tabs.Tab value="categories" leftSection={<IconFolder size={14} />}>Structural Categories</Tabs.Tab>
              <Tabs.Tab value="types" leftSection={<IconLayersIntersect size={14} />}>Item Types Classification</Tabs.Tab>
              <Tabs.Tab value="units" leftSection={<IconScale size={14} />}>Measurement Units</Tabs.Tab>
            </Tabs.List>

            {/* MASTER DATA SUB-TAB: ITEMS */}
            <Tabs.Panel value="items" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Global Material Catalog Master</Text>
                    <Button
                      size="xs"
                      color="indigo"
                      leftSection={<IconPlus size={14} />}
                      onClick={openItemForm}
                    >
                      Add Master Item
                    </Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Item Code</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Item Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>System Category</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Class Type</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Units</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Min Threshold Level</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Current Consolidated Stock</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Status</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 40 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockCurrentStock.map((itm) => (
                        <Table.Tr key={itm.itemCode}>
                          <Table.Td><Text size="xs" fw={700}>{itm.itemCode}</Text></Table.Td>
                          <Table.Td><Text size="xs" fw={600}>{itm.itemName}</Text></Table.Td>
                          <Table.Td><Text size="xs">{itm.category}</Text></Table.Td>
                          <Table.Td><Text size="10px" c="dimmed">{itm.type}</Text></Table.Td>
                          <Table.Td><Text size="xs">{itm.unit}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" c="orange" fw={600}>{itm.minStock}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={700}>{itm.availableQty}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><Badge size="xs" color="teal">Active</Badge></Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* MASTER DATA SUB-TAB: CATEGORIES */}
            <Tabs.Panel value="categories" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">System Item Categories Mapping</Text>
                    <Button size="xs" color="indigo" leftSection={<IconPlus size={14} />}>Add Category</Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Category Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Functional Scope Description</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Linked Items Count</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Status</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 40 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockCategories.map((cat) => (
                        <Table.Tr key={cat.name}>
                          <Table.Td><Text size="xs" fw={700}>{cat.name}</Text></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{cat.description}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={600}>{cat.count}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><Badge size="xs" color="teal">{cat.status}</Badge></Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* MASTER DATA SUB-TAB: TYPES */}
            <Tabs.Panel value="types" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Dynamic Item Types Index</Text>
                    <Button size="xs" color="indigo" leftSection={<IconPlus size={14} />}>Add Type Classification</Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Type Key</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Classification Sourcing Description</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "right" }}>Mapped Items Count</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Status</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 40 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockTypes.map((t) => (
                        <Table.Tr key={t.name}>
                          <Table.Td><Text size="xs" fw={700}>{t.name}</Text></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{t.description}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}><Text size="xs" fw={600}>{t.count}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><Badge size="xs" color="teal">{t.status}</Badge></Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* MASTER DATA SUB-TAB: MEASUREMENT UNITS */}
            <Tabs.Panel value="units" mt="md">
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Measurement Scale & Standard Units (UOM)</Text>
                    <Button size="xs" color="indigo" leftSection={<IconPlus size={14} />}>Add Unit</Button>
                  </Group>

                  <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: "11px" }}>Unit Label Name</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>Unit Abbreviation Symbol</Table.Th>
                        <Table.Th style={{ fontSize: "11px" }}>UOM Scope Definition</Table.Th>
                        <Table.Th style={{ fontSize: "11px", textAlign: "center" }}>Status</Table.Th>
                        <Table.Th style={{ fontSize: "11px", width: 40 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {mockUnits.map((u) => (
                        <Table.Tr key={u.name}>
                          <Table.Td><Text size="xs" fw={700}>{u.name}</Text></Table.Td>
                          <Table.Td><Badge color="indigo" size="xs">{u.symbol}</Badge></Table.Td>
                          <Table.Td><Text size="xs" c="dimmed">{u.description}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "center" }}><Badge size="xs" color="teal">{u.status}</Badge></Table.Td>
                          <Table.Td>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Stack>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Tabs.Panel>
      </Tabs>

      {/* ========================================================
          MODAL DRAWER LAYERS & CONFIGURATOR FORMS
          ======================================================== */}

      {/* DRAWER 1: INSPECT GODOWN DETAILS & YARD LAYOUT */}
      <Drawer
        opened={inspectDrawerOpened}
        onClose={closeInspectDrawer}
        title={<Text size="md" fw={800}>Godown Storage Topology: {selectedGodown?.name}</Text>}
        position="right"
        size="lg"
      >
        {selectedGodown && (
          <Stack gap="md">
            <Card withBorder radius="sm" p="xs" bg="var(--mantine-color-indigo-light)">
              <SimpleGrid cols={2} spacing="xs">
                <div>
                  <Text size="10px" c="indigo" fw={700}>TRACKING INDEX</Text>
                  <Text size="xs" fw={700}>{selectedGodown.id}</Text>
                </div>
                <div>
                  <Text size="10px" c="indigo" fw={700}>REGIONAL LOCATION ZONE</Text>
                  <Text size="xs" fw={700}>{selectedGodown.location}</Text>
                </div>
              </SimpleGrid>
            </Card>

            <SimpleGrid cols={2} spacing="xs">
              <Card withBorder p="xs">
                <Group justify="space-between" mb={4}>
                  <Text size="10px" c="dimmed">TOTAL PLANNED FOOTPRINT</Text>
                </Group>
                <Text size="md" fw={800}>{selectedGodown.totalCapacity.toLocaleString()} {selectedGodown.capacityUnit}</Text>
              </Card>
              <Card withBorder p="xs">
                <Group justify="space-between" mb={4}>
                  <Text size="10px" c="dimmed">CURRENT AVAILABLE SPACE</Text>
                </Group>
                <Text size="md" fw={800} color="teal">
                  {(selectedGodown.totalCapacity - selectedGodown.usedSpace).toLocaleString()} {selectedGodown.capacityUnit}
                </Text>
              </Card>
            </SimpleGrid>

            <Divider label="Warehouse Floor Plan Allocation" labelPosition="left" />
            <Text size="xs" c="dimmed">Real-time occupancy visualization across dynamic spatial storage lanes:</Text>
            
            <Box p="sm" style={{ background: "var(--mantine-color-default-hover)", borderRadius: "4px" }}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" fw={700}>Zone A - Raw Concrete Bulkhead</Text>
                  <Text size="xs" fw={700}>82% Capacity Occupied</Text>
                </Group>
                <Progress value={82} color="red" size="sm" animated />
              </Stack>
            </Box>

            <Box p="sm" style={{ background: "var(--mantine-color-default-hover)", borderRadius: "4px" }}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" fw={700}>Zone B - Mechanical Component Racks</Text>
                  <Text size="xs" fw={700}>45% Capacity Occupied</Text>
                </Group>
                <Progress value={45} color="teal" size="sm" />
              </Stack>
            </Box>

            <Divider label="Assigned Sourcing Contact Node" labelPosition="left" />
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" size="md">
                  <IconUsers size={16} />
                </ThemeIcon>
                <div>
                  <Text size="xs" fw={700}>{selectedGodown.contactPerson}</Text>
                  <Text size="10px" c="dimmed">{selectedGodown.contactNumber}</Text>
                </div>
              </Group>
              <Button size="xs" variant="light" color="indigo" leftSection={<IconPhone size={12} />}>Call Node</Button>
            </Group>

            <Divider style={{ borderTopStyle: "dashed" }} />
            <Stack gap={4}>
              <Text size="10px" fw={700} c="dimmed" tt="uppercase">Registered Mailing Address</Text>
              <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>
                "{selectedGodown.address}"
              </Text>
            </Stack>
          </Stack>
        )}
      </Drawer>

      {/* DRAWER 2: CREATION FORM FOR NEW GODOWN TARGETS */}
      <Drawer
        opened={godownFormOpened}
        onClose={closeGodownForm}
        title={<Text size="md" fw={800}>Register New Warehouse Location</Text>}
        position="right"
        size="md"
      >
        <Stack gap="md" component="form" onSubmit={(e) => { e.preventDefault(); closeGodownForm(); }}>
          <TextInput label="Godown Tracking Name *" placeholder="e.g., Warehouse Yard Gamma" required />
          <Select
            label="Location Zone Segment *"
            placeholder="Choose geographic region anchor"
            data={["Chennai Port Zone", "Sriperumbudur Industrial Corridor", "Oragadam Automotive Area"]}
            required
          />
          <Textarea label="Registered Sourcing Address" placeholder="Provide complete delivery physical access instructions" rows={3} />
          
          <SimpleGrid cols={2} spacing="sm">
            <TextInput label="Contact Custodian Person" placeholder="e.g., Rajesh Kannan" />
            <TextInput label="Direct Custodian Mobile" placeholder="e.g., +91 98401 23456" />
          </SimpleGrid>

          <Divider label="Capacity Estimations Metrics" labelPosition="left" />
          <SimpleGrid cols={2} spacing="sm">
            <NumberInput label="Total Floor Footprint *" min={100} placeholder="e.g., 25000" required />
            <Select
              label="Standard Unit Metric"
              data={["Sq.ft", "Cubic Meter", "Acres"]}
              defaultValue="Sq.ft"
            />
          </SimpleGrid>

          <Textarea label="Operational Logistics Caveats" placeholder="Input specific gate controls, high-tension lines boundaries, structural height constraints..." rows={2} />

          <Group justify="flex-end" gap="sm" mt="lg">
            <Button variant="outline" color="gray" onClick={closeGodownForm}>Abort Operation</Button>
            <Button color="indigo" type="submit">Commit Storage Node</Button>
          </Group>
        </Stack>
      </Drawer>

      {/* DRAWER 3: INTERACTIVE STOCK TRANSFER MODAL FORM */}
      <Drawer
        opened={transferFormOpened}
        onClose={closeTransferForm}
        title={<Text size="md" fw={800}>Orchestrate Cross-Dock Stock Transfer Pipeline</Text>}
        position="right"
        size="md"
      >
        <Stack gap="md" component="form" onSubmit={(e) => { e.preventDefault(); closeTransferForm(); }}>
          
          <Alert color="orange" icon={<IconAlertCircle size={16} />}>
            Ensure all transfers strictly align with regional custom clearances. The terminal destination yard must possess sufficient available space capacity before dispatch.
          </Alert>

          <Select
            label="Origin Sourcing Godown *"
            placeholder="Select source location"
            data={mockGodowns.map(g => g.name)}
            value={transferFromGodown}
            onChange={(val) => { setTransferFromGodown(val); setTransferItem(null); setTransferQty(0); }}
            required
          />

          <Select
            label="Target Sourcing Terminal Godown *"
            placeholder="Select destination warehouse"
            data={mockGodowns.map(g => g.name).filter(name => name !== transferFromGodown)}
            value={transferToGodown}
            onChange={setTransferToGodown}
            required
          />

          <Select
            label="Select Product Material to Dispatch *"
            placeholder="Choose active inventory item line"
            data={mockCurrentStock
              .filter(s => s.godown === transferFromGodown && s.availableQty > 0)
              .map(s => s.itemName)}
            value={transferItem}
            onChange={(val) => { setTransferItem(val); setTransferQty(0); }}
            disabled={!transferFromGodown}
            required
          />

          {transferItem && (
            <Card withBorder p="xs" bg="var(--mantine-color-indigo-light)">
              <Group justify="space-between">
                <Text size="xs" fw={700}>Physical Sourcing Inventory Available:</Text>
                <Text size="xs" fw={800} color="indigo">{maxAvailableForTransfer} Units in Sourcing Stock</Text>
              </Group>
            </Card>
          )}

          <SimpleGrid cols={2} spacing="sm">
            <NumberInput
              label="Transfer Dispatch Quantity *"
              min={1}
              max={maxAvailableForTransfer}
              value={transferQty}
              onChange={(val) => setTransferQty(typeof val === 'number' ? val : 0)}
              disabled={!transferItem}
              error={transferQty > maxAvailableForTransfer ? `Cannot exceed warehouse limit (${maxAvailableForTransfer})` : undefined}
              required
            />
            <TextInput
              label="Sourcing Dispatch Target Date"
              type="date"
              defaultValue={clientDateStamp}
              required
            />
          </SimpleGrid>

          <Textarea label="Cross-Dock Logistics Transport Notes" placeholder="Input truck registration plate numbers, driver compliance tokens, or dispatch seals..." rows={3} />

          <Group justify="flex-end" gap="sm" mt="lg">
            <Button variant="outline" color="gray" onClick={closeTransferForm}>Cancel Transit</Button>
            <Button
              color="indigo"
              type="submit"
              disabled={transferQty <= 0 || transferQty > maxAvailableForTransfer || !transferToGodown}
            >
              Authorize Material Dispatch
            </Button>
          </Group>
        </Stack>
      </Drawer>

      {/* DRAWER 4: MASTER CATALOG ITEM CREATION FORM */}
      <Drawer
        opened={itemFormOpened}
        onClose={closeItemForm}
        title={<Text size="md" fw={800}>Catalog New Master Product Spec Line</Text>}
        position="right"
        size="md"
      >
        <Stack gap="md" component="form" onSubmit={(e) => { e.preventDefault(); closeItemForm(); }}>
          <TextInput label="Master Item Spec Code (System Managed)" placeholder="ITEM-AUTO-GEN-KEY" disabled />
          
          <TextInput label="Structural Item Specifications Name *" placeholder="e.g., ReadyMix Flowable Mortar Grade-K" required />

          <SimpleGrid cols={2} spacing="sm">
            <Select
              label="Designation Group Category *"
              placeholder="Select category"
              data={mockCategories.map(c => c.name)}
              required
            />
            <Select
              label="Standard Unit Metric (UOM) *"
              placeholder="Select packaging scale"
              data={mockUnits.map(u => u.name)}
              required
            />
          </SimpleGrid>

          <Select
            label="Product Class Type *"
            placeholder="Select class"
            data={mockTypes.map(t => t.name)}
            required
          />

          <Divider label="Risk Assessment & Sourcing Limits" labelPosition="left" />
          <SimpleGrid cols={2} spacing="sm">
            <NumberInput label="Safety Stock Limit (Min Alert Value) *" min={1} placeholder="e.g., 50" required />
            <NumberInput label="Max Floor Storage Allocation Space" min={10} placeholder="e.g., 2000" />
          </SimpleGrid>

          <Textarea label="Logistics Standard Sourcing Requirements" placeholder="Input physical temperature margins, humidity restrictions, hazard ratings, stacking standards..." rows={3} />

          <Group justify="flex-end" gap="sm" mt="lg">
            <Button variant="outline" color="gray" onClick={closeItemForm}>Cancel Draft</Button>
            <Button color="indigo" type="submit">Commit to Item Registry</Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}