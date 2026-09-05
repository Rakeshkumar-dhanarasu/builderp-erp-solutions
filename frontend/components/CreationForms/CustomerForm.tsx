import { NativeSelect, Divider, SimpleGrid, TextInput, Select, NumberInput, FileInput, Text } from '@mantine/core';

interface FormProps {
  isEditing: boolean;
}

const selectPrefix = (
    <Select 
      data={[
        { label: '+968', value: '+968' },
        { label: '+1', value: '+1' },
        { label: '+91', value: '+91' },
        { label: '+971', value: '+971' },
        { label: '+44', value: '+44' },
      ]}
      rightSection={null}
      defaultValue="+968"
    />
  );

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
        <NumberInput label="Primary Phone Number" placeholder="  4678321932" required hideControls allowNegative={false}
        allowDecimal={false}
        leftSection={selectPrefix}
        leftSectionWidth={60}
        leftSectionPointerEvents="all"/>
        <NumberInput label="Alternative Phone Number" placeholder="  4678321932" hideControls allowNegative={false}
        allowDecimal={false}
        leftSection={selectPrefix}
        leftSectionWidth={60}
        leftSectionPointerEvents="all"/>
        <TextInput label="Mail ID" placeholder="finance@firm.com" type="email" />
      </SimpleGrid>

      <Divider/>
      <TextInput label="Site Address" placeholder="Enter the address of project" required/>
      <TextInput label="Residence Address" placeholder="Enter if residence is different from site address" />
      <SimpleGrid cols={4} spacing="xs">
        <TextInput label="City" placeholder="Chicago" />
        <TextInput label="State / Province" placeholder="IL" />
        <TextInput label="Country Node" placeholder="USA" />
        <TextInput label="Postal Code" placeholder="60001" />
      </SimpleGrid>
    </>
  );
}