"use client";

import React, { useCallback,useEffect, useState } from "react";
import {
  ActionIcon, Alert, Badge, Box, Button, Card, Container, Divider, Drawer,
  Grid, Group, Loader, Menu, Modal, NumberInput, Pagination, Paper, ScrollArea,
  Select, SimpleGrid, Stack, Table, Tabs, Text, Textarea, TextInput, Timeline, Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle, IconBan, IconCalendar, IconClipboardCheck, IconCone2, IconCopy,
  IconCreditCard, IconCurrencyDollar, IconDotsVertical, IconDownload, IconEdit,
  IconEye, IconFileText, IconFilter, IconMail, IconMapPin, IconNotes, IconPhone,
  IconPlus, IconReceipt, IconSearch, IconTrash, IconTruckDelivery
} from "@tabler/icons-react";

import {
  getAllPurchaseOrders,
  getPurchaseOrderDetails,
  getPurchaseOrderVendors,
  placePurchaseOrder,
  type PurchaseOrderSummaryResponse,
  type PurchaseOrderDetailResponse,
  type PoQuotationResponse,
  type VendorLookupResponse
} from "@/services/purchaseOrderService";

interface PurchaseOrderRow {
  summary: PurchaseOrderSummaryResponse;
  detail: PurchaseOrderDetailResponse;
  selectedQuotation: PoQuotationResponse | null;
  vendorName: string;
}

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
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionPoId, setActionPoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  
  const loadPurchaseOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summaries, vendors] = await Promise.all([
        getAllPurchaseOrders(),
        getPurchaseOrderVendors()
      ]);

      const approvedOrders = summaries.filter(
        po => po.status === "Approved"
      );

      const rows = await Promise.all(
        approvedOrders.map(async summary => {
          const detail = await getPurchaseOrderDetails(summary.poRequestId);

          const selectedQuotation =
            detail.quotations.find(q => q.status === "Selected") ?? null;

          const vendorName = selectedQuotation
            ? vendors.find(v => v.vendorId === selectedQuotation.vendorId)?.vendorName
                ?? `Vendor #${selectedQuotation.vendorId}`
            : "No selected vendor";

          return {
            summary,
            detail,
            selectedQuotation,
            vendorName
          };
        })
      );

      setPurchaseOrders(rows);
    } catch {
      setError("Unable to load purchase orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPurchaseOrders();
  }, [loadPurchaseOrders]);

  const handlePlaceOrder = async (poRequestId: string) => {
    setActionPoId(poRequestId);
    setError(null);
    setSuccess(null);

    try {
      await placePurchaseOrder(poRequestId);
      setSuccess(`Purchase order ${poRequestId} was placed successfully.`);
      await loadPurchaseOrders();
    } catch {
      setError("Unable to place the purchase order. Please try again.");
    } finally {
      setActionPoId(null);
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const search = searchQuery.trim().toLowerCase();

    return (
      po.summary.poRequestId.toLowerCase().includes(search) ||
      po.summary.projectId.toLowerCase().includes(search) ||
      po.vendorName.toLowerCase().includes(search)
    );
  });

  const currentPoFocus = purchaseOrders.find(
    po => po.summary.poRequestId === selectedPoId
  ) ?? null;


  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* COMPONENT BANNER CONTROL CARD */}
      <Paper p="md" radius="md" mb="xl" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2}>Purchase Ledger Architecture</Title>
            <Text size="sm" c="dimmed">Coordinate capital-intensive materials acquisition procurement workflows and control active vendor engineering service lines.</Text>
          </Stack>
        </Group>
      </Paper>

      {/* WORKFLOW SPLIT REVENUE NAVIGATION TAB CONTROLLERS */}
      <Tabs variant="pills" value={activeModuleTab} onChange={setActiveModuleTab} >
        <Tabs.List>
          <Tabs.Tab value="po" leftSection={<IconFileText size={14} />}>
            Purchase Orders
          </Tabs.Tab>
        </Tabs.List>

        {/* TAB 1 & 2 ROUTING CONTEXT (PURCHASE ORDERS & DISPATCH LOOKUP TRACKING) */}
        <Tabs.Panel value="po" mt="md">
          <Stack gap="md">
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between" align="center" mb="md">
                <Stack gap={2}>
                  <Title order={4}>Purchase Orders</Title>
                  <Text size="sm" c="dimmed">Review approved purchase orders and record order placement.</Text>
                </Stack>
                <Button variant="light" leftSection={<IconTruckDelivery size={16} />} onClick={() => void loadPurchaseOrders()} loading={loading}>Refresh</Button>
              </Group>

              {error && <Alert color="red" title="Error" mb="sm">{error}</Alert>}
              {success && <Alert color="green" title="Success" mb="sm">{success}</Alert>}

              <TextInput placeholder="Search by PO Request ID, Project ID, or vendor..." leftSection={<IconSearch size={16} />} value={searchQuery} onChange={(event) => setSearchQuery(event.currentTarget.value)} mb="md" />

              {loading && purchaseOrders.length === 0 ? (
                <Group justify="center" py="xl"><Loader size="sm" /><Text size="sm" c="dimmed">Loading purchase orders...</Text></Group>
              ) : (
                <Box style={{ overflowX: "auto" }}>
                  <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="sm" horizontalSpacing="md" miw={850}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>PO Request ID</Table.Th>
                        <Table.Th>Project ID</Table.Th>
                        <Table.Th>Submission Date</Table.Th>
                        <Table.Th>Selected Vendor</Table.Th>
                        <Table.Th style={{ textAlign: "right" }}>Quotation Amount (OMR)</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredPurchaseOrders.map((po) => (
                        <Table.Tr key={po.summary.poRequestId}>
                          <Table.Td><Text size="sm" fw={600}>{po.summary.poRequestId}</Text></Table.Td>
                          <Table.Td><Text size="sm">{po.summary.projectId}</Text></Table.Td>
                          <Table.Td><Text size="sm">{po.summary.createdAt ? new Date(po.summary.createdAt).toLocaleDateString() : "-"}</Text></Table.Td>
                          <Table.Td><Text size="sm">{po.vendorName}</Text></Table.Td>
                          <Table.Td style={{ textAlign: "right" }}>
                            <Text size="sm" fw={600}>
                              {po.selectedQuotation ? po.selectedQuotation.quotationAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                            </Text>
                          </Table.Td>
                          <Table.Td><Badge color="blue" variant="light">{po.summary.status}</Badge></Table.Td>
                          <Table.Td>
                            <Group gap="xs" wrap="nowrap">
                              <ActionIcon variant="light" color="gray" aria-label="View purchase order details" onClick={() => { setSelectedPoId(po.summary.poRequestId); openDrawer(); }}>
                                <IconEye size={16} />
                              </ActionIcon>
                              <Button size="xs" color="teal" leftSection={<IconTruckDelivery size={14} />} loading={actionPoId === po.summary.poRequestId} disabled={actionPoId !== null || !po.selectedQuotation} onClick={() => void handlePlaceOrder(po.summary.poRequestId)}>
                                Order Placed
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}

                      {!loading && filteredPurchaseOrders.length === 0 && (
                        <Table.Tr>
                          <Table.Td colSpan={7}>
                            <Text ta="center" c="dimmed" py="xl" size="sm">
                              {purchaseOrders.length === 0 ? "No approved purchase orders are available." : "No purchase orders match your search."}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Box>
              )}
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* DRAWER LAYER ONE: VIEW DETAIL INVENTORY EXPANSION PANEL */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={
          <Text fw={700}>
            Purchase Order Details
            {currentPoFocus ? ` — ${currentPoFocus.summary.poRequestId}` : ""}
          </Text>
        }
        position="right"
        size="xl"
      >
        {currentPoFocus && (
          <Stack gap="md">
            <Card withBorder p="sm">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Box>
                  <Text size="xs" c="dimmed">PO Request ID</Text>
                  <Text fw={600}>{currentPoFocus.summary.poRequestId}</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Project ID</Text>
                  <Text fw={600}>{currentPoFocus.summary.projectId}</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Submission Date</Text>
                  <Text>
                    {currentPoFocus.summary.createdAt
                      ? new Date(
                          currentPoFocus.summary.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Status</Text>
                  <Badge color="blue" variant="light">
                    {currentPoFocus.summary.status}
                  </Badge>
                </Box>
              </SimpleGrid>
            </Card>

            <Title order={5}>Purchase Order Items</Title>

            <Box style={{ overflowX: "auto" }}>
              <Table withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item ID</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Quantity</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>
                      Unit Price
                    </Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>
                      Total
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {currentPoFocus.detail.items.map((item) => (
                    <Table.Tr key={item.itemRequestId}>
                      <Table.Td>{item.itemId}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {item.itemQuantity}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {item.itemUnitPrice.toFixed(2)}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {item.itemTotalPrice.toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  ))}

                  {currentPoFocus.detail.items.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text ta="center" c="dimmed" size="sm">
                          No items found.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Box>

            <Title order={5}>Selected Vendor Quotation</Title>

            {currentPoFocus.selectedQuotation ? (
              <Card withBorder p="sm">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Vendor</Text>
                    <Text size="sm" fw={600}>
                      {currentPoFocus.vendorName}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Quotation ID</Text>
                    <Text size="sm">
                      {currentPoFocus.selectedQuotation.poQuotationId}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Quotation Date</Text>
                    <Text size="sm">
                      {currentPoFocus.selectedQuotation.creationDate
                        ? new Date(
                            currentPoFocus.selectedQuotation.creationDate
                          ).toLocaleDateString()
                        : "-"}
                    </Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={600}>Quotation Amount (OMR)</Text>
                    <Text fw={700}>
                      {currentPoFocus.selectedQuotation.quotationAmount.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }
                      )}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            ) : (
              <Alert color="yellow" title="No selected quotation">
                This purchase order does not have a quotation marked as Selected.
              </Alert>
            )}

            <Group justify="flex-end">
              <Button variant="default" onClick={closeDrawer}>
                Close
              </Button>
              <Button
                color="teal"
                leftSection={<IconTruckDelivery size={16} />}
                loading={actionPoId === currentPoFocus.summary.poRequestId}
                disabled={
                  actionPoId !== null || !currentPoFocus.selectedQuotation
                }
                onClick={() =>
                  void handlePlaceOrder(currentPoFocus.summary.poRequestId)
                }
              >
                Order Placed
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>
    </Container>
  );
}