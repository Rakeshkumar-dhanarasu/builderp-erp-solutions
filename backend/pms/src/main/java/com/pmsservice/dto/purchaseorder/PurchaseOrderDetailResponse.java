
package com.pmsservice.dto.purchaseorder;

import java.time.LocalDate;
import java.util.List;

public record PurchaseOrderDetailResponse(
    String poRequestId,
    String projectId,
    Integer createdBy,
    LocalDate createdAt,
    Integer modifiedBy,
    LocalDate modifiedAt,
    String status,
    List<PoItemResponse> items,
    List<PoQuotationResponse> quotations
) {}
