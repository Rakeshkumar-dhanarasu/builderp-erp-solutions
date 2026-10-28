package com.pmsservice.dto.purchaseorder;

import java.time.LocalDate;

public record PurchaseOrderSummaryResponse(
    String poRequestId,
    String projectId,
    Integer createdBy,
    LocalDate createdAt,
    Integer modifiedBy,
    LocalDate modifiedAt,
    String status
) {}