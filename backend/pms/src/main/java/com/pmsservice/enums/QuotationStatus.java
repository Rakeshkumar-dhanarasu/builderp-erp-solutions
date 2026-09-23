package com.pmsservice.enums;

import jakarta.persistence.EnumeratedValue;

public enum QuotationStatus {

    DRAFTING("Drafting"),
    SENT_TO_CUSTOMER("Sent to Customer"),
    ACCEPTED("Accepted"),
    REJECTED("Rejected");

    @EnumeratedValue
    private final String databaseValue;

    QuotationStatus(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}