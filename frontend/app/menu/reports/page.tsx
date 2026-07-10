"use client";

import React, { useState } from "react";
import { 
  SimpleGrid, 
  Card, 
  Group, 
  Text, 
  Badge, 
  Button, 
  Table, 
  Stack, 
  Select, 
  Progress,
  ThemeIcon,
  Grid,
  NavLink
} from "@mantine/core";
import { 
  IconFileSpreadsheet, 
  IconPackage, 
  IconReportMoney,
  IconChartBar,
  IconFilter,
  IconBookmark
} from "@tabler/icons-react";

// Cross-Module Data Warehouse Mock Engine
const reportProjectsData = [
  {
    id: "p1",
    clientName: "Alpha Manufacturing Corp",
    category: "Operational",
    metrics: { sales: 185000, purchase: 45000, margin: 75.6, progress: 80 },
    insights: { type: "success", text: "Project tracking optimal. Margin healthy." },
    stockLevel: 85,
    variance: -5 // Under budget
  },
  {
    id: "p2",
    clientName: "Omega Logistics Infrastructure",
    category: "Financial",
    metrics: { sales: 620000, purchase: 185000, margin: 70.1, progress: 45 },
    insights: { type: "danger", text: "Over-budget exposure risk on Phase 2 concrete works." },
    stockLevel: 25, // Low Stock Alert
    variance: 14 // 14% over budget
  },
  {
    id: "p3",
    clientName: "Apex Retail Developers",
    category: "Inventory",
    metrics: { sales: 140000, purchase: 12000, margin: 91.4, progress: 15 },
    insights: { type: "warning", text: "Subcontractor dispatch lagging against milestones." },
    stockLevel: 95,
    variance: 0
  }
];

