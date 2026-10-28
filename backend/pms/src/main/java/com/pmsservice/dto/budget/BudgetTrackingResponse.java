package com.pmsservice.dto.budget;

import java.math.BigDecimal;
import java.util.List;

import com.pmsservice.projection.BudgetTransactionProjection;

public class BudgetTrackingResponse {

    private Integer budgetId;
    private BigDecimal totalCategoryAllocated;
    private BigDecimal totalCategoryUsed;
    private BigDecimal totalCategoryRemaining;
    private List<BudgetCategoryTrackingResponse> categories;
    private List<BudgetTransactionProjection> transactions;

    public Integer getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Integer budgetId) {
        this.budgetId = budgetId;
    }

    public BigDecimal getTotalCategoryAllocated() {
        return totalCategoryAllocated;
    }

    public void setTotalCategoryAllocated(BigDecimal totalCategoryAllocated) {
        this.totalCategoryAllocated = totalCategoryAllocated;
    }

    public BigDecimal getTotalCategoryUsed() {
        return totalCategoryUsed;
    }

    public void setTotalCategoryUsed(BigDecimal totalCategoryUsed) {
        this.totalCategoryUsed = totalCategoryUsed;
    }

    public BigDecimal getTotalCategoryRemaining() {
        return totalCategoryRemaining;
    }

    public void setTotalCategoryRemaining(BigDecimal totalCategoryRemaining) {
        this.totalCategoryRemaining = totalCategoryRemaining;
    }

    public List<BudgetCategoryTrackingResponse> getCategories() {
        return categories;
    }

    public void setCategories(List<BudgetCategoryTrackingResponse> categories) {
        this.categories = categories;
    }

    public List<BudgetTransactionProjection> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<BudgetTransactionProjection> transactions) {
        this.transactions = transactions;
    }
}
