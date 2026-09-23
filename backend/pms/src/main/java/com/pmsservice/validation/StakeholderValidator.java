package com.pmsservice.validation;

import com.pmsservice.dto.CreateStakeholderRequest;
import com.pmsservice.dto.EmployeeDetailRequest;
import com.pmsservice.dto.UpdateStakeholderRequest;
import com.pmsservice.enums.StakeholderType;

import org.springframework.stereotype.Component;

@Component
public class StakeholderValidator {

    public void validate(CreateStakeholderRequest request) {

        validateEmployeeRules(
                request.getStakeholderCategory(),
                request.getEmployeeDetails()
        );
    }

    public void validate(UpdateStakeholderRequest request) {

        validateEmployeeRules(
                request.getStakeholderCategory(),
                request.getEmployeeDetails()
        );
    }

    private void validateEmployeeRules(
            StakeholderType stakeholderType,
            EmployeeDetailRequest employeeDetails) {

        if (stakeholderType == null) {
            return;
        }

        if (stakeholderType == StakeholderType.EMPLOYEE) {

            if (employeeDetails == null) {
                throw new IllegalArgumentException(
                        "Employee details are required for an employee stakeholder"
                );
            }

            if (employeeDetails.getEmployeeRole() == null) {
                throw new IllegalArgumentException(
                        "Employee designation is required for an employee stakeholder"
                );
            }

            if (employeeDetails.getEmployeeDept() == null) {
                throw new IllegalArgumentException(
                        "Employee department is required for an employee stakeholder"
                );
            }

            if (employeeDetails.getPayrollStructure() == null) {
                throw new IllegalArgumentException(
                        "Employee payroll structure is required for an employee stakeholder"
                );
            }

            if (employeeDetails.getSalary() == null) {
                throw new IllegalArgumentException(
                        "Employee salary is required for an employee stakeholder"
                );
            }

            if (employeeDetails.getSalary().signum() < 0) {
                throw new IllegalArgumentException(
                        "Employee salary cannot be negative"
                );
            }

        } else {

            if (employeeDetails != null) {
                throw new IllegalArgumentException(
                        "Employee details are not allowed for non-employee stakeholders"
                );
            }
        }
    }
}