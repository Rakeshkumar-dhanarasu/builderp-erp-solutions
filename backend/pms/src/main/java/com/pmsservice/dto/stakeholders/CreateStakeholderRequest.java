package com.pmsservice.dto;

import com.pmsservice.enums.StakeholderType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateStakeholderRequest {

	@NotNull(message = "Stakeholder category is required")
	private StakeholderType stakeholderCategory;

	@NotBlank(message = "First name is required")
	@Size(max = 100, message = "First name must not exceed 100 characters")
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(max = 100, message = "Last name must not exceed 100 characters")
	private String lastName;

	@NotNull(message = "Primary phone code is required")
	private Short primaryPhoneCode;

	@NotNull(message = "Primary phone number is required")
	private Long primaryPhoneNum;

    private Short secondaryPhoneCode;

    private Long secondaryPhoneNum;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    @Size(max = 254, message = "Email must not exceed 254 characters")
    private String email;

    @NotBlank(message = "Fill the site address if Customer else fill primary address")
    private String primaryAddress;

    private String secondaryAddress;

    @NotBlank(message = "City is required")
    private String city;

    private String stateOrProvince;

    @NotBlank(message = "Country is required")
    private String country;

    private byte[] relatedDocs;

    private String extraComments;

    @Size(max = 12, message = "Postal code must not exceed 12 characters")
    private String postalCode;

    // Employee-specific field

    private EmployeeDetailRequest employeeDetails;
    // Getters and Setters

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

    public byte[] getRelatedDocs() {
        return relatedDocs;
    }

    public void setRelatedDocs(byte[] relatedDocs) {
        this.relatedDocs = relatedDocs;
    }

    public String getExtraComments() {
        return extraComments;
    }

    public void setExtraComments(String extraComments) {
        this.extraComments = extraComments;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public EmployeeDetailRequest getEmployeeDetails() {
        return employeeDetails;
    }

    public void setEmployeeDetails(EmployeeDetailRequest employeeDetails) {
        this.employeeDetails = employeeDetails;
    }
}