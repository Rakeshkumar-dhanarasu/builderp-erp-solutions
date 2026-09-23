"use client";

import {
  SimpleGrid,
  Select,
  NumberInput,
} from "@mantine/core";

export interface EmployeeDetailsFormData {
  employeeRole: string | null;
  employeeDept: string | null;
  payrollStructure: string | null;
  salary: number | null;
}

interface EmployeeDetailsFormProps {
  value: EmployeeDetailsFormData;
  onChange: (value: EmployeeDetailsFormData) => void;
}

const designationOptions = [
  {
    label: "Operational Manager",
    value: "OPERATIONAL_MANAGER",
  },
  {
    label: "Project Engineer",
    value: "PROJECT_ENGINEER",
  },
  {
    label: "Foreman",
    value: "FOREMAN",
  },
  {
    label: "Storekeeper",
    value: "STOREKEEPER",
  },
  {
    label: "Accountant",
    value: "ACCOUNTANT",
  },
];

const departmentOptions = [
  {
    label: "Administration",
    value: "ADMINISTRATION",
  },
  {
    label: "Finance",
    value: "FINANCE",
  },
  {
    label: "Purchase",
    value: "PURCHASE",
  },
  {
    label: "Sales",
    value: "SALES",
  },
  {
    label: "Project Management",
    value: "PROJECT_MANAGEMENT",
  },
];

const payrollOptions = [
  {
    label: "Monthly Salary",
    value: "MONTHLY_SALARY",
  },
  {
    label: "Hourly Wages",
    value: "HOURLY_WAGES",
  },
  {
    label: "Piece-rate Pay",
    value: "PIECE_RATE_PAY",
  },
];

export function EmployeeDetailsForm({
  value,
  onChange,
}: EmployeeDetailsFormProps) {
  const updateField = (
    field: keyof EmployeeDetailsFormData,
    fieldValue: string | number | null
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
      <Select
        label="Designation"
        placeholder="Select designation"
        data={designationOptions}
        value={value.employeeRole}
        onChange={(selected) =>
          updateField("employeeRole", selected)
        }
        clearable
        required
      />

      <Select
        label="Department"
        placeholder="Select department"
        data={departmentOptions}
        value={value.employeeDept}
        onChange={(selected) =>
          updateField("employeeDept", selected)
        }
        clearable
        required
      />

      <Select
        label="Payroll Structure"
        placeholder="Select payroll structure"
        data={payrollOptions}
        value={value.payrollStructure}
        onChange={(selected) =>
          updateField("payrollStructure", selected)
        }
        clearable
        required
      />

      <NumberInput
        label="Salary"
        placeholder="Enter salary"
        value={value.salary ?? ""}
        onChange={(value) => {
          updateField(
            "salary",
            value === "" ? null : Number(value)
          );
        }}
        min={0}
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator=","
        required
      />
    </SimpleGrid>
  );
}