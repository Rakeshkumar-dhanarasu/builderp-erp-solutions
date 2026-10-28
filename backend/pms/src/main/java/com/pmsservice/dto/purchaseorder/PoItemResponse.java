package com.pmsservice.dto.purchaseorder;

import java.math.BigDecimal;

public record PoItemResponse(
    Integer itemRequestId,
    Short itemId,
    Integer itemQuantity,
    BigDecimal itemUnitPrice,
    BigDecimal itemTotalPrice
) {}
