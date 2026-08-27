"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  Grid,
  Container,
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
  Avatar,
  SimpleGrid,
  Alert,
  Tooltip,
  Divider,
  NumberInput,
  Textarea,
  Drawer,
  Modal,
  Pagination,
  Menu,
  ThemeIcon
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconUserCheck,
  IconUsers,
  IconBuildingStore,
  IconCone2,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconBan,
  IconCheck,
  IconPhone,
  IconMail,
  IconMapPin,
  IconFilter,
  IconDotsVertical,
  IconNotes,
  IconCurrencyDollar,
  IconAlertCircle,
  IconBadge
} from "@tabler/icons-react";

import { CustomerForm } from '@/components/CreationForms/CustomerForm';
import { SupplierForm } from '@/components/CreationForms/SupplierForm';
import { SubContractorForm } from '@/components/CreationForms/SubContractorForm';
import { EmployeeForm } from '@/components/CreationForms/EmployeeForm';
import { DocumentUpload } from '@/components/FilesUpload';

// Stakeholder Data Structure Interface Definition
interface Stakeholder {
  id: string;
  type: "Customer" | "Supplier" | "Sub-contractor" | "Employee";
  name: string;
  contactPerson: string;
  phone: string;
  altPhone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: string;
  createdDate: string;
  notes: string;
  paymentTerms: string;
  dependentTransactions: number;
  // Type-Specific Optional Attributes
  customerCategory?: string;
  creditLimit?: number;
  SupplierCategory?: string;
  materialServiceType?: string;
  workCategory?: string;
  specialization?: string;
  role?: string;
  department?: string;
}

// Multi-Tenant Unified Relational Enterprise Mock Schema
const initialStakeholders: Stakeholder[] = [
  {
    id: "STK-C001",
    type: "Customer",
    name: "Vertex Infrastructure Group",
    contactPerson: "Marcus Vance",
    phone: "+1 (555) 234-5678",
    altPhone: "+1 (555) 234-5679",
    email: "m.vance@vertexgrp.com",
    addressLine1: "789 Corporate Parkway",
    addressLine2: "Suite 400",
    city: "Chicago",
    state: "Illinois",
    country: "USA",
    postalCode: "60601",
    status: "Active",
    createdDate: "Feb 14, 2025",
    notes: "Primary Tier-1 infrastructure client. Fast track payment approvals verified.",
    customerCategory: "Commercial Developer",
    paymentTerms: "Net 30",
    creditLimit: 500000,
    dependentTransactions: 4
  },
  {
    id: "STK-V002",
    type: "Supplier",
    name: "Titan ReadyMix & Aggregate",
    contactPerson: "Elena Rostova",
    phone: "+1 (555) 876-5432",
    altPhone: "",
    email: "orders@titanconcrete.com",
    addressLine1: "12 Industrial Supply Way",
    addressLine2: "Yard 4B",
    city: "Gary",
    state: "Indiana",
    country: "USA",
    postalCode: "46401",
    status: "Active",
    createdDate: "May 22, 2025",
    notes: "Preferred heavy concrete material Supplier across midwest sector sites.",
    SupplierCategory: "Material Supplier",
    materialServiceType: "High-Strength Structural Concrete",
    paymentTerms: "Net 45",
    dependentTransactions: 12
  },
  {
    id: "STK-S003",
    type: "Sub-contractor",
    name: "Apex Mechanical & HVAC Systems",
    contactPerson: "David Miller",
    phone: "+1 (555) 432-1098",
    altPhone: "+1 (555) 432-1000",
    email: "d.miller@apexmech.io",
    addressLine1: "54 Northwest Highway",
    addressLine2: "",
    city: "Schaumburg",
    state: "Illinois",
    country: "USA",
    postalCode: "60173",
    status: "Inactive",
    createdDate: "Nov 08, 2025",

    notes: "Requires mandatory safety clearance re-certification before field deployment routing.",
    workCategory: "MEP Engineering",
    specialization: "Industrial Chillers & Cleanroom HVAC",
    paymentTerms: "Milestone-Based Progress",
    dependentTransactions: 0
  },
  {
    id: "STK-E002",
    type: "Employee",
    name: "J Jonah Jameson",
    contactPerson: "-",
    role: "Project Engineer",
    phone: "+91 67903 43084",
    altPhone: "+91 93893 34929",
    email: "jjonahjameson@gmail.com",
    addressLine1: "4/A, Ritchie Street",
    addressLine2: "",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "601603",
    status: "Active",
    createdDate: "Jan 02, 2025",
    notes: "Considering hike for this employee",
    department: "Project Management",
    paymentTerms: "Monthly Salary",
    dependentTransactions: 3
  }
];

