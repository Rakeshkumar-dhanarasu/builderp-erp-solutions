package com.pmsservice.enums;

import jakarta.persistence.EnumeratedValue;

public enum EmployeePayroll {

    MONTHLY_SALARY("Monthly Salary"),
    HOURLY_WAGES("Hourly Wages"),
    PIECE_RATE_PAY("Piece-rate Pay");

    @EnumeratedValue
	private final String databaseValue;

    EmployeePayroll(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}