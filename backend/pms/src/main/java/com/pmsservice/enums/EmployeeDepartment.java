package com.pmsservice.enums;

import jakarta.persistence.EnumeratedValue;

public enum EmployeeDepartment {

    ADMINISTRATION("Administration"),
    FINANCE("Finance"),
    PURCHASE("Purchase"),
    SALES("Sales"),
    PROJECT_MANAGEMENT("Project Management");

    @EnumeratedValue
	private final String databaseValue;

    EmployeeDepartment(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}