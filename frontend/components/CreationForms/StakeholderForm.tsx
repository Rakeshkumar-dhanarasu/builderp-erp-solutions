"use client";

import {
  Divider,
  SimpleGrid,
  TextInput,
  Select,
  NumberInput,
  Textarea,
} from "@mantine/core";

import {
  EmployeeDetailsForm,
  EmployeeDetailsFormData,
} from "./EmployeeDetailsForm";

export type StakeholderCategory =
  | "CUSTOMER"
  | "SUPPLIER"
  | "SUB_CONTRACTOR"
  | "EMPLOYEE";

export interface StakeholderFormData {
  stakeholderCategory: StakeholderCategory;
  firstName: string;
  lastName: string;
  primaryPhoneCode: string;
  primaryPhoneNum: string;
  secondaryPhoneCode: string;
  secondaryPhoneNum: string;
  email: string;
  primaryAddress: string;
  secondaryAddress: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalCode: string;
  extraComments: string;
  employeeDetails: EmployeeDetailsFormData;
}

interface StakeholderFormProps {
  value: StakeholderFormData;
  onChange: (value: StakeholderFormData) => void;
  isEditing?: boolean;
}

const phoneCodeOptions = [
  { label: "+968", value: "968" },
  { label: "+91", value: "91" },
  { label: "+971", value: "971" },
  { label: "+1", value: "1" },
  { label: "+44", value: "44" },
];

const stakeholderTypeOptions = [
  { label: "Customer", value: "CUSTOMER" },
  { label: "Supplier", value: "SUPPLIER" },
  { label: "Sub-contractor", value: "SUB_CONTRACTOR" },
  { label: "Employee", value: "EMPLOYEE" },
];

export const initialEmployeeDetails: EmployeeDetailsFormData = {
  employeeRole: null,
  employeeDept: null,
  payrollStructure: null,
  salary: null,
};

export const initialStakeholderFormData: StakeholderFormData = {
  stakeholderCategory: "CUSTOMER",
  firstName: "",
  lastName: "",
  primaryPhoneCode: "968",
  primaryPhoneNum: "",
  secondaryPhoneCode: "968",
  secondaryPhoneNum: "",
  email: "",
  primaryAddress: "",
  secondaryAddress: "",
  city: "",
  stateOrProvince: "",
  country: "",
  postalCode: "",
  extraComments: "",
  employeeDetails: {
    ...initialEmployeeDetails,
  },
};