export default function StakeholdersManagement() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholders);
  const [activeTab, setActiveTab] = useState<string | null>("Customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("All");
  const [selectedStkId, setSelectedStkId] = useState("STK-C001");

  // Dynamic Modals and Operations Drawers Toggles
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [deactivateModalOpened, { open: openDeactivateModal, close: closeDeactivateModal }] = useDisclosure(false);

  // Structural Form Payload Initialization State
  const [isEditing, setIsEditing] = useState(false);
  const [targetStakeholder, setTargetStakeholder] = useState<Stakeholder | null>(null);
  const [formType, setFormType] = useState<string>("Customer");
  
  // Active selected row metadata lookup pointer
  const activeStk = stakeholders.find((s) => s.id === selectedStkId) || stakeholders[0];

  // Pipeline Filter Node Logic Matrix
  const filteredData = stakeholders.filter((item) => {
    const matchesTab = item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  // Action Dispatch Event Triggers
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormType(activeTab || "Customer");
    openDrawer();
  };

  const handleOpenEdit = (stk: Stakeholder) => {
    setIsEditing(true);
    setTargetStakeholder(stk);
    setFormType(stk.type);
    openDrawer();
  };

  const handleOpenDeactivate = (stk: Stakeholder) => {
    setTargetStakeholder(stk);
    openDeactivateModal();
  };

  const handleOpenDelete = (stk: Stakeholder) => {
    setTargetStakeholder(stk);
    openDeleteModal();
  };

  const executeDeactivate = () => {
    if (targetStakeholder) {
      setStakeholders(prev => prev.map(s => s.id === targetStakeholder.id ? { ...s, status: "Inactive" } : s));
    }
    closeDeactivateModal();
  };

  const executeDelete = () => {
    if (targetStakeholder && targetStakeholder.dependentTransactions === 0) {
      setStakeholders(prev => prev.filter(s => s.id !== targetStakeholder.id));
    }
    closeDeleteModal();
  };

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* CORE TOP MODULE APP BANNER HEADER BAR */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2}>Stakeholders Matrix</Title>
            <Text size="sm" c="dimmed">Centralized coordination environment for corporate customers, raw material Suppliers, trade sub-contractors, and internal employees.</Text>
          </Stack>
          <Button
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenCreate}
          >
            Add Stakeholder
          </Button>
        </Group>
      </Paper>

      {/* CORE OPERATIONAL TAB SEPARATION LAYER */}
      <Tabs value={activeTab} onChange={(value) => { setActiveTab(value); setStatusFilter("All"); }} color='brandOrange' variant="pills">
        <Tabs.List>
          <Tabs.Tab value="Customer" leftSection={<IconUsers size={14} />}>Customers</Tabs.Tab>
          <Tabs.Tab value="Supplier" leftSection={<IconBuildingStore size={14} />}>Suppliers</Tabs.Tab>
          <Tabs.Tab value="Sub-contractor" leftSection={<IconCone2 size={14} />}>Sub-contractors</Tabs.Tab>
          <Tabs.Tab value="Employee" leftSection={<IconBadge size={14} />}>Employees</Tabs.Tab>
        </Tabs.List>

        <Grid columns={12} gap="md" mt="md">
          {/* SEARCH CONTROLS + LEDGER GRID ROSTER CONTROL BOX */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder radius="md" p="sm">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">System Ledger Roster</Text>
                  <Group gap="xs">
                    <Select
                      size="xs"
                      placeholder="Status Filter"
                      data={["All", "Active", "Inactive"]}
                      value={statusFilter}
                      onChange={setStatusFilter}
                      leftSection={<IconFilter size={12} />}
                      style={{ width: 130 }}
                    />
                  </Group>
                </Group>

                <TextInput
                  placeholder="Query stakeholder title, dispatch coordinator, deployment city node..."
                  size="xs"
                  leftSection={<IconSearch size={14} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />

                {/* THE SYSTEM LEDGER DATA RENDER PANEL */}
                <Card withBorder p={0} radius="sm" style={{ overflowX: "auto" }}>
                  <Table horizontalSpacing="xs" verticalSpacing="xs" highlightOnHover>
                    <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                      <Table.Tr>
                        <Table.Th style={{ fontSize: '11px' }}>Entity Identity</Table.Th>
                        <Table.Th style={{ fontSize: '11px' }}>Contact / Role</Table.Th>
                        <Table.Th style={{ fontSize: '11px' }}>Communications Path</Table.Th>
                        <Table.Th style={{ fontSize: '11px' }}>Zone / City</Table.Th>
                        <Table.Th style={{ fontSize: '11px' }}>Category / Dept</Table.Th>
                        <Table.Th style={{ fontSize: '11px', textAlign: "center" }}>Status</Table.Th>
                        <Table.Th style={{ fontSize: '11px', width: 50 }}></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredData.length === 0 ? (
                        <Table.Tr>
                          <Table.Td colSpan={7} style={{ textAlign: "center", padding: "20px 0" }}>
                            <Text size="xs" c="dimmed">No tracking profiles located matching parameter constraints.</Text>
                          </Table.Td>
                        </Table.Tr>
                      ) : (
                        filteredData.map((stk) => (
                          <Table.Tr 
                            key={stk.id}
                            style={{ 
                              cursor: "pointer",
                              backgroundColor: stk.id === selectedStkId ? "var(--mantine-color-brandOrange-light)" : "transparent"
                            }}
                            onClick={() => setSelectedStkId(stk.id)}
                          >
                            <Table.Td>
                              <Stack gap={0}>
                                <Text size="xs" fw={700}>{stk.name}</Text>
                                <Text size="10px" c="dimmed">{stk.id} • Created {stk.createdDate}</Text>
                              </Stack>
                            </Table.Td>
                            <Table.Td>
                              <Text size="xs" fw={500}>{stk.type === "Employee" ? (stk.role || "-") : stk.contactPerson}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Stack gap={0}>
                                <Text size="10px" fw={500}><IconPhone size={10} style={{ display: 'inline', marginRight: 4 }} />{stk.phone}</Text>
                                <Text size="10px" c="dimmed"><IconMail size={10} style={{ display: 'inline', marginRight: 4 }} />{stk.email}</Text>
                              </Stack>
                            </Table.Td>
                            <Table.Td><Text size="xs">{stk.city}</Text></Table.Td>
                            <Table.Td>
                              {activeTab === "Customer" && <Badge size="xs" variant="outline" color="blue">{stk.customerCategory}</Badge>}
                              {activeTab === "Supplier" && <Badge size="xs" variant="outline" color="orange">{stk.SupplierCategory}</Badge>}
                              {activeTab === "Sub-contractor" && <Badge size="xs" variant="outline" color="teal">{stk.workCategory}</Badge>}
                              {activeTab === "Employee" && <Badge size="xs" variant="outline" color="violet">{stk.department}</Badge>}
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <Badge size="xs" color={stk.status === "Active" ? "teal" : "red"} variant="light">
                                {stk.status}
                              </Badge>
                            </Table.Td>
                            <Table.Td onClick={(e) => e.stopPropagation()}>
                              <Menu position="bottom-end" shadow="md" width={160}>
                                <Menu.Target>
                                  <ActionIcon variant="subtle" color="gray" size="sm">
                                    <IconDotsVertical size={14} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item leftSection={<IconEye size={14} />} onClick={() => setSelectedStkId(stk.id)}>Focus Card</Menu.Item>
                                  <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEdit(stk)}>Edit Node</Menu.Item>
                                  <Menu.Item leftSection={<IconBan size={14} />} onClick={() => handleOpenDeactivate(stk)}>Deactivate Profile</Menu.Item>
                                  <Menu.Divider />
                                  <Menu.Item 
                                    leftSection={<IconTrash size={14} />} 
                                    color="red"
                                    disabled={stk.dependentTransactions > 0}
                                    onClick={() => handleOpenDelete(stk)}
                                  >
                                    Delete Record
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Table.Td>
                          </Table.Tr>
                        ))
                      )}
                    </Table.Tbody>
                  </Table>
                </Card>

                {/* HIGH MATRIX PAGINATION FOOTER CONTROL SYSTEM */}
                <Group justify="space-between" mt="xs">
                  <Text size="11px" c="dimmed">Showing {filteredData.length} entries matching dynamic data state</Text>
                  <Pagination total={1} size="xs" radius="sm" />
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          {/* RIGHT COLUMN: REVENUE IMPACT CARD + PROFILE META EVALUATOR */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              {activeStk ? (
                <>
                  <Card withBorder radius="md" p="sm" bg="var(--mantine-color-brandOrange-light)" style={{ borderLeft: "4px solid var(--mantine-color-brandOrange-filled)" }}>
                    <Stack gap={4}>
                      <Group justify="space-between">
                        <Text size="10px" fw={700} c="brandOrange" tt="uppercase">Transaction Ledger Lock</Text>
                        <Badge size="xs" color="brandOrange">{activeStk.type}</Badge>
                      </Group>
                      <Text size="sm" fw={700} c="brandOrange">{activeStk.name}</Text>
                      <Group gap="xs" mt={4}>
                        <ThemeIcon size="xs" color="brandOrange" variant="light"><IconCurrencyDollar size={10} /></ThemeIcon>
                        <Text size="xs" fw={500} c="brandOrange">
                          {activeStk.type === "Customer" && `Credit Limit Bound: $${activeStk.creditLimit?.toLocaleString()}`}
                          {activeStk.type === "Supplier" && `Material Sourcing: ${activeStk.materialServiceType}`}
                          {activeStk.type === "Sub-contractor" && `Specialization Node: ${activeStk.specialization}`}
                          {activeStk.type === "Employee" && `Designation: ${activeStk.role} (${activeStk.department})`}
                        </Text>
                      </Group>
                    </Stack>
                  </Card>

                  <Card withBorder radius="md" p="sm">
                    <Stack gap="sm">
                      <Group gap="xs">
                        <Avatar color="brandOrange" radius="md">
                          {activeStk.name.split(" ").map(n => n[0]).join("")}
                        </Avatar>
                        <div>
                          <Text size="xs" fw={700}>{activeStk.type === "Employee" ? activeStk.name : activeStk.contactPerson}</Text>
                          <Text size="10px" c="dimmed">{activeStk.type === "Employee" ? activeStk.role : "Assigned Point of Contact"}</Text>
                        </div>
                      </Group>

                      <Divider style={{ borderTopStyle: "dashed" }} />

                      <Stack gap={6}>
                        <Text size="10px" fw={700} c="dimmed" tt="uppercase">Fulfillment Logistics Address</Text>
                        <Group gap={4} wrap="nowrap" align="flex-start">
                          <IconMapPin size={12} style={{ color: 'var(--mantine-color-dimmed)', marginTop: 2, flexShrink: 0 }} />
                          <Text size="xs" c="dimmed">
                            {activeStk.addressLine1}, {activeStk.addressLine2 ? `${activeStk.addressLine2}, ` : ""}{activeStk.city}, {activeStk.state}, {activeStk.country}, {activeStk.postalCode}
                          </Text>
                        </Group>
                      </Stack>

                      <Divider style={{ borderTopStyle: "dashed" }} />

                      <Stack gap={6}>
                        <Text size="10px" fw={700} c="dimmed" tt="uppercase">Commercial Contracts Configuration</Text>
                        <SimpleGrid cols={2} spacing="xs">
                          <div>
                            <Text size="10px" c="dimmed">PAYMENT TERM CLAUSE</Text>
                            <Text size="xs" fw={600}>{activeStk.paymentTerms}</Text>
                          </div>
                          <div>
                            <Text size="10px" c="dimmed">DEPENDENT LEDGER LINKAGE</Text>
                            <Badge size="xs" color={activeStk.dependentTransactions > 0 ? "blue" : "gray"} variant="light">
                              {activeStk.dependentTransactions} Transactions
                            </Badge>
                          </div>
                        </SimpleGrid>
                      </Stack>

                      {activeStk.notes && (
                        <>
                          <Divider style={{ borderTopStyle: "dashed" }} />
                          <Stack gap={4}>
                            <Group gap={4}><IconNotes size={12} color="var(--mantine-color-dimmed)" /><Text size="10px" fw={700} c="dimmed" tt="uppercase">System Remarks / Notes</Text></Group>
                            <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>"{activeStk.notes}"</Text>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </Card>
                </>
              ) : (
                <Alert title="System Insight Grid">
                  Select a specific stakeholder record line inside the central registry matrix tool to display live configuration schemas here.
                </Alert>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Tabs>

      {/* COMPREHENSIVE ADD / EDIT STAKEHOLDER SLIDE-OUT DRAWER */}
      <Modal
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Text size="md" fw={700}>
            {isEditing ? `Edit Stakeholder Detail: ${targetStakeholder?.id}` : "Create New Stakeholder"}
          </Text>
        }
        size="70%"
        centered
      >
        <Stack gap="md" component="form" onSubmit={(e) => { e.preventDefault(); closeDrawer(); }}>
          
          <Select
            label="New Stakeholder Type"
            data={["Customer", "Supplier", "Sub-contractor", "Employee"]}
            value={formType}
            onChange={(val) => val && setFormType(val)}
            disabled={isEditing}
            required
          />

          {/* Dynamic Sub-Form Injection - Works exactly as before */}
          {formType === "Customer" && <CustomerForm isEditing={isEditing} />}
          {formType === "Supplier" && <SupplierForm isEditing={isEditing} />}
          {formType === "Sub-contractor" && <SubContractorForm isEditing={isEditing} />}
          {formType === "Employee" && <EmployeeForm isEditing={isEditing} />}

          <Divider /> 
          <DocumentUpload /> 
          <Divider />

          <Textarea label="Additional Information" placeholder="Add additional information about the stakeholder here." rows={3} />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit">Add</Button>
          </Group>
        </Stack>
      </Modal>

      {/* OPERATIONAL SAFE DISPATCH DEACTIVATION WARNING MODAL */}
      <Modal
        opened={deactivateModalOpened}
        onClose={closeDeactivateModal}
        title={<Text size="xs" fw={700} c="orange.7" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertCircle size={14} /> Profile Isolation Warning</Text>}
        centered
        size="sm"
      >
        <Stack gap="sm">
          <Text size="xs">
            Are you sure you want to isolate stakeholder profile <b>{targetStakeholder?.name}</b>?
          </Text>
          <Text size="11px" c="dimmed">
            This prevents this resource ledger identifier from being mapped into future procurement purchase logs or active billing cycles until it is manually reactivated.
          </Text>
          <Group justify="flex-end" gap="xs" mt="xs">
            <Button size="xs" variant="outline" color="gray" onClick={closeDeactivateModal}>Cancel</Button>
            <Button size="xs" color="orange" onClick={executeDeactivate}>Isolate Profile</Button>
          </Group>
        </Stack>
      </Modal>

      {/* HARD DELETION AUDIT VALIDATION MODAL */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={<Text size="xs" fw={700} c="red.7" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconAlertCircle size={14} /> Destructive Mutation Alert</Text>}
        centered
        size="sm"
      >
        <Stack gap="sm">
          <Text size="xs">
            Confirm permanent purging of stakeholder structural record: <b>{targetStakeholder?.name}</b>?
          </Text>
          {targetStakeholder && targetStakeholder.dependentTransactions > 0 ? (
            <Alert color="red" icon={<IconAlertCircle size={14} />} styles={{ title: { fontSize: '11px' }, message: { fontSize: '10px' } }}>
              Purge Rejected: This ledger reference contains {targetStakeholder.dependentTransactions} active downstream tracking connections in the Sales/Purchase logs. You must dissolve those relationships first.
            </Alert>
          ) : (
            <Text size="11px" c="dimmed">
              Warning: This action is absolute and deletes the indexing key entirely from your relational runtime environment.
            </Text>
          )}
          <Group justify="flex-end" gap="xs" mt="xs">
            <Button size="xs" variant="outline" color="gray" onClick={closeDeleteModal}>Abort</Button>
            <Button 
              size="xs" 
              color="red" 
              onClick={executeDelete}
              disabled={targetStakeholder ? targetStakeholder.dependentTransactions > 0 : false}
            >
              Purge Permanently
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}