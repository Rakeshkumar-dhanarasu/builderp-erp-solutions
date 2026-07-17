"use client";

import React, { useState } from "react";
import {
  Card,
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
  Pagination,
  Menu,
  ThemeIcon,
  Timeline,
  ScrollArea,
  Box
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
  IconMail,
  IconMapPin,
  IconFilter,
  IconDotsVertical,
  IconNotes,
  IconCurrencyDollar,
  IconAlertCircle,
  IconReceipt,
  IconTruckDelivery,
  IconCreditCard,
  IconFileText,
  IconCone2,
  IconCopy,
  IconDownload,
  IconCalendar,
  IconClipboardCheck
} from "@tabler/icons-react";

// ==========================================
// UNIFIED ENTERPRISE PMS PURCHASE DATA MOCK
// ==========================================
const mockPurchaseOrders = [
  {
    id: "PO-2026-001",
    type: "Vendor Material Order",
    partyName: "Titan ReadyMix & Aggregate",
    project: "Metropolis Highrise Tower A",
    orderDate: "2026-07-01",
    expectedDate: "2026-07-15",
    totalAmount: 45000.00,
    status: "Ordered",
    items: [
      { id: 1, name: "High-Strength Structural Concrete (Grade M40)", category: "Raw Materials", qty: 300, unit: "m³", rate: 120, tax: 15, amount: 41400 },
      { id: 2, name: "Admixture Plasticizer additive", category: "Chemicals", qty: 40, unit: "Liters", rate: 75, tax: 20, amount: 3600 }
    ],
    paymentTerms: "Net 45 upon delivery",
    deliveryTerms: "FOB Site Location Yard 3",
    discount: 500,
    taxTotal: 6900,
    notes: "Requires slump test verification report with every dispatch vehicle transit token."
  },
  {
    id: "WO-2026-002",
    type: "Sub-contractor Service Order",
    partyName: "Apex Mechanical & HVAC Systems",
    project: "Nexus Industrial Logistics Hub",
    orderDate: "2026-06-25",
    expectedDate: "2026-08-30",
    totalAmount: 125000.00,
    status: "Work Started",
    services: [
      { id: 1, desc: "Industrial Chiller Plant Structural Laying", scope: "Rigging, position lock down, and baseline alignment configuration", qtyUnit: "1 Job", rate: 45000, amount: 45000 },
      { id: 2, desc: "Cleanroom Galvanized Ductwork Run Routing", scope: "Installation of 1200 sq meters high-seal duct pathways", qtyUnit: "1200 m²", rate: 66.66, amount: 80000 }
    ],
    contractAmount: 125000,
    paymentTerms: "Milestone-Based Progress",
    advancePayment: 25000,
    milestones: "20% Mobilization (Paid), 40% First Fix Routing, 40% System Commissioning Approval",
    notes: "Requires dynamic balance air performance certification records before milestone signoff."
  }
];

const mockVendorPayments = [
  { id: "VPMT-8801", vendorName: "Titan ReadyMix & Aggregate", poNumber: "PO-2026-001", orderAmount: 45000, paidAmount: 15000, dueAmount: 30000, paymentDate: "2026-07-05", status: "Partially Paid" },
  { id: "VPMT-8802", vendorName: "Vulcan Rebar Logistics", poNumber: "PO-2026-014", orderAmount: 18500, paidAmount: 18500, dueAmount: 0, paymentDate: "2026-06-20", status: "Settled" }
];

const mockSubPayments = [
  { id: "SPMT-9901", subName: "Apex Mechanical & HVAC Systems", woNumber: "WO-2026-002", project: "Nexus Industrial Logistics Hub", contractAmount: 125000, paidAmount: 25000, dueAmount: 100000, paymentDate: "2026-06-26", status: "Advance Cleared" }
];

