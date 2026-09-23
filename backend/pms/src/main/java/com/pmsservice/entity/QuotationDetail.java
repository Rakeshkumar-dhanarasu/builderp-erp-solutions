package com.pmsservice.entity;

import java.time.LocalDate;

import com.pmsservice.enums.QuotationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
        name = "quota_status",
        nullable = false,
        columnDefinition = "status"
    )
    private QuotationStatus quotaStatus;

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

    public QuotationStatus getQuotaStatus() {
        return quotaStatus;
    }

    public void setQuotaStatus(QuotationStatus quotaStatus) {
        this.quotaStatus = quotaStatus;
    }
}