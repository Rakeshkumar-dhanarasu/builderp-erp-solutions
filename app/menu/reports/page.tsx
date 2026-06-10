"use client";

import { Title, Text, Container, Card } from "@mantine/core";

export default function ReportsPage() {
  return (
    <Container size="fluid">
      <Card withBorder shadow="sm" p="xl" radius="md">
        <Title order={2} mb="xs">Analytical Matrices & Reporting Logs</Title>
        <Text c="dimmed" size="sm">
          Compile operational ledgers, budget consumption histories, and performance metrics profiles.
        </Text>
      </Card>
    </Container>
  );
}