import { Divider, SimpleGrid, TextInput, Select, FileInput } from '@mantine/core';

interface FormProps {
  isEditing: boolean;
}

export function SubContractorForm({ isEditing }: FormProps) {
  return (
    <>
      <Divider/>
      <SimpleGrid cols={2} spacing="xs">
        <TextInput label="Name" placeholder="e.g., Vertex Infra Corp" required />
        <TextInput label="Primary Phone Number" placeholder="+1 (555) 000-0000" required />
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="xs">
        <TextInput label="Mail ID" placeholder="contracts@firm.com" type="email" />        
        <TextInput label="Alternative Phone Number" placeholder="+1 (555) 000-0000" />
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
      <SimpleGrid cols={2} spacing="xs">
        <Select 
          label="Service Type" 
          data={["Labour Supply", "Material Supply", "Others"]} 
          placeholder="Select type of service"
          clearable
        />
        <Select 
          label="Payment Terms Allocation" 
          data={["Milestone Progress Check", "Bi-Weekly Measured Works", "Net 30"]} 
          placeholder="Select payroll category"
          clearable
        />
      </SimpleGrid>
    </>
  );
}