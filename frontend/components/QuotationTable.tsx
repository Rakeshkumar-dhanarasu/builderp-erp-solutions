import { useState, useEffect } from 'react';
import { Table, TextInput, NumberInput, Button, Paper, Group, Divider, Badge, Text, ActionIcon, Checkbox } from '@mantine/core';
import { IconPlus, IconTrash, IconCornerDownRight} from '@tabler/icons-react';

export interface QuotationItem {
  id: string;
  itemNum: number;      // Parent Index (1, 2, 3...)
  subItemNum?: number;  // Sub-item Index (1, 2, 3... or undefined/null if it's a main parent heading)
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface QuotationTableProps {
  initialItems?: QuotationItem[];
  onChange?: (items: QuotationItem[], totalSum: number) => void;
}

const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export function QuotationTable({ initialItems = [], onChange }: { initialItems?: QuotationItem[]; onChange?: (items: QuotationItem[], total: number) => void }) {
  // Start empty as requested
  const [items, setItems] = useState<QuotationItem[]>(initialItems);
  const [applyVat, setApplyVat] = useState<boolean>(true); // default to checked
  

  // Sync with parent and pass overall total
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (onChange) {
      onChange(items, total);
    }
  }, [items, onChange]);

  // Add a brand new Main Category (e.g., Item 1, Item 2)
  const handleAddMainItem = () => {
    const maxMainNum = items.reduce((max, item) => Math.max(max, item.itemNum), 0);
    const nextMainNum = maxMainNum + 1;

    // Default main category heading row
    const mainHeading: QuotationItem = {
      id: generateId(),
      itemNum: nextMainNum,
      subItemNum: undefined, // Main header doesn't have a sub-item index
      description: '',
      quantity: 0,
      unit: '',
      rate: 0,
      amount: 0,
    };

    // First sub-item under this category (e.g., 1.1)
    const firstSubItem: QuotationItem = {
      id: generateId(),
      itemNum: nextMainNum,
      subItemNum: 1,
      description: '',
      quantity: 1,
      unit: 'NOS',
      rate: 0,
      amount: 0,
    };

    setItems((prev) => [...prev, mainHeading, firstSubItem]);
  };

  // Add a sub-item under a specific parent item (e.g., 1.2 under 1)
  const handleAddSubItem = (parentItemNum: number) => {
    // Find all existing sub-items for this parent
    const existingSubItems = items.filter((item) => item.itemNum === parentItemNum && item.subItemNum !== undefined);
    const nextSubNum = existingSubItems.length + 1;

    const newSubItem: QuotationItem = {
      id: generateId(),
      itemNum: parentItemNum,
      subItemNum: nextSubNum,
      description: '',
      quantity: 1,
      unit: 'NOS',
      rate: 0,
      amount: 0,
    };

    // Insert right after the last sub-item of this parent group
    const lastIndex = items.findLastIndex((item) => item.itemNum === parentItemNum);
    const updatedItems = [...items];
    updatedItems.splice(lastIndex + 1, 0, newSubItem);

    setItems(updatedItems);
  };

  // Handle cell updates (quantity, rate, description, etc.)
  const handleItemChange = (id: string, key: keyof QuotationItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [key]: value };

        if (key === 'quantity' || key === 'rate') {
          const q = typeof updatedItem.quantity === 'number' ? updatedItem.quantity : parseFloat(updatedItem.quantity as any) || 0;
          const r = typeof updatedItem.rate === 'number' ? updatedItem.rate : parseFloat(updatedItem.rate as any) || 0;

          updatedItem.quantity = q;
          updatedItem.rate = r;
          updatedItem.amount = q * r;
        }

        return updatedItem;
      })
    );
  };

  // Delete a specific row
  // Delete a single sub-item and re-index remaining sub-items under the parent
    const handleDeleteSubItem = (id: string, parentItemNum: number) => {
    setItems((prev) => {
        // 1. Remove target sub-item
        const filtered = prev.filter((item) => item.id !== id);

        // 2. Re-index sub-item numbers for this specific parent group
        let subCounter = 1;
        return filtered.map((item) => {
        if (item.itemNum === parentItemNum && item.subItemNum !== undefined) {
            const updated = { ...item, subItemNum: subCounter };
            subCounter += 1;
            return updated;
        }
        return item;
        });
    });
    };

    // Delete an entire main category along with all its child sub-items, then re-index subsequent categories
    const handleDeleteMainCategory = (targetItemNum: number) => {
    setItems((prev) => {
        // 1. Remove the main category and all sub-items sharing this itemNum
        const filtered = prev.filter((item) => item.itemNum !== targetItemNum);

        // 2. Shift and re-index remaining itemNums so numbering remains sequential (1, 2, 3...)
        return filtered.map((item) => {
        if (item.itemNum > targetItemNum) {
            return { ...item, itemNum: item.itemNum - 1 };
        }
        return item;
        });
    });
    };

    const totalContractSum = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    const vatAmount = applyVat ? totalContractSum * 0.05 : 0;
    const grossTotal = totalContractSum + vatAmount;

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
          <Table.Th style={{ width: '140px' , textAlign: 'center'}}>Amount</Table.Th>
          <Table.Th style={{ width: '110px', textAlign: 'center' }}>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={7} style={{ textAlign: 'center', color: 'var(--mantine-color-dimmed)' }} py="xl">
              <Text size="md">No items added. Click <strong>"Add Main Category"</strong> below to start.</Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((item) => {
            const isMainHeader = item.subItemNum === undefined;
            const displayIndex = isMainHeader ? `${item.itemNum}` : `${item.itemNum}.${item.subItemNum}`;

            return (
              <Table.Tr
                key={item.id}
                bg={isMainHeader ? 'var(--mantine-default-hover)' : undefined}
              >
                {/* Item Number Cell */}
                <Table.Td>
                  {isMainHeader ? (
                    <Badge color="brandOrange" variant="filled" circle size="sm">
                      {displayIndex}
                    </Badge>
                  ) : (
                    <Group gap={4} wrap="nowrap" pl="xs">
                      <IconCornerDownRight size={14} style={{ opacity: 0.4 }} />
                      <Text size="sm" fw={600} c="dimmed">
                        {displayIndex}
                      </Text>
                    </Group>
                  )}
                </Table.Td>

                {/* Description Input */}
                <Table.Td>
                  <TextInput
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.currentTarget.value)}
                    placeholder={isMainHeader ? 'Category Heading (e.g., Civil Works)' : 'Task Description...'}
                    variant={isMainHeader ? 'unstyled' : 'default'}
                    fw={isMainHeader ? 700 : 400}
                    size="sm"
                    c={isMainHeader ? 'blue.9' : undefined}
                  />
                </Table.Td>

                {/* Main Header spans Qty, Unit, Rate, Amount or renders inputs */}
                {isMainHeader ? (
                  <Table.Td colSpan={4} />
                ) : (
                  <>
                    <Table.Td>
                      <NumberInput
                        value={item.quantity}
                        onChange={(val) => handleItemChange(item.id, 'quantity', val)}
                        min={0}
                        size="xs"
                        hideControls
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.currentTarget.value)}
                        size="xs"
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        value={item.rate}
                        onChange={(val) => handleItemChange(item.id, 'rate', val)}
                        min={0}
                        decimalScale={2}
                        size="xs"
                        hideControls
                      />
                    </Table.Td>
                    <Table.Td style={{ verticalAlign: 'middle' }}>
                      <Text size="xs" fw={600}>
                        ر.ع.{(item.amount || 0).toLocaleString('en-OM', { minimumFractionDigits: 2 })}
                      </Text>
                    </Table.Td>
                  </>
                )}

                {/* Action Buttons */}
                <Table.Td>
                    <Group gap={4} justify="center" wrap="nowrap">
                        {isMainHeader ? (
                        <>
                            <ActionIcon
                            color="brandOrange" variant="filled"
                            size="sm"
                            title="Add Sub Item"
                            onClick={() => handleAddSubItem(item.itemNum)}
                            >
                            <IconPlus size={14} />
                            </ActionIcon>
                            <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            title="Delete Entire Category"
                            onClick={() => handleDeleteMainCategory(item.itemNum)} // <-- Deletes category + sub-items
                            >
                            <IconTrash size={14} />
                            </ActionIcon>
                        </>
                        ) : (
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            title="Delete Sub Item"
                            onClick={() => handleDeleteSubItem(item.id, item.itemNum)} // <-- Deletes only this sub-item
                        >
                            <IconTrash size={14} />
                        </ActionIcon>
                        )}
                    </Group>
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>

    <Group justify="space-between" mt="md">
      <Button
        variant="outline"
        leftSection={<IconPlus size={14} />}
        size="xs"
        onClick={handleAddMainItem}
      >
        Add Main Category
      </Button>
    </Group>

    <Divider my='md'/>

    <Group justify="space-between" mb="xs">
          <Text size="sm">Market Price Total:</Text>
          <Text size="sm" fw={700}>
            ر.ع.{totalContractSum.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </Group>
        <Group justify="space-between" mb="sm">
            <Checkbox
                label="Apply Tax Levies (VAT 5%)"
                checked={applyVat}
                onChange={(event) => setApplyVat(event.currentTarget.checked)}
                size="xs"
            />
            <Text size="md" fw={700} c={applyVat ? undefined : 'dimmed'}>
                ر.ع.{vatAmount.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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