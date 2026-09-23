package com.pmsservice.enums;

import jakarta.persistence.EnumeratedValue;

public enum StakeholderType {

    CUSTOMER("Customer"),
    SUPPLIER("Supplier"),
    SUB_CONTRACTOR("Sub-Contractor"),
    EMPLOYEE("Employee");

    @EnumeratedValue
    private final String databaseValue;

    StakeholderType(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}