const mockReceipts = [
  { id: "RCP-4491", partyName: "Titan ReadyMix & Aggregate", type: "Vendor", referenceOrder: "PO-2026-001", amount: 15000, paymentDate: "2026-07-05", mode: "NEFT Bank Wire", createdBy: "S. Raghavan (Procurement Manager)" },
  { id: "RCP-4492", partyName: "Apex Mechanical & HVAC Systems", type: "Sub-contractor", referenceOrder: "WO-2026-002", amount: 25000, paymentDate: "2026-06-26", mode: "RTGS Liquidity Transfer", createdBy: "S. Raghavan (Procurement Manager)" }
];

// ==========================================
// REUSABLE SUB-SYSTEM VIEW ALIGNMENT BADGES
// ==========================================
function OrderStatusBadge({ status }: { status: string }) {
  let color = "gray";
  if (["Approved", "Delivered", "Settled"].includes(status)) color = "teal";
  if (["Ordered", "Work Started", "Partially Paid"].includes(status)) color = "indigo";
  if (["Submitted", "Advance Cleared"].includes(status)) color = "blue";
  if (["Draft"].includes(status)) color = "yellow";
  if (["Cancel Order", "Payment Pending"].includes(status)) color = "orange";

  return <Badge size="xs" variant="light" color={color}>{status}</Badge>;
}

