package com.pmsservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.pmsservice.enums.QuotationStatus;

public class QuotationVersionHistoryResponse {

    private Short versionNumber;

    private LocalDate draftedAt;

    private LocalDate expiredAt;

    private QuotationStatus quoteStatus;

    private BigDecimal marketPrice;

    private BigDecimal discountAmount;

    private Short taxPercent;

    private BigDecimal total;

    private String currencyCode;

    private String draftedBy;

    private String addComments;

    public Short getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Short versionNumber) {
        this.versionNumber = versionNumber;
    }

    public LocalDate getDraftedAt() {
        return draftedAt;
    }

    public void setDraftedAt(LocalDate draftedAt) {
        this.draftedAt = draftedAt;
    }

    public LocalDate getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(LocalDate expiredAt) {
        this.expiredAt = expiredAt;
    }

    public QuotationStatus getQuoteStatus() {
        return quoteStatus;
    }

    public void setQuoteStatus(QuotationStatus quoteStatus) {
        this.quoteStatus = quoteStatus;
    }

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Short getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(Short taxPercent) {
        this.taxPercent = taxPercent;
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

    public String getDraftedBy() {
        return draftedBy;
    }

    public void setDraftedBy(String draftedBy) {
        this.draftedBy = draftedBy;
    }

    public String getAddComments() {
        return addComments;
    }

    public void setAddComments(String addComments) {
        this.addComments = addComments;
    }
}