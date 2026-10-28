package com.pmsservice.dto.itemstocks;

import java.time.LocalDate;

public record ItemStockResponse(
    Integer itemStockId,
    Short itemId,
    String itemName,
    String itemCategory,
    Integer itemQuantity,
    LocalDate stockedAt,
    Integer stockedBy,
    String projectId,
    String poRequestId
) {}