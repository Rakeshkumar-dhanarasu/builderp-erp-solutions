package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.SequenceGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_transaction", schema = "public")
public class BudgetTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "budget_transaction_seq")
    @SequenceGenerator(
            name = "budget_transaction_seq",
            sequenceName = "budget_transaction_id_seq",
            allocationSize = 1
    )
    @Column(name = "budget_transaction_id", nullable = false)
    private Integer budgetTransactionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "budget_id", nullable = false)
    private BudgetInfo budget;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_type_id", nullable = false)
    private BudgetTransactionType transactionType;

    @Column(name = "amount_change", nullable = false, precision = 12, scale = 3)
    private BigDecimal amountChange;

    @Column(name = "balance_before", nullable = false, precision = 12, scale = 3)
    private BigDecimal balanceBefore;

    @Column(name = "balance_after", nullable = false, precision = 12, scale = 3)
    private BigDecimal balanceAfter;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "performed_by", nullable = false)
    private Integer performedBy;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    public Integer getBudgetTransactionId() {
        return budgetTransactionId;
    }

    public BudgetInfo getBudget() {
        return budget;
    }

    public void setBudget(BudgetInfo budget) {
        this.budget = budget;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BudgetTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(BudgetTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmountChange() {
        return amountChange;
    }

    public void setAmountChange(BigDecimal amountChange) {
        this.amountChange = amountChange;
    }

    public BigDecimal getBalanceBefore() {
        return balanceBefore;
    }

    public void setBalanceBefore(BigDecimal balanceBefore) {
        this.balanceBefore = balanceBefore;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(BigDecimal balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(Integer performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getPerformedAt() {
        return performedAt;
    }

    public void setPerformedAt(LocalDateTime performedAt) {
        this.performedAt = performedAt;
    }
}