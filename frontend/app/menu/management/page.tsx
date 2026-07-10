"use client";

import React, { useState } from "react";
import {
  Grid,
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
  Progress,
  ThemeIcon,
  Timeline,
  Avatar,
  SimpleGrid,
  Alert,
  Tooltip
} from "@mantine/core";
import {
  IconSearch,
  IconUserCheck,
  IconCalendarCheck,
  IconPlaneDeparture,
  IconReceipt2,
  IconCash,
  IconFileText,
  IconEPassport,
  IconMessage2,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconUserPlus,
  IconDownload,
  IconTrendingUp,
  IconMapPin
} from "@tabler/icons-react";

// Mock Database representing relational, cross-module structural metrics
const initialEmployees = [
  {
    id: "EMP-001",
    name: "Arjun Sharma",
    role: "Supervisor",
    currentSite: "Alpha Manufacturing Corp",
    status: "Active",
    avatar: "",
    lifecycle: {
      joined: "Jan 12, 2025",
      lastRejoin: "Mar 10, 2026",
      passportStatus: "Valid (Expires 2029)",
    },
    attendance: { present: 22, absent: 1, halfDay: 1, lateMinutes: 45 },
    leaves: { casual: 4, sick: 2, paid: 10, pendingApproval: 1 },
    advances: { requested: 500, approved: 500, status: "Deduction Pending" },
    claims: [
      { id: "CLM-901", type: "Site Travel", amount: 120, status: "Approved", date: "June 24, 2026" },
      { id: "CLM-902", type: "Client Food", amount: 45, status: "Pending", date: "June 28, 2026" }
    ],
    salaryStructure: { base: 3500, allowances: 400 }
  },
  {
    id: "EMP-002",
    name: "Sarah Lin",
    role: "Designer",
    currentSite: "Apex Retail Developers",
    status: "Active",
    avatar: "",
    lifecycle: {
      joined: "Jul 19, 2024",
      lastRejoin: "N/A",
      passportStatus: "Valid (Expires 2031)",
    },
    attendance: { present: 24, absent: 0, halfDay: 0, lateMinutes: 0 },
    leaves: { casual: 6, sick: 1, paid: 14, pendingApproval: 0 },
    advances: { requested: 0, approved: 0, status: "None" },
    claims: [],
    salaryStructure: { base: 4800, allowances: 200 }
  },
  {
    id: "EMP-003",
    name: "Michael Chang",
    role: "Worker",
    currentSite: "Omega Logistics Infrastructure",
    status: "On Leave",
    avatar: "",
    lifecycle: {
      joined: "Feb 05, 2026",
      lastRejoin: "N/A",
      passportStatus: "Processing Renewal",
    },
    attendance: { present: 12, absent: 4, halfDay: 2, lateMinutes: 180 },
    leaves: { casual: 2, sick: 3, paid: 2, pendingApproval: 0 },
    advances: { requested: 300, approved: 300, status: "Deduction Pending" },
    claims: [{ id: "CLM-905", type: "Safety Boots", amount: 85, status: "Approved", date: "June 15, 2026" }],
    salaryStructure: { base: 2200, allowances: 150 }
  }
];

