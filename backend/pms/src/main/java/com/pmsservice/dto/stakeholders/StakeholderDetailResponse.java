package com.pmsservice.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.pmsservice.enums.EmployeeDepartment;
import com.pmsservice.enums.EmployeeDesignation;
import com.pmsservice.enums.EmployeePayroll;
import com.pmsservice.enums.StakeholderType;

public class StakeholderDetailResponse {

    private Integer stakeholderId;

    private StakeholderType stakeholderCategory;

    private String firstName;

    private String lastName;

    private Short primaryPhoneCode;

    private Long primaryPhoneNum;

    private Short secondaryPhoneCode;

    private Long secondaryPhoneNum;

    private String email;

    private String primaryAddress;

    private String secondaryAddress;

    private String city;

    private String stateOrProvince;

    private String country;

    private String postalCode;

    private String extraComments;

    private String createdBy;

    private Instant createdDate;

    private String modifiedBy;

    private Instant modifiedDate;

    private Boolean active;

    // Employee-specific fields

    private EmployeeDesignation employeeRole;

    private EmployeeDepartment employeeDept;

    private EmployeePayroll payrollStructure;

    private BigDecimal salary;


    public Integer getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(Integer stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public StakeholderType getStakeholderCategory() {
        return stakeholderCategory;
    }

    public void setStakeholderCategory(StakeholderType stakeholderCategory) {
        this.stakeholderCategory = stakeholderCategory;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Short getPrimaryPhoneCode() {
        return primaryPhoneCode;
    }

    public void setPrimaryPhoneCode(Short primaryPhoneCode) {
        this.primaryPhoneCode = primaryPhoneCode;
    }

    public Long getPrimaryPhoneNum() {
        return primaryPhoneNum;
    }

    public void setPrimaryPhoneNum(Long primaryPhoneNum) {
        this.primaryPhoneNum = primaryPhoneNum;
    }

    public Short getSecondaryPhoneCode() {
        return secondaryPhoneCode;
    }

    public void setSecondaryPhoneCode(Short secondaryPhoneCode) {
        this.secondaryPhoneCode = secondaryPhoneCode;
    }

    public Long getSecondaryPhoneNum() {
        return secondaryPhoneNum;
    }

    public void setSecondaryPhoneNum(Long secondaryPhoneNum) {
        this.secondaryPhoneNum = secondaryPhoneNum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPrimaryAddress() {
        return primaryAddress;
    }

    public void setPrimaryAddress(String primaryAddress) {
        this.primaryAddress = primaryAddress;
    }

    public String getSecondaryAddress() {
        return secondaryAddress;
    }

    public void setSecondaryAddress(String secondaryAddress) {
        this.secondaryAddress = secondaryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateOrProvince() {
        return stateOrProvince;
    }

    public void setStateOrProvince(String stateOrProvince) {
        this.stateOrProvince = stateOrProvince;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getExtraComments() {
        return extraComments;
    }

    public void setExtraComments(String extraComments) {
        this.extraComments = extraComments;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Instant getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Instant modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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