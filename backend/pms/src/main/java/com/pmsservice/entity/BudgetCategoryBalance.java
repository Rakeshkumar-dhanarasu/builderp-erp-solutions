package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.EmbeddedId;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "budget_category_balance", schema = "public")
public class BudgetCategoryBalance {

    @EmbeddedId
    private BudgetCategoryBalanceId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "budget_id",
            referencedColumnName = "budget_id",
            insertable = false,
            updatable = false
    )
    private BudgetInfo budget;

    @Column(name = "remaining_amount", nullable = false, precision = 12, scale = 3)
    private BigDecimal remainingAmount;

    @Column(name = "modified_at", nullable = false)
    private LocalDate modifiedAt;

    public BudgetCategoryBalance() {
    }

    public BudgetCategoryBalanceId getId() {
        return id;
    }

    public void setId(BudgetCategoryBalanceId id) {
        this.id = id;
    }

    public BudgetInfo getBudget() {
        return budget;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public LocalDate getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDate modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}