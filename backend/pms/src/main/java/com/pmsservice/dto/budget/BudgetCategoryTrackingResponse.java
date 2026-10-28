
package com.pmsservice.dto.budget;

import java.math.BigDecimal;

public class BudgetCategoryTrackingResponse {

    private String category;
    private BigDecimal allocated;
    private BigDecimal used;
    private BigDecimal remaining;

    public BudgetCategoryTrackingResponse(
            String category,
            BigDecimal allocated,
            BigDecimal used,
            BigDecimal remaining
    ) {
        this.category = category;
        this.allocated = allocated;
        this.used = used;
        this.remaining = remaining;
    }

    public String getCategory() {
        return category;
    }

    public BigDecimal getAllocated() {
        return allocated;
    }

    public BigDecimal getUsed() {
        return used;
    }

    public BigDecimal getRemaining() {
        return remaining;
    }
}