export default function EmployeeLifecycleManagement() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmpId, setSelectedEmpId] = useState("EMP-001");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quick Mark Attendance Cache State
  const [attendanceCache, setAttendanceCache] = useState<Record<string, string>>({});

  const activeEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  // Dynamic Salary Engine Calculation Pipeline (Automated logic matching features to requirements)
  const calculateSalaryMetrics = (emp: typeof activeEmp) => {
    const dailyRate = emp.salaryStructure.base / 24;
    const attendancePay = (emp.attendance.present * dailyRate) + (emp.attendance.halfDay * dailyRate * 0.5);
    const deductions = emp.advances.approved; 
    const grossEarnings = attendancePay + emp.salaryStructure.allowances;
    const netPay = Math.max(0, grossEarnings - deductions);

    return {
      attendancePay: Math.round(attendancePay),
      deductions: Math.round(deductions),
      grossEarnings: Math.round(grossEarnings),
      netPay: Math.round(netPay)
    };
  };

  const salaryMetrics = calculateSalaryMetrics(activeEmp);

  const handleQuickAttendance = (empId: string, status: string) => {
    setAttendanceCache(prev => ({ ...prev, [empId]: status }));
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        return {
          ...e,
          attendance: {
            ...e.attendance,
            present: status === "Present" ? e.attendance.present + 1 : e.attendance.present,
            absent: status === "Absent" ? e.attendance.absent + 1 : e.attendance.absent,
          }
        };
      }
      return e;
    }));
  };

  return (
    <Stack gap="md" style={{ width: "100%" }}>
      {/* GLOBAL MANAGEMENT ALERTS & BROADCAST INTERFACE */}
      <Card withBorder radius="md" p="sm" bg="var(--mantine-color-body)">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="sm" fw={700}>System Operations Circular</Text>
            <Text size="xs" c="dimmed">Broadcast target: All Active Operations Teams & Site Supervisors</Text>
          </Stack>
          <Badge variant="dot" color="indigo" size="md">Live Channel</Badge>
        </Group>
        <Alert icon={<IconAlertCircle size={16} />} title="Mandatory Site Verification Sync" color="indigo" radius="sm" mt="xs" styles={{ title: { fontSize: '12px' }, message: { fontSize: '11px' } }}>
          All supervisors assigned to Alpha Manufacturing and Omega Infrastructure must execute attendance payload pushes before 17:00 daily to prevent lifecycle payroll calculation mismatch drops.
        </Alert>
      </Card>

      <Grid columns={12} gap="md">
        
        {/* LEFT COLUMN: ROSTER MATRIX & WORKFORCE DEPLOYMENT LIST */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Workforce Roster</Text>
                <Button size="xs" variant="light" color="indigo" leftSection={<IconUserPlus size={14} />}>Onboard Staff</Button>
              </Group>
              
              <TextInput
                placeholder="Filter by name, resource ID, site..."
                size="xs"
                leftSection={<IconSearch size={14} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />

              <Stack gap={6} mt="xs">
                {employees
                  .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.currentSite.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((emp) => {
                    const isSelected = emp.id === selectedEmpId;
                    return (
                      <Card
                        key={emp.id}
                        withBorder
                        p="xs"
                        radius="sm"
                        style={{
                          cursor: "pointer",
                          backgroundColor: isSelected ? "var(--mantine-color-indigo-light)" : "transparent",
                          borderColor: isSelected ? "var(--mantine-color-indigo-outline)" : "var(--mantine-color-default-border)"
                        }}
                        onClick={() => setSelectedEmpId(emp.id)}
                      >
                        <Group justify="space-between" wrap="nowrap">
                          <Group gap="xs" style={{ overflow: "hidden" }}>
                            <Avatar color={isSelected ? "indigo" : "gray"} radius="xl" size="sm">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                            <div style={{ overflow: "hidden" }}>
                              <Text size="xs" fw={600} truncate>{emp.name}</Text>
                              <Group gap={4} wrap="nowrap">
                                <IconMapPin size={10} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                <Text size="10px" c="dimmed" truncate>{emp.currentSite}</Text>
                              </Group>
                            </div>
                          </Group>
                          <Stack align="flex-end" gap={2} style={{ flexShrink: 0 }}>
                            <Badge size="10px" variant="light" color={emp.status === "Active" ? "teal" : "orange"}>
                              {emp.status}
                            </Badge>
                            <Text size="10px" fw={500} c="dimmed">{emp.role}</Text>
                          </Stack>
                        </Group>
                      </Card>
                    );
                  })}
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>

        {/* RIGHT COLUMN: CORE SINGLE SOURCE OF TRUTH LIFECYCLE WORKSPACE */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            
            {/* HERO RESOURCE METRIC OVERVIEW BANNER */}
            <Card withBorder radius="md" p="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <Avatar size="xl" radius="md" color="indigo">
                    {activeEmp.name.split(" ").map(n => n[0]).join("")}
                  </Avatar>
                  <Stack gap={2}>
                    <Group gap="xs">
                      <Text size="md" fw={700}>{activeEmp.name}</Text>
                      <Badge size="xs" variant="filled" color="indigo">{activeEmp.id}</Badge>
                    </Group>
                    <Text size="xs" c="dimmed" fw={500}>{activeEmp.role} — Deployed at {activeEmp.currentSite}</Text>
                    <Group gap={6} mt={4}>
                      <Badge variant="light" size="xs" color="blue" leftSection={<IconEPassport size={10} />}>
                        {activeEmp.lifecycle.passportStatus}
                      </Badge>
                    </Group>
                  </Stack>
                </Group>
                
                <Group gap="xs">
                  <Select
                    size="xs"
                    style={{ width: 140 }}
                    placeholder="Re-route Site"
                    data={["Alpha Manufacturing Corp", "Apex Retail Developers", "Omega Logistics Infrastructure"]}
                    onChange={(val) => {
                      if (val) {
                        setEmployees(prev => prev.map(e => e.id === activeEmp.id ? { ...e, currentSite: val } : e));
                      }
                    }}
                  />
                  <Button size="xs" color="orange" variant="light" leftSection={<IconPlaneDeparture size={12} />}>
                    Process Exit
                  </Button>
                </Group>
              </Group>
            </Card>

            {/* PIPELINE DATA MODULE CONTROLLERS */}
            <Card withBorder radius="md" p="0" style={{ overflow: "hidden" }}>
              <Tabs defaultValue="lifecycle_tracker" color="indigo" styles={{ tab: { fontSize: '12px', padding: '10px 14px' } }}>
                <Tabs.List>
                  <Tabs.Tab value="lifecycle_tracker" leftSection={<IconUserCheck size={14} />}>Lifecycle Tracker</Tabs.Tab>
                  <Tabs.Tab value="attendance_engine" leftSection={<IconCalendarCheck size={14} />}>Attendance Engine</Tabs.Tab>
                  <Tabs.Tab value="salary_payroll" leftSection={<IconCash size={14} />}>Automated Salary</Tabs.Tab>
                  <Tabs.Tab value="claims_advances" leftSection={<IconReceipt2 size={14} />}>Claims & Advances</Tabs.Tab>
                </Tabs.List>

                {/* TAB 1: ACTIVITY LOG TIMELINE & COMPLIANCE METRICS */}
                <Tabs.Panel value="lifecycle_tracker" p="sm">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm">Operational History & Status Progression</Text>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mb="md">
                    <Card withBorder p="xs" radius="sm">
                      <Text size="11px" c="dimmed" fw={600}>INITIAL ONBOARD DATE</Text>
                      <Text size="sm" fw={700} mt={2}>{activeEmp.lifecycle.joined}</Text>
                    </Card>
                    <Card withBorder p="xs" radius="sm">
                      <Text size="11px" c="dimmed" fw={600}>LAST PIPELINE REJOIN NODE</Text>
                      <Text size="sm" fw={700} mt={2}>{activeEmp.lifecycle.lastRejoin}</Text>
                    </Card>
                  </SimpleGrid>

                  <Timeline active={2} bulletSize={24} lineWidth={2} styles={{ itemTitle: { fontSize: '12px', fontWeight: 600 } }}>
                    <Timeline.Item bullet={<IconUserPlus size={12} />} title="Onboard & Resource Initial Assignment">
                      <Text size="xs" c="dimmed">Assigned as {activeEmp.role} inside Core Ledger tracking parameters.</Text>
                      <Text size="10px" c="dimmed" mt={2}>{activeEmp.lifecycle.joined}</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<IconMapPin size={12} />} title="Cross-Module Site Re-routing Event">
                      <Text size="xs" c="dimmed">Transferred structural node distribution parameters directly to {activeEmp.currentSite}.</Text>
                    </Timeline.Item>
                    <Timeline.Item bullet={<IconCalendarCheck size={12} />} title="Active Performance Operational Matrix">
                      <Text size="xs" c="dimmed">Currently submitting live data payloads via field tracking units.</Text>
                    </Timeline.Item>
                  </Timeline>
                </Tabs.Panel>

                {/* TAB 2: RAPID ACTION ATTENDANCE MATRIX */}
                <Tabs.Panel value="attendance_engine" p="sm">
                  <Group justify="space-between" mb="sm">
                    <Stack gap={2}>
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase">Live Month Aggregations</Text>
                      <Text size="11px" c="dimmed">Current calculations act directly as basic dynamic metrics injection for compensation payroll matrices.</Text>
                    </Stack>
                    <Group gap="xs">
                      <Button size="xs" variant="light" color="teal" onClick={() => handleQuickAttendance(activeEmp.id, "Present")}>
                        Quick Mark Present
                      </Button>
                      <Button size="xs" variant="light" color="red" onClick={() => handleQuickAttendance(activeEmp.id, "Absent")}>
                        Quick Mark Absent
                      </Button>
                    </Group>
                  </Group>

                  <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="sm">
                    <Card withBorder p="xs" style={{ borderTop: "3px solid var(--mantine-color-teal-6)" }}>
                      <Text size="10px" c="dimmed" fw={600}>DAYS PRESENT</Text>
                      <Text size="md" fw={700} c="teal">{activeEmp.attendance.present}</Text>
                    </Card>
                    <Card withBorder p="xs" style={{ borderTop: "3px solid var(--mantine-color-red-6)" }}>
                      <Text size="10px" c="dimmed" fw={600}>DAYS ABSENT</Text>
                      <Text size="md" fw={700} c="red">{activeEmp.attendance.absent}</Text>
                    </Card>
                    <Card withBorder p="xs" style={{ borderTop: "3px solid var(--mantine-color-orange-6)" }}>
                      <Text size="10px" c="dimmed" fw={600}>HALF DAYS</Text>
                      <Text size="md" fw={700} c="orange">{activeEmp.attendance.halfDay}</Text>
                    </Card>
                    <Card withBorder p="xs" style={{ borderTop: "3px solid var(--mantine-color-yellow-6)" }}>
                      <Text size="10px" c="dimmed" fw={600}>LATE TRACKING (MINS)</Text>
                      <Text size="md" fw={700} c="yellow">{activeEmp.attendance.lateMinutes}m</Text>
                    </Card>
                  </SimpleGrid>

                  <Card withBorder radius="sm" p="xs" mt="sm">
                    <Text size="xs" fw={600} mb={6}>Current Month Allocation Balance</Text>
                    <Group justify="space-between" mb={2}>
                      <Text size="11px" c="dimmed">Casual / Sick / Paid Leave used</Text>
                      <Text size="11px" fw={600}>{activeEmp.leaves.casual + activeEmp.leaves.sick + activeEmp.leaves.paid} Days Used</Text>
                    </Group>
                    <Progress value={65} color="indigo" size="sm" radius="xl" />
                    {activeEmp.leaves.pendingApproval > 0 && (
                        <Alert 
                            icon={<IconAlertCircle size={12} />} 
                            title="Unresolved Leave Request Sequence Pending" 
                            color="orange" 
                            mt="xs" 
                            styles={{ title: { fontSize: '11px' }, message: { fontSize: '10px' } }}
                        >
                        There is {activeEmp.leaves.pendingApproval} structural exit request pending authorization matrix reviews.
                        </Alert>
                    )}
                  </Card>
                </Tabs.Panel>

                {/* TAB 3: AUTOMATED PAYROLL AND PAYSLIP ENGINE */}
                <Tabs.Panel value="salary_payroll" p="sm">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm">Real-time Calculation Engine (Auto-Compiled)</Text>
                  
                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" mb="md">
                    <Card withBorder p="xs" bg="var(--mantine-color-indigo-light)">
                      <Text size="10px" c="indigo" fw={600}>BASE ASSIGNED CONTRACT</Text>
                      <Text size="md" fw={700} c="indigo">${activeEmp.salaryStructure.base}</Text>
                    </Card>
                    <Card withBorder p="xs" bg="var(--mantine-color-orange-light)">
                      <Text size="10px" c="orange" fw={600}>AUTOMATED DEDUCTIONS</Text>
                      <Text size="md" fw={700} c="orange">-${salaryMetrics.deductions}</Text>
                    </Card>
                    <Card withBorder p="xs" bg="var(--mantine-color-teal-light)">
                      <Text size="10px" c="teal" fw={600}>DYNAMIC NET OUTFLOW</Text>
                      <Text size="md" fw={700} c="teal">${salaryMetrics.netPay}</Text>
                    </Card>
                  </SimpleGrid>

                  <Card withBorder p="xs" radius="sm" mb="sm">
                    <Text size="xs" fw={700} mb="xs">Calculated Payroll Parameter Ledger Split</Text>
                    <Table horizontalSpacing="xs" verticalSpacing="4px" withTableBorder>
                      <Table.Tbody>
                        <Table.Tr><Table.Td c="dimmed">Pro-rated Basic Presence Comp</Table.Td><Table.Td style={{ textAlign: "right" }} fw={600}>${salaryMetrics.attendancePay}</Table.Td></Table.Tr>
                        <Table.Tr><Table.Td c="dimmed">Project Operational Allowances</Table.Td><Table.Td style={{ textAlign: "right" }} fw={600}>${activeEmp.salaryStructure.allowances}</Table.Td></Table.Tr>
                        <Table.Tr><Table.Td c="dimmed">Salary Advance Recovery Deductions</Table.Td><Table.Td style={{ textAlign: "right" }} fw={600} c="red">-${salaryMetrics.deductions}</Table.Td></Table.Tr>
                        <Table.Tr style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}><Table.Td fw={700}>Total Net Payout Evaluation</Table.Td><Table.Td style={{ textAlign: "right" }} fw={700} c="indigo">${salaryMetrics.netPay}</Table.Td></Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </Card>

                  <Group justify="flex-end">
                    <Button size="xs" variant="light" color="indigo" leftSection={<IconFileText size={14} />}>Preview Statement</Button>
                    <Button size="xs" color="indigo" leftSection={<IconDownload size={14} />}>Generate Official Payslip PDF</Button>
                  </Group>
                </Tabs.Panel>

                {/* TAB 4: CLAIMS EXTRA EXPENSES & INTER-MODULE ADVANCES */}
                <Tabs.Panel value="claims_advances" p="sm">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mb="md">
                    <Card withBorder p="xs" radius="sm">
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>Salary Advance Status</Text>
                      <Group justify="space-between">
                        <div>
                          <Text size="xs" fw={600}>Active Debt Balance</Text>
                          <Text size="md" fw={700}>${activeEmp.advances.requested}</Text>
                        </div>
                        <Badge color={activeEmp.advances.requested > 0 ? "orange" : "gray"} variant="light">
                          {activeEmp.advances.status}
                        </Badge>
                      </Group>
                    </Card>
                    <Card withBorder p="xs" radius="sm">
                      <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>Expense Claims Footprint</Text>
                      <Group justify="space-between">
                        <div>
                          <Text size="xs" fw={600}>Aggregated Project Burden</Text>
                          <Text size="md" fw={700}>${activeEmp.claims.reduce((acc, curr) => acc + curr.amount, 0)}</Text>
                        </div>
                        <Button size="10px" variant="outline" color="indigo">Verify All</Button>
                      </Group>
                    </Card>
                  </SimpleGrid>

                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Project Specific Field Expense Logs</Text>
                  {activeEmp.claims.length === 0 ? (
                    <Text size="xs" c="dimmed" ta="center" py="sm">No historical or active claims registered to this payload matrix node.</Text>
                  ) : (
                    <Table variant="simple" horizontalSpacing="xs" verticalSpacing="xs">
                      <Table.Thead style={{ background: "var(--mantine-color-default-hover)" }}>
                        <Table.Tr>
                          <Table.Th>Claim Element</Table.Th>
                          <Table.Th>Log Date</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Burden Cost</Table.Th>
                          <Table.Th style={{ textAlign: "center" }}>State Routing</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {activeEmp.claims.map((claim) => (
                          <Table.Tr key={claim.id}>
                            <Table.Td fw={600}>{claim.type}</Table.Td>
                            <Table.Td c="dimmed">{claim.date}</Table.Td>
                            <Table.Td style={{ textAlign: "right" }} fw={600}>${claim.amount}</Table.Td>
                            <Table.Td style={{ display: "flex", justifyContent: "center" }}>
                              <Badge size="xs" variant="light" color={claim.status === "Approved" ? "teal" : "orange"}>
                                {claim.status}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Tabs.Panel>
              </Tabs>
            </Card>

          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}