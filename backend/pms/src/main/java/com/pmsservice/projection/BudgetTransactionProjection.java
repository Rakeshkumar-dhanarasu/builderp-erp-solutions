package com.pmsservice.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface BudgetTransactionProjection {

    Integer getBudgetTransactionId();

    String getCategory();

    Short getTransactionTypeId();

    String getTransactionTypeName();

    BigDecimal getAmountChange();

    BigDecimal getBalanceBefore();

    BigDecimal getBalanceAfter();

    String getReferenceId();

    String getDescription();

    Integer getPerformedBy();

    LocalDateTime getPerformedAt();
}