export default function PurchaseManagementPage() {
  const [activeModuleTab, setActiveModuleTab] = useState<string | null>("po");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("All");
  const [statusFilter, setStatusFilter] = useState<string | null>("All");

  // Flow State Tracking Hooks
  const [selectedPoId, setSelectedPoId] = useState<string>("PO-2026-001");
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [formDrawerOpened, { open: openFormDrawer, close: closeFormDrawer }] = useDisclosure(false);
  const [cancelModalOpened, { open: openCancelModal, close: closeCancelModal }] = useDisclosure(false);

  // Editable Form Structural Array States
  const [formOrderType, setFormOrderType] = useState<string>("Vendor Material Order");
  const [materialItems, setMaterialItems] = useState([
    { id: 1, name: "", category: "Raw Materials", qty: 1, unit: "Pcs", rate: 0, tax: 18, amount: 0 }
  ]);
  const [serviceItems, setServiceItems] = useState([
    { id: 1, desc: "", scope: "", qtyUnit: "1 Job", rate: 0, amount: 0 }
  ]);
  
  // Safe Client-Only Date Hydration Buffer
  const [currentFormDate, setCurrentFormDate] = useState("");
  
  React.useEffect(() => {
    // Synchronize current client date parameters safely past SSR engines
    setCurrentFormDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Target Selected State Reference Pointer Pipelining
  const currentPoFocus = mockPurchaseOrders.find(p => p.id === selectedPoId) || mockPurchaseOrders[0];

  const handleAddMaterialItem = () => {
    setMaterialItems([...materialItems, { id: materialItems.length + 1, name: "", category: "Raw Materials", qty: 1, unit: "Pcs", rate: 0, tax: 18, amount: 0 }]);
  };

  const handleAddServiceItem = () => {
    setServiceItems([...serviceItems, { id: serviceItems.length + 1, desc: "", scope: "", qtyUnit: "1 Job", rate: 0, amount: 0 }]);
  };

  return (
    <Stack gap="md" style={{ width: "100%" }}>
      {/* COMPONENT BANNER CONTROL CARD */}
      <Card withBorder radius="md" p="md" bg="var(--mantine-color-body)">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="xl" fw={800} style={{ letterSpacing: "-0.5px" }}>Purchase Ledger Architecture</Text>
            <Text size="xs" c="dimmed">Coordinate capital-intensive materials acquisition procurement workflows and control active vendor engineering service lines.</Text>
          </Stack>
          <Button
            size="sm"
            color="indigo"
            leftSection={<IconPlus size={16} />}
            onClick={openFormDrawer}
          >
            Create Purchase Order
          </Button>
        </Group>
      </Card>

      {/* WORKFLOW SPLIT REVENUE NAVIGATION TAB CONTROLLERS */}
      <Tabs value={activeModuleTab} onChange={setActiveModuleTab} color="indigo">
        <Tabs.List>
          <Tabs.Tab value="po" leftSection={<IconFileText size={14} />}>1. Purchase Orders</Tabs.Tab>
          <Tabs.Tab value="tracking" leftSection={<IconTruckDelivery size={14} />}>2. Order Tracking Matrix</Tabs.Tab>
          <Tabs.Tab value="vendor-pay" leftSection={<IconCreditCard size={14} />}>3. Vendor Payments</Tabs.Tab>
          <Tabs.Tab value="sub-pay" leftSection={<IconCone2 size={14} />}>4. Sub-contractor Payments</Tabs.Tab>
          <Tabs.Tab value="receipts" leftSection={<IconReceipt size={14} />}>5. Payment Receipts Logs</Tabs.Tab>
        </Tabs.List>

        {/* TAB 1 & 2 ROUTING CONTEXT (PURCHASE ORDERS & DISPATCH LOOKUP TRACKING) */}
        <Tabs.Panel value="po" mt="md">
          <Grid columns={12} gap="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Procurement Master Registry</Text>
                    <Group gap="xs">
                      <Select
                        size="xs"
                        placeholder="Order Domain Filter"
                        data={["All", "Vendor Material Order", "Sub-contractor Service Order"]}
                        value={typeFilter}
                        onChange={setTypeFilter}
                        style={{ width: 170 }}
                      />
                      <Select
                        size="xs"
                        placeholder="Status Filter"
                        data={["All", "Draft", "Submitted", "Ordered", "Work Started", "Delivered"]}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 130 }}
                      />
                    </Group>
                  </Group>

                  <TextInput
                    placeholder="Filter records via PO index, vendor title alignment, target engineering deployment site..."
                    size="xs"
                    leftSection={<IconSearch size={14} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  />

                  <Card withBorder p={0} radius="sm" style={{ overflowX: "auto" }}>
                    <Table horizontalSpacing="xs" verticalSpacing="xs" highlightOnHover>
                      <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                        <Table.Tr>
                          <Table.Th style={{ fontSize: '11px' }}>Order Index</Table.Th>
                          <Table.Th style={{ fontSize: '11px' }}>Domain Class</Table.Th>
                          <Table.Th style={{ fontSize: '11px' }}>Target Counterparty</Table.Th>
                          <Table.Th style={{ fontSize: '11px' }}>Deployment Project</Table.Th>
                          <Table.Th style={{ fontSize: '11px', textAlign: 'right' }}>Financial Volume</Table.Th>
                          <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>State</Table.Th>
                          <Table.Th style={{ fontSize: '11px', width: 40 }}></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {mockPurchaseOrders.map((po) => (
                          <Table.Tr
                            key={po.id}
                            style={{
                              cursor: "pointer",
                              backgroundColor: po.id === selectedPoId ? "var(--mantine-color-indigo-light)" : "transparent"
                            }}
                            onClick={() => setSelectedPoId(po.id)}
                          >
                            <Table.Td><Text size="xs" fw={700}>{po.id}</Text></Table.Td>
                            <Table.Td>
                              <Text size="10px" fw={500} c={po.type.includes("Material") ? "blue" : "orange"}>
                                {po.type}
                              </Text>
                            </Table.Td>
                            <Table.Td><Text size="xs" fw={600}>{po.partyName}</Text></Table.Td>
                            <Table.Td><Text size="xs" c="dimmed">{po.project}</Text></Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}>
                              <Text size="xs" fw={700}>${po.totalAmount.toLocaleString('en-US')}</Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={po.status} /></Table.Td>
                            <Table.Td onClick={(e) => e.stopPropagation()}>
                              <Menu position="bottom-end" shadow="md" width={160}>
                                <Menu.Target>
                                  <ActionIcon variant="subtle" color="gray" size="sm">
                                    <IconDotsVertical size={14} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item leftSection={<IconEye size={14} />} onClick={openDrawer}>Inspect Deep Details</Menu.Item>
                                  <Menu.Item leftSection={<IconCopy size={14} />}>Duplicate Blueprint</Menu.Item>
                                  <Menu.Item leftSection={<IconDownload size={14} />}>Download PDF Contract</Menu.Item>
                                  <Menu.Divider />
                                  <Menu.Item leftSection={<IconBan size={14} />} color="red" onClick={openCancelModal}>Void Order</Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Card>
                  <Group justify="space-between" mt="xs">
                    <Text size="11px" c="dimmed">Displaying baseline system transactional values matching engine schema memory bounds</Text>
                    <Pagination total={1} size="xs" color="indigo" radius="sm" />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            {/* QUICK PREVIEW SIDEBAR */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              {currentPoFocus ? (
                <Stack gap="sm">
                  <Card withBorder radius="md" p="sm" bg="var(--mantine-color-indigo-light)" style={{ borderLeft: "4px solid var(--mantine-color-indigo-filled)" }}>
                    <Stack gap={2}>
                      <Text size="10px" fw={700} c="indigo" tt="uppercase">Live Track Inspect Framework</Text>
                      <Text size="sm" fw={800} c="indigo">{currentPoFocus.id}</Text>
                      <Text size="xs" fw={500} c="dimmed">{currentPoFocus.partyName}</Text>
                    </Stack>
                  </Card>

                  <Card withBorder radius="md" p="sm">
                    <Stack gap="xs">
                      <Text size="10px" fw={700} c="dimmed" tt="uppercase">Itemized Ledger Allocation Line</Text>
                      <ScrollArea style={{ height: 140 }}>
                        <Stack gap={6}>
                          {currentPoFocus.items?.map((item) => (
                            <Box key={item.id} p="xs" style={{ background: "var(--mantine-color-default-hover)", borderRadius: "4px" }}>
                              <Group justify="space-between">
                                <Text size="xs" fw={700} style={{ maxWidth: "70%" }} truncate>{item.name}</Text>
                                <Text size="xs" fw={600}>${item.amount.toLocaleString()}</Text>
                              </Group>
                              <Text size="10px" c="dimmed">{item.qty} {item.unit} @ ${item.rate}/{item.unit}</Text>
                            </Box>
                          ))}
                          {currentPoFocus.services?.map((svc) => (
                            <Box key={svc.id} p="xs" style={{ background: "var(--mantine-color-default-hover)", borderRadius: "4px" }}>
                              <Group justify="space-between">
                                <Text size="xs" fw={700} style={{ maxWidth: "70%" }} truncate>{svc.desc}</Text>
                                <Text size="xs" fw={600}>${svc.amount.toLocaleString()}</Text>
                              </Group>
                              <Text size="10px" c="dimmed" lineClamp={1}>{svc.scope}</Text>
                            </Box>
                          ))}
                        </Stack>
                      </ScrollArea>

                      <Divider style={{ borderTopStyle: "dashed" }} />

                      <SimpleGrid cols={2} spacing="sm">
                        <TextInput 
                          label="System Document Valuation Timestamp Date" 
                          type="date" 
                          value={currentFormDate} 
                          onChange={(e) => setCurrentFormDate(e.currentTarget.value)} 
                          required 
                        />
                        <TextInput 
                          label={formOrderType.includes("Material") ? "Target Material Dispatch Arrival Window Date" : "Contractual Service Completion Deadline Date"} 
                          type="date" 
                          required 
                        />
                      </SimpleGrid>

                      {currentPoFocus.notes && (
                        <>
                          <Divider style={{ borderTopStyle: "dashed" }} />
                          <Stack gap={4}>
                            <Group gap={4}>
                              <IconNotes size={12} color="var(--mantine-color-dimmed)" />
                              <Text size="10px" fw={700} c="dimmed" tt="uppercase">Stipulated Caveats</Text>
                            </Group>
                            <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>"{currentPoFocus.notes}"</Text>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </Card>
                </Stack>
              ) : (
                <Alert color="indigo" title="Transactional Analyzer Panel">
                  Highlight any live ledger matrix position row sequence item to load real-time database cache arrays inside this viewport.
                </Alert>
              )}
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* TAB 2: ORDER TRACKING MATRIX CONTROLS */}
        <Tabs.Panel value="tracking" mt="md">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Dynamic Multi-Tier Pipeline Tracking Matrix</Text>
              <Table horizontalSpacing="xs" verticalSpacing="xs" withTableBorder>
                <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                  <Table.Tr>
                    <Table.Th style={{ fontSize: '11px' }}>Order Key</Table.Th>
                    <Table.Th style={{ fontSize: '11px' }}>Domain Type</Table.Th>
                    <Table.Th style={{ fontSize: '11px' }}>Entity Partner</Table.Th>
                    <Table.Th style={{ fontSize: '11px' }}>Operational Scope Target Description</Table.Th>
                    <Table.Th style={{ fontSize: '11px' }}>Order Date</Table.Th>
                    <Table.Th style={{ fontSize: '11px' }}>Financial Metric</Table.Th>
                    <Table.Th style={{ fontSize: '11px', textAlign: 'center' }}>Dynamic State Track Position</Table.Th>
                    <Table.Th style={{ fontSize: '11px', width: 100 }}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockPurchaseOrders.map((po) => (
                    <Table.Tr key={po.id}>
                      <Table.Td><Text size="xs" fw={700}>{po.id}</Text></Table.Td>
                      <Table.Td><Badge variant="outline" size="xs" color={po.type.includes("Material") ? "blue" : "orange"}>{po.type}</Badge></Table.Td>
                      <Table.Td><Text size="xs" fw={600}>{po.partyName}</Text></Table.Td>
                      <Table.Td>
                        <Text size="xs" truncate style={{ maxWidth: 220 }}>
                          {po.type.includes("Material") ? po.items?.[0]?.name : po.services?.[0]?.desc}
                        </Text>
                      </Table.Td>
                      <Table.Td><Text size="xs">{po.orderDate}</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={700}>${po.totalAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={po.status} /></Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="center">
                          <Button size="10px" variant="light" color="indigo"  onClick={() => { setSelectedPoId(po.id); openDrawer(); }}>
                            View Timeline
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* TAB 3: VENDOR PAYMENTS OUTBOUND CONTROL */}
        <Tabs.Panel value="vendor-pay" mt="md">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Vendor Capital Outflows Ledger</Text>
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
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs">${v.orderAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="teal" fw={600}>${v.paidAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="red" fw={600}>${v.dueAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td><Text size="xs">{v.paymentDate}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={v.status} /></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* TAB 4: SUB-CONTRACTOR PROGRESS ENGINEERING DISBURSEMENTS */}
        <Tabs.Panel value="sub-pay" mt="md">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Trade Contract Sub-Contractor Valuation Matrix</Text>
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
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs">${s.contractAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="teal" fw={600}>${s.paidAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs" c="red" fw={600}>${s.dueAmount.toLocaleString()}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}><OrderStatusBadge status={s.status} /></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* TAB 5: AUDIT LOG TRANSACTION PAYMENT RECEIPTS RECORDINGS */}
        <Tabs.Panel value="receipts" mt="md">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Immutable Central Cash Book Receipts Register</Text>
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
                        <Badge size="xs" variant="dot" color={r.type === "Vendor" ? "blue" : "orange"}>{r.type}</Badge>
                      </Table.Td>
                      <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{r.referenceOrder}</Text></Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={700} c="teal">${r.amount.toLocaleString()}</Text></Table.Td>
                      <Table.Td><Text size="xs">{r.paymentDate}</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={500}>{r.mode}</Text></Table.Td>
                      <Table.Td><Text size="10px" c="dimmed">{r.createdBy}</Text></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* DRAWER LAYER ONE: VIEW DETAIL INVENTORY EXPANSION PANEL */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={<Text size="md" fw={800}>Inspect Contract Node Summary: {currentPoFocus?.id}</Text>}
        position="right"
        size="xl"
      >
        {currentPoFocus && (
          <Stack gap="md">
            <Card withBorder radius="sm" p="xs" bg="var(--mantine-color-default-hover)">
              <SimpleGrid cols={2} spacing="xs">
                <div>
                  <Text size="10px" c="dimmed">COUNTERPARTY BINDING TARGET</Text>
                  <Text size="xs" fw={700}>{currentPoFocus.partyName}</Text>
                </div>
                <div>
                  <Text size="10px" c="dimmed">PROJECT ALLOCATION HUB</Text>
                  <Text size="xs" fw={700}>{currentPoFocus.project}</Text>
                </div>
              </SimpleGrid>
            </Card>

            <Divider label="Itemized Specifications Matrix Breakdown" labelPosition="left" />
            
            <Table withTableBorder horizontalSpacing="xs" verticalSpacing="xs">
              <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                <Table.Tr>
                  <Table.Th style={{ fontSize: '10px' }}>Description Element</Table.Th>
                  <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Quantities/Metrics</Table.Th>
                  <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Base Pricing Matrix</Table.Th>
                  <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Line Totals Volume</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentPoFocus.items?.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text size="xs" fw={600}>{item.name}</Text>
                      <Text size="10px" c="dimmed">{item.category}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs">{item.qty} {item.unit}</Text></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs">${item.rate}</Text></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600}>${item.amount.toLocaleString()}</Text></Table.Td>
                  </Table.Tr>
                ))}
                {currentPoFocus.services?.map((svc) => (
                  <Table.Tr key={svc.id}>
                    <Table.Td>
                      <Text size="xs" fw={600}>{svc.desc}</Text>
                      <Text size="10px" c="dimmed" lineClamp={1}>{svc.scope}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs">{svc.qtyUnit}</Text></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs">${svc.rate}</Text></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}><Text size="xs" fw={600}>${svc.amount.toLocaleString()}</Text></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Card withBorder p="sm" radius="xs">
              <Stack gap={6}>
                <Group justify="space-between"><Text size="xs" c="dimmed">Subtotal Engineering Cost:</Text><Text size="xs" fw={600}>${currentPoFocus.totalAmount.toLocaleString()}</Text></Group>
                <Group justify="space-between"><Text size="xs" c="dimmed">Stipulated Insurance / Tax Allocation:</Text><Text size="xs" fw={600}>Included</Text></Group>
                <Divider style={{ borderTopStyle: "dashed" }} />
                <Group justify="space-between"><Text size="sm" fw={800}>Aggregate Final Commercial Binding Volume:</Text><Text size="sm" fw={800} color="indigo">${currentPoFocus.totalAmount.toLocaleString()}</Text></Group>
              </Stack>
            </Card>

            <Divider label="Audit Trail Fulfillment Timeline Nodes" labelPosition="left" />
            <Timeline active={2} bulletSize={24} lineWidth={2} color="indigo" radius="md" p="xs">
              <Timeline.Item bullet={<IconFileText size={12} />} title="Contract Framework Blueprint Created">
                <Text size="11px" c="dimmed">Purchase requisition workflow configured and signed off by project planner node.</Text>
                <Text size="10px" c="dimmed" mt={2}>Date Trace: {currentPoFocus.orderDate}</Text>
              </Timeline.Item>
              <Timeline.Item bullet={<IconClipboardCheck size={12} />} title="Manager Financial Authorization Node Passed">
                <Text size="11px" c="dimmed">Liquidity allocation checks confirmed. Approved tracking footprint pushed live into registry cache mapping arrays.</Text>
              </Timeline.Item>
              <Timeline.Item bullet={<IconTruckDelivery size={12} />} title="Transit Fulfillment Framework Ongoing">
                <Text size="11px" c="dimmed">Dispatched components out for field delivery route or active service engineers reporting status metrics live.</Text>
                <Text size="10px" c="indigo" fw={600} mt={2}>Expected Terminal Convergence Window Target: {currentPoFocus.expectedDate}</Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
        )}
      </Drawer>

      {/* DRAWER LAYER TWO: INTERACTIVE WORKFLOW BUILD FULL ENTRY CREATION DRAWER FORM */}
      <Drawer
        opened={formDrawerOpened}
        onClose={closeFormDrawer}
        title={<Text size="md" fw={800}>Configure New Operational Purchase Order Mapping Architecture</Text>}
        position="right"
        size="100%"
      >
        <Stack gap="md" component="form" onSubmit={(e) => { e.preventDefault(); closeFormDrawer(); }} style={{ maxWidth: 900, margin: "0 auto" }}>
          
          <Select
            label="Transaction Pipeline Domain Selection *"
            description="Dynamically restructures fields, calculations, tax bounds, and tracking algorithms downstream"
            data={["Vendor Material Order", "Sub-contractor Service Order"]}
            value={formOrderType}
            onChange={(val) => val && setFormOrderType(val)}
            required
          />

          <Divider label="Section 1: Baseline Structural Fields Mapping Alignment" labelPosition="left" />
          <SimpleGrid cols={3} spacing="sm">
            <TextInput label="Order Tracking Number Identifier" placeholder="PO-AUTO-GENERATED-KEY" disabled />
            <Select 
              label={formOrderType.includes("Material") ? "Target Vendor Supply Entity *" : "Contracted Sub-contractor Firm *"}
              placeholder="Select structural enterprise counterparty account"
              data={["Titan ReadyMix & Aggregate", "Apex Mechanical & HVAC Systems", "Vulcan Rebar Logistics", "Northwest Steel Structures"]}
              required
            />
            <Select 
              label="Associated Real Estate PMS Project Grid Element *"
              placeholder="Map cost tracking index"
              data={["Metropolis Highrise Tower A", "Nexus Industrial Logistics Hub", "Downtown Commercial Plaza Phase II"]}
              required
            />
          </SimpleGrid>

          <SimpleGrid cols={2} spacing="sm">
            <TextInput label="System Document Valuation Timestamp Date" type="date" defaultValue="2026-07-13" required />
            <TextInput label={formOrderType.includes("Material") ? "Target Material Dispatch Arrival Window Date" : "Contractual Service Completion Deadline Date"} type="date" required />
          </SimpleGrid>

          {/* DYNAMIC FORM MATRIX ELEMENT BLOCK ONE: MATERIALS ACQUISITIONS SECTION */}
          {formOrderType === "Vendor Material Order" ? (
            <>
              <Group justify="space-between" mt="sm">
                <Text size="xs" fw={800} tt="uppercase" c="dimmed">Material Specifications Bill of Quantities (BOQ)</Text>
                <Button size="10px" variant="outline" color="indigo" leftSection={<IconPlus size={10} />} onClick={handleAddMaterialItem}>
                  Add Material Row Target
                </Button>
              </Group>

              <Card withBorder p={0} radius="xs">
                <Table horizontalSpacing="xs" verticalSpacing="xs">
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '10px', width: "35%" }}>Item Technical Name *</Table.Th>
                      <Table.Th style={{ fontSize: '10px', width: "20%" }}>Category Class</Table.Th>
                      <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Quantity Unit</Table.Th>
                      <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Base Unit Rate ($)</Table.Th>
                      <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Tax Limit (%)</Table.Th>
                      <Table.Th style={{ fontSize: '10px', width: 40 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {materialItems.map((item, idx) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <TextInput placeholder="e.g., Cement Bags Grade 53" size="xs" required />
                        </Table.Td>
                        <Table.Td>
                          <Select data={["Raw Materials", "Chemicals", "Structural Steel", "Electrical Conduit Fittings"]} defaultValue="Raw Materials" size="xs" />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <NumberInput size="xs" min={1} defaultValue={1} style={{ width: 80, marginLeft: 'auto' }} />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <NumberInput size="xs" min={0} prefix="$ " defaultValue={0} style={{ width: 100, marginLeft: 'auto' }} />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Select data={["5", "12", "15", "18", "20"]} defaultValue="18" size="xs" style={{ width: 70, marginLeft: 'auto' }} />
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon variant="subtle" color="red" onClick={() => setMaterialItems(materialItems.filter(i => i.id !== item.id))} disabled={materialItems.length === 1}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

              <Divider label="Commercial Terms & Logistics Binding Clauses" labelPosition="left" mt="sm" />
              <SimpleGrid cols={2} spacing="sm">
                <TextInput label="Corporate Payment Terms Mapping" placeholder="e.g., Net 45 days validation window" />
                <TextInput label="Delivery Sourcing Logistics Terms" placeholder="e.g., CIF Jobsite crane landing platform" />
              </SimpleGrid>
            </>
          ) : (
            /* DYNAMIC FORM MATRIX ELEMENT BLOCK TWO: ENGINEERING SERVICE SUBCONTRACTING LINES */
            <>
              <Group justify="space-between" mt="sm">
                <Text size="xs" fw={800} tt="uppercase" c="dimmed">Engineering Statement of Work (SOW) Scope Items</Text>
                <Button size="10px" variant="outline" color="orange" leftSection={<IconPlus size={10} />} onClick={handleAddServiceItem}>
                  Add Service Scope Row Target
                </Button>
              </Group>

              <Card withBorder p={0} radius="xs">
                <Table horizontalSpacing="xs" verticalSpacing="xs">
                  <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '10px', width: "35%" }}>Service Element Heading Title *</Table.Th>
                      <Table.Th style={{ fontSize: '10px', width: "40%" }}>Granular SOW Scope Definitions Narrative *</Table.Th>
                      <Table.Th style={{ fontSize: '10px', textAlign: 'right' }}>Pricing Basis Allocation Unit</Table.Th>
                      <Table.Th style={{ fontSize: '10px', width: 40 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {serviceItems.map((svc) => (
                      <Table.Tr key={svc.id}>
                        <Table.Td>
                          <TextInput placeholder="e.g., HVAC System Structural Rigging Setup" size="xs" required />
                        </Table.Td>
                        <Table.Td>
                          <TextInput placeholder="Provide deep parameter metrics and quality expectations rules" size="xs" required />
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <NumberInput size="xs" min={0} prefix="$ " defaultValue={0} style={{ width: 140, marginLeft: 'auto' }} required />
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon variant="subtle" color="red" onClick={() => setServiceItems(serviceItems.filter(s => s.id !== svc.id))} disabled={serviceItems.length === 1}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

              <Divider label="Progress Work Valuation & Retention Finance Rules" labelPosition="left" mt="sm" />
              <SimpleGrid cols={3} spacing="sm">
                <NumberInput label="Total Contract Aggregated Pricing Value" prefix="$ " min={0} placeholder="Auto-calculated sum" />
                <NumberInput label="Mobilization Advance Allocation Released" prefix="$ " min={0} defaultValue={0} />
                <TextInput label="Milestone Validation Progress Checklist" placeholder="e.g., 30% first fix layout alignment, 70% installation" />
              </SimpleGrid>
            </>
          )}

          <Divider label="Audit Logging Notes & System Remittance Records" labelPosition="left" mt="sm" />
          <Textarea label="Internal Procurement Operational Notes / Special Caveats Instructions" placeholder="Log compliance constraints manually into standard ledger context storage paths..." rows={3} />

          <Group justify="flex-end" gap="sm" mt="lg">
            <Button variant="outline" color="gray" onClick={closeFormDrawer}>Abort Order Config</Button>
            <Button variant="light" color="indigo">Commit to Local Draft State</Button>
            <Button color="indigo" type="submit">Publish & Transmit Contract Node</Button>
          </Group>
        </Stack>
      </Drawer>

      {/* CONFIRMATION VOID CANCELLATION MODAL */}
      <Modal
        opened={cancelModalOpened}
        onClose={closeCancelModal}
        title={<Text size="xs" fw={700} c="red.7" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertCircle size={14} /> Critical Mutation Reversal Confirmation</Text>}
        centered
        size="sm"
      >
        <Stack gap="sm">
          <Text size="xs">
            Confirm permanent transaction void protocol execution against ledger entry sequence: <b>{currentPoFocus?.id}</b>?
          </Text>
          <Text size="11px" c="dimmed">
            Executing this cancellation locks the current record registry item, releases allocation holds across budget pathways, and flags downstream balance books as void. This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="xs" mt="xs">
            <Button size="xs" variant="outline" color="gray" onClick={closeCancelModal}>Abort Reversal</Button>
            <Button size="xs" color="red" onClick={closeCancelModal}>Confirm Void Protocol</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}