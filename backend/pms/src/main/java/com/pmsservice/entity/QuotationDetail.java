package com.pmsservice.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "quotation_detail", schema = "public")
public class QuotationDetail {

    @Id
    @Column(name = "quotation_id", nullable = false, length = 12)
    private String quotationId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer", nullable = false)
    private String customer;

    @Column(name = "drafted_by", nullable = false)
    private String draftedBy;

    @Column(name = "draft_date", nullable = false)
    private LocalDate draftDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "site_address", nullable = false)
    private String siteAddress;

    @Column(name = "add_comments")
    private String addComments;

    @Column(name = "current_version", nullable = false)
    private Short currentVersion;

    @Column(name = "quote_status", nullable = false)
    private Short quoteStatus;

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getDraftedBy() {
        return draftedBy;
    }

    public void setDraftedBy(String draftedBy) {
        this.draftedBy = draftedBy;
    }

    public LocalDate getDraftDate() {
        return draftDate;
    }

    public void setDraftDate(LocalDate draftDate) {
        this.draftDate = draftDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSiteAddress() {
        return siteAddress;
    }

    public void setSiteAddress(String siteAddress) {
        this.siteAddress = siteAddress;
    }

    public String getAddComments() {
        return addComments;
    }

    public void setAddComments(String addComments) {
        this.addComments = addComments;
    }

    public Short getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(Short currentVersion) {
        this.currentVersion = currentVersion;
    }

    public Short getQuoteStatus() {
        return quoteStatus;
    }

    public void setQuoteStatus(Short quoteStatus) {
        this.quoteStatus = quoteStatus;
    }
}