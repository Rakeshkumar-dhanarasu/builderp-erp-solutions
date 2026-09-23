import { useState, useEffect } from 'react';
import { Table, TextInput, NumberInput, Button, Paper, Group, Divider, Badge, Text, ActionIcon, Checkbox } from '@mantine/core';
import { IconPlus, IconTrash, IconCornerDownRight } from '@tabler/icons-react';

export interface QuotationItem {
  id: string; itemNum: number; subItemNum?: number; description: string; quantity: number; unit: string; rate: number; amount: number;
}
export interface QuotationFinancials {
  marketPrice: number; taxPercent?: number; discountAmount: number; total: number;
}
export interface QuotationTaskRequest {
  taskName: string; subTaskName?: string; quantity: number; unit: string; unitCost: number; price: number;
}
interface QuotationTableProps {
  initialItems?: QuotationItem[]; initialFinancials?: QuotationFinancials; readOnly?: boolean;
  onChange?: (items: QuotationItem[], financials: QuotationFinancials) => void;
}

const generateId = () => (typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

export function QuotationTable({ initialItems = [], initialFinancials, readOnly = false, onChange }: QuotationTableProps) {
  const [items, setItems] = useState<QuotationItem[]>(initialItems);
  const [applyVat, setApplyVat] = useState<boolean>(initialFinancials?.taxPercent !== undefined);
  const [taxPercent, setTaxPercent] = useState<number>(initialFinancials?.taxPercent ?? 5);
  const [discountAmount, setDiscountAmount] = useState<number>(initialFinancials?.discountAmount ?? 0);

  const marketPrice = items.filter((i) => i.subItemNum !== undefined).reduce((sum, i) => sum + (i.amount || 0), 0);
  const effectiveDiscount = Math.min(Math.max(0, discountAmount || 0), marketPrice);
  const taxableAmount = marketPrice - effectiveDiscount;
  const validTaxPercent = Math.min(Math.max(0, taxPercent || 0), 100);
  const taxAmount = applyVat ? taxableAmount * (validTaxPercent / 100) : 0;
  const grossTotal = taxableAmount + taxAmount;

  useEffect(() => {
    onChange?.(items, { marketPrice, taxPercent: applyVat ? validTaxPercent : undefined, discountAmount: effectiveDiscount, total: grossTotal });
  }, [items, applyVat, validTaxPercent, effectiveDiscount, grossTotal, marketPrice, onChange]);

  const handleAddMainItem = () => {
    if (readOnly) return;
    const nextMainNum = items.reduce((max, i) => Math.max(max, i.itemNum), 0) + 1;
    setItems((prev) => [
      ...prev,
      { id: generateId(), itemNum: nextMainNum, description: '', quantity: 0, unit: '', rate: 0, amount: 0 },
      { id: generateId(), itemNum: nextMainNum, subItemNum: 1, description: '', quantity: 1, unit: 'NOS', rate: 0, amount: 0 }
    ]);
  };

  const handleAddSubItem = (parentItemNum: number) => {
    if (readOnly) return;
    const nextSubNum = items.filter((i) => i.itemNum === parentItemNum && i.subItemNum !== undefined).length + 1;
    const newSubItem: QuotationItem = { id: generateId(), itemNum: parentItemNum, subItemNum: nextSubNum, description: '', quantity: 1, unit: 'NOS', rate: 0, amount: 0 };
    const lastIndex = items.findLastIndex((i) => i.itemNum === parentItemNum);
    const updated = [...items];
    updated.splice(lastIndex + 1, 0, newSubItem);
    setItems(updated);
  };

  const handleItemChange = (id: string, key: keyof QuotationItem, value: string | number) => {
    if (readOnly) return;
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [key]: value };
      if (key === 'quantity' || key === 'rate') {
        const q = typeof updated.quantity === 'number' ? updated.quantity : parseFloat(updated.quantity as any) || 0;
        const r = typeof updated.rate === 'number' ? updated.rate : parseFloat(updated.rate as any) || 0;
        updated.quantity = q; updated.rate = r; updated.amount = q * r;
      }
      return updated;
    }));
  };

  const handleDeleteSubItem = (id: string, parentItemNum: number) => {
    if (readOnly) return;
    setItems((prev) => {
      let subCounter = 1;
      return prev.filter((i) => i.id !== id).map((i) => (i.itemNum === parentItemNum && i.subItemNum !== undefined ? { ...i, subItemNum: subCounter++ } : i));
    });
  };

  const handleDeleteMainCategory = (targetItemNum: number) => {
    if (readOnly) return;
    setItems((prev) => prev.filter((i) => i.itemNum !== targetItemNum).map((i) => (i.itemNum > targetItemNum ? { ...i, itemNum: i.itemNum - 1 } : i)));
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Table highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
        <Table.Thead bg="var(--mantine-color-body)">
          <Table.Tr>
            <Table.Th style={{ width: '80px' }}>Item #</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th style={{ width: '100px', textAlign: 'center' }}>Qty</Table.Th>
            <Table.Th style={{ width: '90px', textAlign: 'center' }}>Unit</Table.Th>
            <Table.Th style={{ width: '140px', textAlign: 'center' }}>Rate</Table.Th>
            <Table.Th style={{ width: '140px', textAlign: 'center' }}>Amount</Table.Th>
            {!readOnly && <Table.Th style={{ width: '110px', textAlign: 'center' }}>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={readOnly ? 6 : 7} style={{ textAlign: 'center', color: 'var(--mantine-color-dimmed)' }} py="xl">
                <Text size="md">{readOnly ? 'No quotation items available.' : <>No items added. Click <strong>"Add Main Category"</strong> below to start.</>}</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            items.map((item) => {
              const isMainHeader = item.subItemNum === undefined;
              const displayIndex = isMainHeader ? `${item.itemNum}` : `${item.itemNum}.${item.subItemNum}`;
              return (
                <Table.Tr key={item.id} bg={isMainHeader ? 'var(--mantine-default-hover)' : undefined}>
                  <Table.Td>
                    {isMainHeader ? (
                      <Badge color="brandOrange" variant="filled" circle size="sm">{displayIndex}</Badge>
                    ) : (
                      <Group gap={4} wrap="nowrap" pl="xs">
                        <IconCornerDownRight size={14} style={{ opacity: 0.4 }} />
                        <Text size="sm" fw={600} c="dimmed">{displayIndex}</Text>
                      </Group>
                    )}
                  </Table.Td>

                  <Table.Td>
                    <TextInput
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.currentTarget.value)}
                      placeholder={isMainHeader ? 'Category Heading (e.g., Civil Works)' : 'Task Description...'}
                      variant={isMainHeader ? 'unstyled' : 'default'}
                      fw={isMainHeader ? 700 : 400}
                      size="sm"
                      c={isMainHeader ? 'blue.9' : undefined}
                      readOnly={readOnly}
                    />
                  </Table.Td>

                  {isMainHeader ? <Table.Td colSpan={4} /> : (
                    <>
                      <Table.Td><NumberInput value={item.quantity} onChange={(val) => handleItemChange(item.id, 'quantity', val)} min={0} size="xs" hideControls readOnly={readOnly} /></Table.Td>
                      <Table.Td><TextInput value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.currentTarget.value)} size="xs" readOnly={readOnly} /></Table.Td>
                      <Table.Td><NumberInput value={item.rate} onChange={(val) => handleItemChange(item.id, 'rate', val)} min={0} decimalScale={2} size="xs" hideControls readOnly={readOnly} /></Table.Td>
                      <Table.Td style={{ verticalAlign: 'middle' }}>
                        <Text size="xs" fw={600}>ر.ع.{(item.amount || 0).toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                      </Table.Td>
                    </>
                  )}

                  {!readOnly && (
                    <Table.Td>
                      <Group gap={4} justify="center" wrap="nowrap">
                        {isMainHeader ? (
                          <>
                            <ActionIcon color="brandOrange" variant="filled" size="sm" title="Add Sub Item" onClick={() => handleAddSubItem(item.itemNum)}><IconPlus size={14} /></ActionIcon>
                            <ActionIcon variant="subtle" color="red" size="sm" title="Delete Entire Category" onClick={() => handleDeleteMainCategory(item.itemNum)}><IconTrash size={14} /></ActionIcon>
                          </>
                        ) : (
                          <ActionIcon variant="subtle" color="red" size="sm" title="Delete Sub Item" onClick={() => handleDeleteSubItem(item.id, item.itemNum)}><IconTrash size={14} /></ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

      {!readOnly && (
        <Group justify="space-between" mt="md">
          <Button variant="outline" leftSection={<IconPlus size={14} />} size="xs" onClick={handleAddMainItem}>Add Main Category</Button>
        </Group>
      )}

      <Divider my="md" />

      <Group justify="space-between" mb="xs">
        <Text size="sm">Market Price Total:</Text>
        <Text size="sm" fw={700}>ر.ع.{marketPrice.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      </Group>

      <Group justify="space-between" mb="xs">
        <Text size="sm">Discount Amount:</Text>
        <NumberInput
          value={discountAmount}
          onChange={(val) => setDiscountAmount(typeof val === 'number' ? val : parseFloat(val as any) || 0)}
          min={0} max={marketPrice} decimalScale={2} fixedDecimalScale size="xs" prefix="ر.ع. " style={{ width: '130px' }} readOnly={readOnly}
        />
      </Group>

      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <Checkbox label="Apply Tax Levies" checked={applyVat} onChange={(event) => setApplyVat(event.currentTarget.checked)} size="xs" disabled={readOnly} />
          <Group gap={4} wrap="nowrap">
            <Text size="xs" c="dimmed">Tax %</Text>
            <NumberInput
              value={taxPercent}
              onChange={(val) => setTaxPercent(typeof val === 'number' ? val : parseFloat(val as any) || 0)}
              min={0} max={100} decimalScale={2} size="xs" style={{ width: '70px' }} disabled={!applyVat || readOnly}
            />
          </Group>
        </Group>
        <Text size="md" fw={700} c={applyVat ? undefined : 'dimmed'}>
          ر.ع.{taxAmount.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </Group>

      <Divider my="xs" />

      <Group justify="space-between">
        <Text fw={700}>Target Gross Contract sum:</Text>
        <Text size="lg" fw={800} c="brandOrange">
          ر.ع.{grossTotal.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </Group>
    </Paper>
  );
}