package com.pmsservice.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "quotation_versions", schema = "public")
@IdClass(QuotationVersionId.class)
public class QuotationVersion {

    @Id
    @Column(name = "quotation_id", nullable = false, length = 12)
    private String quotationId;

    @Id
    @Column(name = "version_number", nullable = false)
    private Short versionNumber;

    @Column(name = "drafted_at", nullable = false)
    private LocalDate draftedAt;

    @Column(name = "drafted_by", nullable = false)
    private String draftedBy;
    
    @Column(name = "expired_at", nullable = false)
    private LocalDate expiredAt;

    @Column(name = "quote_status", nullable = false)
    private Short quoteStatus;

    @Column(name = "add_comments")
    private String addComments;

    @Column(name = "market_price", nullable = false, precision = 12, scale = 3)
    private BigDecimal marketPrice;

    @Column(name = "tax_percent")
    private Short taxPercent;

    @Column(name = "discount_amount", precision = 7, scale = 3)
    private BigDecimal discountAmount;

    @Column(name = "total", nullable = false, precision = 13, scale = 3)
    private BigDecimal total;
    
    @Column(name = "currency_code", nullable = false, length = 3)
    private String currencyCode;

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

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

    public String getDraftedBy() {
        return draftedBy;
    }

    public void setDraftedBy(String draftedBy) {
        this.draftedBy = draftedBy;
    }
    
    public LocalDate getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(LocalDate expiredAt) {
        this.expiredAt = expiredAt;
    }

    public Short getQuoteStatus() {
        return quoteStatus;
    }

    public void setQuoteStatus(Short quoteStatus) {
        this.quoteStatus = quoteStatus;
    }

    public String getAddComments() {
        return addComments;
    }

    public void setAddComments(String addComments) {
        this.addComments = addComments;
    }

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public Short getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(Short taxPercent) {
        this.taxPercent = taxPercent;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
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
}