"use client";

import React, { useEffect, useState } from 'react';
import {
  ActionIcon, Alert, Badge, Button, Card, Collapse, Container, Grid, Group,
  Loader, Modal, NumberInput, Paper, Select, Stack, Table, Tabs, Text,
  Textarea, TextInput, Title
} from '@mantine/core';

import {
  IconArchive, IconBuildingBank, IconCheck, IconChevronDown, IconChevronUp,
  IconDownload, IconEye, IconFilter, IconPlus, IconReceipt, IconRefresh,
  IconSearch, IconTruckDelivery, IconUsersGroup
} from '@tabler/icons-react';

import {
  getAllPurchaseOrders,
  getPurchaseOrderDetails,
  getPurchaseOrderVendors,
  financeApprovePurchaseOrder,
  type PoQuotationResponse,
  type PurchaseOrderSummaryResponse,
  type PurchaseOrderDetailResponse,
  type VendorLookupResponse
} from '@/services/purchaseOrderService';

interface FinancePoRow {
  summary: PurchaseOrderSummaryResponse;
  detail: PurchaseOrderDetailResponse;
  selectedQuotation: PoQuotationResponse | null;
  vendorName: string;
}

// Helper to format values consistently in OMR
const formatOMR = (val: number) =>
  new Intl.NumberFormat('en-OM', { style: 'currency', currency: 'OMR' }).format(val);

const OrderStatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    'Paid': 'green',
    'Partially Paid': 'cyan',
    'Pending': 'yellow',
    'Overdue': 'red'
  };
  return <Badge color={colorMap[status] || 'gray'} variant="light" size="xs">{status}</Badge>;
};

