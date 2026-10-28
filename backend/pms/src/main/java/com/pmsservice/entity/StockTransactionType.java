
package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stock_transaction_type", schema = "public")
public class StockTransactionType {

    @Id
    @Column(name = "stock_transaction_type_id", nullable = false)
    private Short stockTransactionTypeId;

    @Column(name = "stock_transaction_type_name", nullable = false, unique = true, length = 50)
    private String stockTransactionTypeName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "activity_status", nullable = false)
    private Boolean activityStatus = true;

    public Short getStockTransactionTypeId() {
        return stockTransactionTypeId;
    }

    public void setStockTransactionTypeId(Short stockTransactionTypeId) {
        this.stockTransactionTypeId = stockTransactionTypeId;
    }

    public String getStockTransactionTypeName() {
        return stockTransactionTypeName;
    }

    public void setStockTransactionTypeName(String stockTransactionTypeName) {
        this.stockTransactionTypeName = stockTransactionTypeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActivityStatus() {
        return activityStatus;
    }

    public void setActivityStatus(Boolean activityStatus) {
        this.activityStatus = activityStatus;
    }
}