export default function ReportsPage() {
  // Global Filter State Matrix
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("Operational");
  const [timeRange, setTimeRange] = useState<string>("Quarter-to-Date");

  // Dynamic cross-module data compilation aggregation engine
  const filteredData = reportProjectsData.filter(p => {
    const projectMatch = selectedProject === "all" || p.id === selectedProject;
    return projectMatch;
  });

  // Roll-up summary calculations for metrics
  const totalSalesRollup = filteredData.reduce((acc, curr) => acc + curr.metrics.sales, 0);
  const totalPurchaseRollup = filteredData.reduce((acc, curr) => acc + curr.metrics.purchase, 0);
  const averageMargin = filteredData.reduce((acc, curr) => acc + curr.metrics.margin, 0) / filteredData.length;

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <Stack gap="md" style={{ width: "100%" }}>
      
      {/* GLOBAL BI FILTERS TOP BAR */}
      <Card withBorder radius="md" p="sm" shadow="xs">
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon variant="transparent" color="indigo"><IconFilter size={16} /></ThemeIcon>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">Global Analytical Filter Matrix</Text>
            </Group>
            <Group gap="xs">
              <Button size="xs" variant="light" color="gray" leftSection={<IconBookmark size={14} />}>
                Load Saved Template
              </Button>
              <Button size="xs" color="indigo" leftSection={<IconFileSpreadsheet size={14} />}>
                Export Unified CSV
              </Button>
            </Group>
          </Group>
          
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            <Select
              label="Cross-Module Project Node"
              placeholder="All Cross-Module Scope Data"
              data={[{ value: "all", label: "All Master Records" }, ...reportProjectsData.map(p => ({ value: p.id, label: p.clientName }))]}
              value={selectedProject}
              onChange={(val) => val && setSelectedProject(val)}
              radius="sm"
              size="xs"
            />
            <Select
              label="Temporal Date Parameter"
              placeholder="Select Window"
              data={["Current Month", "Quarter-to-Date", "Fiscal Year 2026", "Historical Inactive Logs"]}
              value={timeRange}
              onChange={(val) => val && setTimeRange(val)}
              radius="sm"
              size="xs"
            />
            <Select
              label="Downstream Vendor Status Routing"
              placeholder="All Active Frameworks"
              data={["All Internal Nodes", "Verified Cleared Partners Only", "Flags & Watchlists"]}
              defaultValue="All Internal Nodes"
              radius="sm"
              size="xs"
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* THREE-COLUMN INTELLIGENCE HUB CORE */}
      {/* FIXED: Replaced non-existent 'gutter' prop with modern Mantine 'gap' token */}
      <Grid columns={12} gap="md">
        
        {/* SIDEBAR: REPORT VIEW CATEGORIES SELECTION */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs" pl="xs">Report Vectors</Text>
            <Stack gap={4}>
              <NavLink
                href="#operational"
                label="Operational Architecture"
                description="Site Performance, WOs, Teams"
                active={activeCategory === "Operational"}
                leftSection={<IconChartBar size={16} />}
                onClick={() => setActiveCategory("Operational")}
                color="indigo"
                variant="light"
              />
              <NavLink
                href="#financial"
                label="Financial Ledgers"
                description="Aggregated Payables & Receivables"
                active={activeCategory === "Financial"}
                leftSection={<IconReportMoney size={16} />}
                onClick={() => setActiveCategory("Financial")}
                color="indigo"
                variant="light"
              />
              <NavLink
                href="#inventory"
                label="Material Stock Routing"
                description="Warehouse Hubs & Site Spares"
                active={activeCategory === "Inventory"}
                leftSection={<IconPackage size={16} />}
                onClick={() => setActiveCategory("Inventory")}
                color="indigo"
                variant="light"
              />
            </Stack>
          </Card>
        </Grid.Col>

        {/* MAIN ANALYSIS REPORT VIEWPORT */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack gap="md">
            
            {/* AGGREGATE SUMMARY ROLL-UP CARDS */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
              <Card withBorder p="sm" radius="md">
                <Text size="xs" c="dimmed" fw={700}>TOTAL GROUP VALUATION</Text>
                <Text size="lg" fw={700} c="indigo" mt={2}>{formatCurrency(totalSalesRollup)}</Text>
                <Progress value={85} color="indigo" size="xs" mt="xs" />
              </Card>
              <Card withBorder p="sm" radius="md">
                <Text size="xs" c="dimmed" fw={700}>TOTAL EXPENDITURE BURDEN</Text>
                <Text size="lg" fw={700} c="orange" mt={2}>{formatCurrency(totalPurchaseRollup)}</Text>
                <Progress value={(totalPurchaseRollup / totalSalesRollup) * 100} color="orange" size="xs" mt="xs" />
              </Card>
              <Card withBorder p="sm" radius="md">
                <Text size="xs" c="dimmed" fw={700}>AGGREGATE COGS MARGIN</Text>
                <Text size="lg" fw={700} c="teal" mt={2}>{averageMargin.toFixed(1)}%</Text>
                <Progress value={averageMargin} color="teal" size="xs" mt="xs" />
              </Card>
            </SimpleGrid>

            {/* CRITICAL EXCEPTION ENGINE (SMART INSIGHTS) */}
            {/* FIXED: Removed hardcoded background color property to let theme systems natively evaluate background layers */}
            <Card withBorder radius="md" p="sm">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Automated ML Exception Ledger</Text>
              <Stack gap="xs">
                {filteredData.map(p => (
                  <Group 
                    key={p.id} 
                    justify="space-between" 
                    wrap="nowrap" 
                    style={{ 
                      // Natively maps custom warning flags via standard Mantine system colors without breaking theme contracts
                      borderLeft: `3px solid var(--mantine-color-${p.insights.type === "danger" ? "red" : p.insights.type === "warning" ? "yellow" : "green"}-6)`, 
                      paddingLeft: 8 
                    }}
                  >
                    <Stack gap={0}>
                      <Text size="xs" fw={600}>{p.clientName}</Text>
                      <Text size="xs" c="dimmed">{p.insights.text}</Text>
                    </Stack>
                    <Badge color={p.insights.type === "danger" ? "red" : p.insights.type === "warning" ? "yellow" : "green"} size="xs" variant="light">
                      {p.insights.type === "danger" ? "Action Required" : p.insights.type === "warning" ? "Watchlist" : "Nominal"}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Card>

            {/* INTERACTIVE DATA VISUALIZERS (BAR PLOT IMPLEMENTATION VIA PROGRESS COMPONENTS) */}
            <Card withBorder radius="md" p="md">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md">Cross-Module Structural Distribution Plot</Text>
              <Stack gap="md">
                {filteredData.map(p => (
                  <div key={p.id}>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" fw={600}>{p.clientName}</Text>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Sales: <strong style={{ color: "var(--mantine-color-text)" }}>{formatCurrency(p.metrics.sales)}</strong></Text>
                        <Text size="xs" c="dimmed">Stock Security: <strong style={{ color: p.stockLevel < 30 ? "var(--mantine-color-red-filled)" : "var(--mantine-color-text)" }}>{p.stockLevel}%</strong></Text>
                      </Group>
                    </Group>
                    <Progress.Root size="xl">
                      <Progress.Section value={p.metrics.progress} color="indigo">
                        <Progress.Label>Execution Progress ({p.metrics.progress}%)</Progress.Label>
                      </Progress.Section>
                      <Progress.Section value={p.variance > 0 ? p.variance : 0} color="red">
                        <Progress.Label>Overrun</Progress.Label>
                      </Progress.Section>
                    </Progress.Root>
                  </div>
                ))}
              </Stack>
            </Card>

            {/* THE DRILL-DOWN LEDGER ENGINE TABLE */}
            <Card withBorder radius="md" p="0" style={{ overflow: "hidden" }}>
              <Table variant="simple" verticalSpacing="sm" highlightOnHover>
                {/* FIXED: Removed raw background inline style configuration. Mantine v7 handles dark/light table header states natively */}
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Project Cluster Entity (Click Row to Drill-Down)</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Contract Baseline</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Procurement Drain</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Cost Variance</Table.Th>
                    <Table.Th style={{ textAlign: "center" }}>Stock Health Node</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredData.map((p) => (
                    <Table.Tr key={p.id} style={{ cursor: "pointer" }} onClick={() => alert(`Navigating via Drill-down Link matrix directly to workspace parameters for: ${p.clientName}`)}>
                      <Table.Td fw={600} c="indigo">{p.clientName}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>{formatCurrency(p.metrics.sales)}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>{formatCurrency(p.metrics.purchase)}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <Badge variant="light" color={p.variance > 0 ? "red" : "green"}>
                          {p.variance > 0 ? `+${p.variance}% Over Budget` : "On Track"}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ display: "flex", justifyContent: "center" }}>
                        <Badge color={p.stockLevel < 30 ? "red" : "teal"} variant="filled">
                          {p.stockLevel < 30 ? "Critical Restock" : "Stable Stock Node"}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>

          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}