export function StakeholderForm({
  value,
  onChange,
  isEditing = false,
}: StakeholderFormProps) {
  const isEmployee = value.stakeholderCategory === "EMPLOYEE";

  const updateField = <K extends keyof StakeholderFormData>(
    field: K,
    fieldValue: StakeholderFormData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleStakeholderTypeChange = (selected: string | null) => {
    if (!selected) return;

    const stakeholderCategory = selected as StakeholderCategory;

    onChange({
      ...value,
      stakeholderCategory,
      employeeDetails:
        stakeholderCategory === "EMPLOYEE"
          ? value.employeeDetails
          : { ...initialEmployeeDetails },
    });
  };

  const addressLabel = isEmployee
    ? "Primary Address"
    : value.stakeholderCategory === "CUSTOMER"
      ? "Site Address"
      : "Primary Address";

  const addressPlaceholder =
    value.stakeholderCategory === "CUSTOMER"
      ? "Enter the address of the project/site"
      : "Enter primary address";

  const secondaryAddressLabel =
    value.stakeholderCategory === "CUSTOMER"
      ? "Residence Address"
      : "Secondary Address";

  const secondaryAddressPlaceholder =
    value.stakeholderCategory === "CUSTOMER"
      ? "Enter if residence is different from site address"
      : "Enter alternate address";

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <Select
          label="Stakeholder Type"
          placeholder="Select stakeholder type"
          data={stakeholderTypeOptions}
          value={value.stakeholderCategory}
          onChange={handleStakeholderTypeChange}
          required
          disabled={isEditing}
        />
        <div />
      </SimpleGrid>

      <Divider my="sm" />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          value={value.firstName}
          onChange={(event) => updateField("firstName", event.currentTarget.value)}
          required
        />
        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          value={value.lastName}
          onChange={(event) => updateField("lastName", event.currentTarget.value)}
          required
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs" mt="xs">
        <NumberInput
          label="Primary Phone Number"
          placeholder="4678321932"
          value={value.primaryPhoneNum === "" ? "" : Number(value.primaryPhoneNum)}
          onChange={(numberValue) =>
            updateField(
              "primaryPhoneNum",
              typeof numberValue === "number" ? String(numberValue) : ""
            )
          }
          leftSection={
            <Select
              data={phoneCodeOptions}
              value={value.primaryPhoneCode}
              onChange={(selected) => updateField("primaryPhoneCode", selected ?? "968")}
              variant="unstyled"
              size="xs"
              searchable
            />
          }
          leftSectionWidth={72}
          leftSectionPointerEvents="all"
          hideControls
          allowNegative={false}
          allowDecimal={false}
          required
        />

        <NumberInput
          label="Secondary Phone Number"
          placeholder="4678321932"
          value={value.secondaryPhoneNum === "" ? "" : Number(value.secondaryPhoneNum)}
          onChange={(numberValue) =>
            updateField(
              "secondaryPhoneNum",
              typeof numberValue === "number" ? String(numberValue) : ""
            )
          }
          leftSection={
            <Select
              data={phoneCodeOptions}
              value={value.secondaryPhoneCode}
              onChange={(selected) => updateField("secondaryPhoneCode", selected ?? "968")}
              variant="unstyled"
              size="xs"
              searchable
            />
          }
          leftSectionWidth={72}
          leftSectionPointerEvents="all"
          hideControls
          allowNegative={false}
          allowDecimal={false}
        />

        <TextInput
          label="Email"
          placeholder="name@company.com"
          type="email"
          value={value.email}
          onChange={(event) => updateField("email", event.currentTarget.value)}
          required
        />
      </SimpleGrid>

      <Divider my="sm" />

      <TextInput
        label={addressLabel}
        placeholder={addressPlaceholder}
        value={value.primaryAddress}
        onChange={(event) => updateField("primaryAddress", event.currentTarget.value)}
        required
      />

      <TextInput
        mt="xs"
        label={secondaryAddressLabel}
        placeholder={secondaryAddressPlaceholder}
        value={value.secondaryAddress}
        onChange={(event) => updateField("secondaryAddress", event.currentTarget.value)}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs" mt="xs">
        <TextInput
          label="City"
          placeholder="Chennai"
          value={value.city}
          onChange={(event) => updateField("city", event.currentTarget.value)}
          required
        />
        <TextInput
          label="State / Province"
          placeholder="Tamil Nadu"
          value={value.stateOrProvince}
          onChange={(event) => updateField("stateOrProvince", event.currentTarget.value)}
        />
        <TextInput
          label="Country"
          placeholder="India"
          value={value.country}
          onChange={(event) => updateField("country", event.currentTarget.value)}
          required
        />
        <TextInput
          label="Postal Code"
          placeholder="600001"
          value={value.postalCode}
          onChange={(event) => updateField("postalCode", event.currentTarget.value)}
        />
      </SimpleGrid>

      {isEmployee && (
        <>
          <Divider my="sm" />
          <EmployeeDetailsForm
            value={value.employeeDetails}
            onChange={(employeeDetails) => updateField("employeeDetails", employeeDetails)}
          />
        </>
      )}

      <Divider my="sm" />

      <Textarea
        label="Additional Information"
        placeholder="Enter any additional information"
        minRows={3}
        autosize
        value={value.extraComments}
        onChange={(event) => updateField("extraComments", event.currentTarget.value)}
      />
    </>
  );
}