import { Divider, SimpleGrid, TextInput, Select, NumberInput, FileInput, Text } from '@mantine/core';

interface FormProps {
  isEditing: boolean;
}

export function CustomerForm({ isEditing }: FormProps) {
  return (
    <>
      <Divider/>
      <SimpleGrid cols={2} spacing="xs">
        <Select
          label="Customer Type"
          data={["Individual","Organization"]}
        />
        <TextInput label="Name" required />
      </SimpleGrid>

      <SimpleGrid cols={3} spacing="xs">
        <TextInput label="Primary Phone Number" placeholder="+1 (555) 000-0000" required />
        <TextInput label="Alternative Phone Number" placeholder="+1 (555) 000-0000" />
        <TextInput label="Mail ID" placeholder="finance@firm.com" type="email" />
      </SimpleGrid>

      <Divider/>
      <TextInput label="Address Line 1" placeholder="Primary address" required/>
      <TextInput label="Address Line 2" placeholder="Alternate address" />
      <SimpleGrid cols={4} spacing="xs">
        <TextInput label="City" placeholder="Chicago" />
        <TextInput label="State / Province" placeholder="IL" />
        <TextInput label="Country Node" placeholder="USA" />
        <TextInput label="Postal Code" placeholder="60001" />
      </SimpleGrid>
    </>
  );
}