package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BudgetCategoryBalanceId implements Serializable {

    @Column(name = "budget_id", nullable = false)
    private Integer budgetId;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    public BudgetCategoryBalanceId() {
    }

    public BudgetCategoryBalanceId(Integer budgetId, String category) {
        this.budgetId = budgetId;
        this.category = category;
    }

    public Integer getBudgetId() {
        return budgetId;
    }

    public String getCategory() {
        return category;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof BudgetCategoryBalanceId that)) {
            return false;
        }
        return Objects.equals(budgetId, that.budgetId)
                && Objects.equals(category, that.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(budgetId, category);
    }
}