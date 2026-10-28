package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "budget_transaction_type", schema = "public")
public class BudgetTransactionType {

    @Id
    @Column(name = "transaction_type_id", nullable = false)
    private Short transactionTypeId;

    @Column(name = "transaction_type_name", nullable = false, length = 40)
    private String transactionTypeName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "activity_status", nullable = false)
    private Boolean activityStatus;

    public Short getTransactionTypeId() {
        return transactionTypeId;
    }

    public String getTransactionTypeName() {
        return transactionTypeName;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getActivityStatus() {
        return activityStatus;
    }
}