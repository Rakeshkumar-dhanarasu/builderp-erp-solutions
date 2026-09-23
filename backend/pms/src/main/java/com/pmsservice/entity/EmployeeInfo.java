package com.pmsservice.entity;

import java.math.BigDecimal;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.pmsservice.enums.EmployeeDepartment;
import com.pmsservice.enums.EmployeeDesignation;
import com.pmsservice.enums.EmployeePayroll;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee_info")
public class EmployeeInfo {

    @Id
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
        name = "employee_role",
        nullable = false,
        columnDefinition = "emp_desg"
    )
    private EmployeeDesignation employeeRole;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
        name = "employee_dept",
        nullable = false,
        columnDefinition = "emp_dept"
    )
    private EmployeeDepartment employeeDept;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
        name = "payroll_structure",
        nullable = false,
        columnDefinition = "emp_pay"
    )
    private EmployeePayroll payrollStructure;

    @Column(
        name = "salary",
        nullable = false,
        precision = 15,
        scale = 2
    )
    private BigDecimal salary;

    public EmployeeInfo() {
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
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