"use client";

import { Title, Text, Container, Card } from "@mantine/core";

export default function PurchasePage() {
  return (
    <Container size="fluid">
      <Card withBorder shadow="sm" p="xl" radius="md">
        <Title order={2} mb="xs">Purchase Requisitions & Supply Chains</Title>
        <Text c="dimmed" size="sm">
          Material requirements planning, vendor purchase order logs, and approval chains live here.
        </Text>
      </Card>
    </Container>
  );
}