import { Divider, SimpleGrid, TextInput, Select, FileInput } from '@mantine/core';

interface FormProps {
  isEditing: boolean;
}

export function SupplierForm({ isEditing }: FormProps) {
  return (
    <>
      <Divider/>
      <SimpleGrid cols={2} spacing="xs">
        <TextInput label="Name" placeholder="e.g., Vertex Infra Corp" required />
        <TextInput label="Primary Phone Number" placeholder="+1 (555) 000-0000" required />
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="xs">
        <TextInput label="Alternative Phone Number" placeholder="+1 (555) 000-0000" />
        <TextInput label="Mail ID" placeholder="vendor@firm.com" type="email" />
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

      <Divider/>
      <SimpleGrid cols={3} spacing="xs">
        <Select 
          label="Vendor Category" 
          data={["Material Supplier", "Equipment Lessor", "Logistics Service Provider", "Utility Utility"]} 
          defaultValue="Material Supplier"
        />
        <TextInput label="Material / Service Focus" placeholder="e.g., ReadyMix Concrete, Reinforced Rebar" />
        <Select 
          label="Payment Terms" 
          data={["Advance Payment", "Net 30", "Net 45", "Net 60"]} 
          defaultValue="Net 45"
        />
      </SimpleGrid>
    </>
  );
}