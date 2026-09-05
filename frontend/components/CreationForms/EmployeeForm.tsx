import { Divider, SimpleGrid, TextInput, Select, FileInput, NumberInput } from '@mantine/core';

interface FormProps {
  isEditing: boolean;
}

export function EmployeeForm({ isEditing }: FormProps) {
  return (
    <>
      <Divider />
      <SimpleGrid cols={2} spacing="xs">
        <TextInput label="Employee Name" placeholder="e.g., J Jonah Jameson" required />
        <TextInput label="Primary Phone Number" placeholder="+1 (555) 000-0000" required />
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="xs"> 
        <TextInput label="Mail ID" placeholder="emp@firm.com" type="email" />       
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

      <Divider />
      <SimpleGrid cols={4} spacing="xs">
        <Select
          label="Designation"
          data={["Operational Manager", "Project Engineer", "Foreman", "Storekeeper", "Accountant"]}
          placeholder="Select Designation"
          clearable
          required
        />
        <Select 
          label="Department Unit" 
          data={["Project Management", "Finance", "Sales", "Purchase",'Administration']} 
          placeholder="Select Department"
          clearable
        />
        <Select 
          label="Payroll Structure" 
          data={["Monthly Salary", "Bi-Weekly Payroll", "Contract Hourly"]} 
          placeholder="Select Structure"
          clearable
        />
        <NumberInput label="Salary" placeholder='Enter in OMR value'/>
      </SimpleGrid>
    </>
  );
}