// ==========================================
// CORE FINANCE PAGE COMPONENT
// ==========================================
export default function FinanceModule() {
  const [activeTab, setActiveTab] = useState<string | null>('vendor-pay');

  // Modals Control
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const [purchaseOrders, setPurchaseOrders] = useState<FinancePoRow[]>([]);
  const [expandedPoId, setExpandedPoId] = useState<string | null>(null);
  const [poLoading, setPoLoading] = useState(false);
  const [poActionId, setPoActionId] = useState<string | null>(null);
  const [poError, setPoError] = useState<string | null>(null);
  const [poSuccess, setPoSuccess] = useState<string | null>(null);
  const [receiptContent, setReceiptContent] = useState<string | null>(null);
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);

  const loadPurchaseOrders = async () => {
    setPoLoading(true);
    setPoError(null);

    try {
      const [summaries, vendors] = await Promise.all([
        getAllPurchaseOrders(),
        getPurchaseOrderVendors()
      ]);

      const approvedSummaries = summaries.filter(
        po => po.status === 'Approved'
      );

      const rows = await Promise.all(
        approvedSummaries.map(async summary => {
          const detail = await getPurchaseOrderDetails(summary.poRequestId);

          const selectedQuotation =
            detail.quotations.find(q => q.status === 'Selected') ?? null;

          const vendorName = selectedQuotation
            ? vendors.find(v => v.vendorId === selectedQuotation.vendorId)?.vendorName
              ?? `Vendor #${selectedQuotation.vendorId}`
            : 'No selected quotation';

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
      setPoError('Unable to load purchase orders. Please try again.');
    } finally {
      setPoLoading(false);
    }
  };

  const handleFinanceApproval = async (poRequestId: string) => {
    setPoActionId(poRequestId);
    setPoError(null);
    setPoSuccess(null);

    try {
      await financeApprovePurchaseOrder(poRequestId);
      setPoSuccess(`Purchase order ${poRequestId} was finance-approved.`);
      await loadPurchaseOrders();
      setExpandedPoId(null);
    } catch {
      setPoError(
        'Finance approval failed. The budget may be insufficient, or the PO may no longer be eligible for approval.'
      );
    } finally {
      setPoActionId(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'vendor-pay') {
      void loadPurchaseOrders();
    }
  }, [activeTab]);

  return (
    <Container fluid p={0} display="flex" style={{ flexDirection: 'column', gap: 'var(--mantine-spacing-md)', width: '100%' }}>
      {/* Page Header */}
      <Paper p="md" radius="md" mb='xl' withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2}>Enterprise Treasury & Finance Control</Title>
            <Text size="sm" c="dimmed">
              Integrated Liquidity Ledger: Client Receivables, Supply Chain Capital Outflows, and Central Audit Register.
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="vendor-pay" leftSection={<IconTruckDelivery size={16} />}>
            PO Approval
          </Tabs.Tab>
        </Tabs.List>

        {/* TAB 2: PO APPROVAL */}
        <Tabs.Panel value="vendor-pay">
          <Card withBorder radius="md" p="sm">
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" fw={700}>Purchase Order Approval</Text>
                  <Text size="xs" c="dimmed">Review submitted purchase orders and the quotation selected by Project Management.</Text>
                </div>
                <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />} onClick={() => void loadPurchaseOrders()} loading={poLoading}>
                  Refresh
                </Button>
              </Group>

              {poError && <Alert color="red" title="Action unsuccessful">{poError}</Alert>}
              {poSuccess && <Alert color="green" title="Success">{poSuccess}</Alert>}

              {poLoading && purchaseOrders.length === 0 ? (
                <Group justify="center" p="xl">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Loading purchase orders...</Text>
                </Group>
              ) : (
                <Table.ScrollContainer minWidth={850}>
                  <Table horizontalSpacing="xs" verticalSpacing="sm" withTableBorder highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>PO Request ID</Table.Th>
                        <Table.Th>Project ID</Table.Th>
                        <Table.Th>Submission Date</Table.Th>
                        <Table.Th>Selected Vendor</Table.Th>
                        <Table.Th style={{ textAlign: 'right' }}>Quotation Amount</Table.Th>
                        <Table.Th>Details</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {purchaseOrders.map(po => {
                        const expanded = expandedPoId === po.summary.poRequestId;

                        return (
                          <React.Fragment key={po.summary.poRequestId}>
                            <Table.Tr>
                              <Table.Td><Text size="xs" fw={700}>{po.summary.poRequestId}</Text></Table.Td>
                              <Table.Td><Text size="xs">{po.summary.projectId}</Text></Table.Td>
                              <Table.Td><Text size="xs">{po.summary.createdAt}</Text></Table.Td>
                              <Table.Td><Text size="xs" fw={600}>{po.vendorName}</Text></Table.Td>
                              <Table.Td style={{ textAlign: 'right' }}>
                                <Text size="xs" fw={700}>
                                  {po.selectedQuotation ? formatOMR(Number(po.selectedQuotation.quotationAmount)) : '—'}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Button
                                  size="xs"
                                  variant="subtle"
                                  leftSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                                  onClick={() => setExpandedPoId(expanded ? null : po.summary.poRequestId)}
                                >
                                  {expanded ? 'Hide' : 'View'}
                                </Button>
                              </Table.Td>
                            </Table.Tr>

                            {expanded && (
                              <Table.Tr>
                                <Table.Td colSpan={6}>
                                  <Collapse expanded={expanded}>
                                    <Stack gap="md" p="sm">
                                      <Group justify="space-between" align="center">
                                        <Title order={5}>Purchase Order Details</Title>
                                        <Badge color="blue" variant="light">{po.detail.status}</Badge>
                                      </Group>

                                      <Text size="sm" fw={600}>Requested Items</Text>

                                      <Table withTableBorder>
                                        <Table.Thead>
                                          <Table.Tr>
                                            <Table.Th>Item ID</Table.Th>
                                            <Table.Th>Quantity</Table.Th>
                                            <Table.Th>Unit Price</Table.Th>
                                            <Table.Th>Total</Table.Th>
                                          </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                          {po.detail.items.map(item => (
                                            <Table.Tr key={item.itemRequestId}>
                                              <Table.Td>{item.itemId}</Table.Td>
                                              <Table.Td>{item.itemQuantity}</Table.Td>
                                              <Table.Td>{formatOMR(Number(item.itemUnitPrice))}</Table.Td>
                                              <Table.Td>{formatOMR(Number(item.itemTotalPrice))}</Table.Td>
                                            </Table.Tr>
                                          ))}
                                        </Table.Tbody>
                                      </Table>

                                      <Text size="sm" fw={600}>Selected Vendor Quotation</Text>

                                      {po.selectedQuotation ? (
                                        <Paper withBorder radius="md" p="sm">
                                          <Stack gap="xs">
                                            <Group justify="space-between"><Text size="sm">Vendor</Text><Text size="sm" fw={600}>{po.vendorName}</Text></Group>
                                            <Group justify="space-between"><Text size="sm">Quotation Reference</Text><Text size="sm" fw={600}>{po.selectedQuotation.poQuotationId}</Text></Group>
                                            <Group justify="space-between"><Text size="sm">Quotation Amount</Text><Text size="sm" fw={700}>{formatOMR(Number(po.selectedQuotation.quotationAmount))}</Text></Group>
                                            <Group justify="space-between"><Text size="sm">Quotation Date</Text><Text size="sm">{po.selectedQuotation.creationDate}</Text></Group>
                                            <Group justify="space-between">
                                              <Text size="sm">Receipt</Text>
                                              {po.selectedQuotation.receiptAttached ? (
                                                <Button
                                                  size="xs"
                                                  variant="light"
                                                  leftSection={<IconEye size={14} />}
                                                  onClick={() => {
                                                    setReceiptContent(po.selectedQuotation!.receiptAttached);
                                                    setReceiptViewerOpen(true);
                                                  }}
                                                >
                                                  View Receipt
                                                </Button>
                                              ) : (
                                                <Text size="xs" c="dimmed">No receipt attached</Text>
                                              )}
                                            </Group>
                                          </Stack>
                                        </Paper>
                                      ) : (
                                        <Alert color="orange" title="Quotation not selected">
                                          Finance approval is unavailable because this PO does not have exactly one quotation marked Selected.
                                        </Alert>
                                      )}

                                      <Group justify="end">
                                        <Button
                                          color="teal"
                                          leftSection={<IconCheck size={14} />}
                                          disabled={!po.selectedQuotation}
                                          loading={poActionId === po.summary.poRequestId}
                                          onClick={() => void handleFinanceApproval(po.summary.poRequestId)}
                                        >
                                          Finance Approve
                                        </Button>
                                      </Group>
                                    </Stack>
                                  </Collapse>
                                </Table.Td>
                              </Table.Tr>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {!poLoading && purchaseOrders.length === 0 && (
                        <Table.Tr>
                          <Table.Td colSpan={6}>
                            <Text ta="center" c="dimmed" size="sm" py="lg">No approved purchase orders found.</Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              )}
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* ==========================================
          MODALS
         ========================================== */}

      {/* 2. Receipt Viewer Modal */}
      <Modal opened={receiptOpen} onClose={() => setReceiptOpen(false)} title={`Audit Vault Ledger Record | ${selectedReceipt?.id}`} size="lg" radius="md">
        {selectedReceipt && (
          <Paper p="xl" withBorder style={{ fontFamily: 'monospace' }}>
            <Group justify="space-between" mb="xl">
              <div>
                <Title order={4}>CASH CLEARANCE RECEIPT</Title>
                <Text size="xs" c="dimmed">AUTOMATED REGISTRY RECORD SYSTEM</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text fw={700}>{selectedReceipt.id}</Text>
                <Text size="xs">{selectedReceipt.date}</Text>
              </div>
            </Group>

            <Table variant="simple" mb="xl">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Transaction Allocator Context</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Net Cleared Value</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Settlement balance tracking item against active progress milestones</Table.Td>
                  <Table.Td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatOMR(selectedReceipt.amt)}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="xl">
              <Text size="xs" c="dimmed">Sign-off Verification ID: SYSTEM_AUTH_SECURE_2026</Text>
              <Button size="xs" variant="light" color="blue" leftSection={<IconDownload size={14} />}>
                Export Signed Compliance PDF
              </Button>
            </Group>
          </Paper>
        )}
      </Modal>
    </Container>
  );
}