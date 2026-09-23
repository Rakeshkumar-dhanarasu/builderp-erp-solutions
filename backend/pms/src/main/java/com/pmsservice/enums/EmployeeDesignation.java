package com.pmsservice.enums;

import jakarta.persistence.EnumeratedValue;

public enum EmployeeDesignation {

    OPERATIONAL_MANAGER("Operational Manager"),
    STOREKEEPER("Storekeeper"),
    FOREMAN("Foreman"),
    PROJECT_ENGINEER("Project Engineer"),
    ACCOUNTANT("Accountant");

    @EnumeratedValue
	private final String databaseValue;

    EmployeeDesignation(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}