package com.pmsservice.dto.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PoQuotationResponse(
    String poQuotationId,
    Integer vendorId,
    BigDecimal quotationAmount,
    LocalDate creationDate,
    Integer createdBy,
    String status,
    byte[] receiptAttached
) {}
