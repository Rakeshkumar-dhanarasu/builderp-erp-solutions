package com.pmsservice.dto.stakeholders;

import java.math.BigDecimal;

import com.pmsservice.enums.EmployeeDepartment;
import com.pmsservice.enums.EmployeeDesignation;
import com.pmsservice.enums.EmployeePayroll;

public class EmployeeDetailRequest {

    private EmployeeDesignation employeeRole;
    private EmployeeDepartment employeeDept;
    private EmployeePayroll payrollStructure;
    private BigDecimal salary;

    public EmployeeDetailRequest() {
    }

    public EmployeeDesignation getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(EmployeeDesignation employeeRole) {
        this.employeeRole = employeeRole;
    }

    public EmployeeDepartment getEmployeeDept() {
        return employeeDept;
    }

    public void setEmployeeDept(EmployeeDepartment employeeDept) {
        this.employeeDept = employeeDept;
    }

    public EmployeePayroll getPayrollStructure() {
        return payrollStructure;
    }

    public void setPayrollStructure(EmployeePayroll payrollStructure) {
        this.payrollStructure = payrollStructure;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
}