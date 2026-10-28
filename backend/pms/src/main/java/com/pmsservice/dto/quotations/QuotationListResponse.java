package com.pmsservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class QuotationListResponse {

    private String quotationId;
    private String customer;
    private String quoteStatus;
    private Short versionNumber;
    private BigDecimal total;
    private String currencyCode;
    private LocalDate draftedAt;

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getQuoteStatus() {
        return quoteStatus;
    }

    public void setQuoteStatus(String quoteStatus) {
        this.quoteStatus = quoteStatus;
    }

    public Short getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Short versionNumber) {
        this.versionNumber = versionNumber;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public LocalDate getDraftedAt() {
        return draftedAt;
    }

    public void setDraftedAt(LocalDate draftedAt) {
        this.draftedAt = draftedAt;
    }
}