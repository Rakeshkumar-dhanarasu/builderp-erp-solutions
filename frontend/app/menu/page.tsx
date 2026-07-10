"use client";

import { Title, Text, SimpleGrid, Card, Group, RingProgress, Stack, Badge, Box } from "@mantine/core";

export default function MainMenuDashboard() {
  return (
    <Stack gap="lg">
      <Box>
        <Title order={1} style={{ letterSpacing: "-0.5px" }}>Executive Command Center</Title>
        <Text c="dimmed" size="sm">Operational summary and scheduled global enterprise tasks.</Text>
      </Box>

      {/* --- ROW 1: BUDGET SYNOPSIS & METRICS --- */}
      {/* CORRECTED: Changed gap to spacing */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder shadow="xs" radius="md" p="md" style={{ position: 'relative' }}>
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Q2 Purchase Budget Allocation</Text>
            <Badge color="blue" variant="light">Active</Badge>
          </Group>

          {/* The main flex wrapper container */}
          <Group justify="space-between" align="center" wrap="nowrap" style={{ minHeight: 70 }}>
            {/* FIX: style={{ flex: 1 }} pushes the RingProgress completely to the right edge */}
            <div style={{ flex: 1 }}>
              <Group align="baseline" gap="xs">
                <Text size="xl" fw={700} style={{ lineHeight: 1 }}>$428,500</Text>
                <Text size="sm" c="green" fw={500}>32% remaining</Text>
              </Group>
            </div>

            <RingProgress
              size={70}
              roundCaps
              thickness={7}
              sections={[{ value: 64, color: "blue" }]}
            />
          </Group>
        </Card>

        <Card withBorder shadow="xs" radius="md" p="md" style={{ position: 'relative' }}>
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Active Project Milestones</Text>
            <Badge color="teal" variant="light">On Track</Badge>
          </Group>

          <Group justify="space-between" align="center" wrap="nowrap" style={{ minHeight: 70 }}>
            {/* FIX: style={{ flex: 1 }} pushes the RingProgress completely to the right edge */}
            <div style={{ flex: 1 }}>
              <Group align="baseline" gap="xs">
                <Text size="xl" fw={700} style={{ lineHeight: 1 }}>18 / 24</Text>
                <Text size="sm" c="dimmed">Completed</Text>
              </Group>
            </div>

            <RingProgress
              size={70}
              roundCaps
              thickness={7}
              sections={[{ value: 75, color: "teal" }]}
            />
          </Group>
        </Card>

        <Card withBorder shadow="xs" radius="md" p="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Pending Purchase Approvals</Text>
            <Badge color="red" variant="light">Action Required</Badge>
          </Group>
          <Group justify="space-between" align="center" wrap="nowrap" style={{ minHeight: 70 }}>
            <div style={{ flex: 1 }}>
              <Group align="baseline" gap="xs">
                <Text size="xl" fw={700} style={{ lineHeight: 1 }}>7 Orders</Text>
                <Text size="sm" c="red" fw={500}>Requires Auth</Text>
              </Group>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* --- ROW 2: MEETINGS TIMELINE & SYNOPSIS GRID --- */}
      {/* CORRECTED: Changed gap to spacing */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Timeline / Meetings Block */}
        <Card withBorder shadow="xs" radius="md" p="xl">
          <Title order={3} mb="md">Scheduled Operational Briefings</Title>
          <Stack gap="md">
            <Box style={{ borderLeft: "3px solid var(--mantine-color-indigo-6)", paddingLeft: "12px" }}>
              <Text size="sm" fw={600}>Procurement Sync - Steel Ingot Logistics</Text>
              <Text size="xs" c="dimmed">10:00 AM — Main Conference Hall / Teams</Text>
            </Box>
            <Box style={{ borderLeft: "3px solid var(--mantine-color-gray-4)", paddingLeft: "12px" }}>
              <Text size="sm" fw={600}>Project Delivery Milestones Review</Text>
              <Text size="xs" c="dimmed">02:30 PM — Engineering Floor Room B</Text>
            </Box>
          </Stack>
        </Card>

        {/* Task Activity Log */}
        <Card withBorder shadow="xs" radius="md" p="xl">
          <Title order={3} mb="md">System Notification Log</Title>
          <Stack gap="sm">
            <Text size="sm">⚙️ <Text component="span" fw={500}>System Admin</Text> cleared terminal lock for user ID 104.</Text>
            <Text size="sm">📉 <Text component="span" fw={500}>Sales Engine</Text> generated pipeline reconciliation matrix.</Text>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}