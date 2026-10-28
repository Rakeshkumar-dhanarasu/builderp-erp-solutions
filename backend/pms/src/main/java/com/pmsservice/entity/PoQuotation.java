package com.pmsservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "po_quotation", schema = "public")
public class PoQuotation {

    @Id
    @Column(name = "po_quotation_id", nullable = false, length = 255)
    private String poQuotationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "po_request_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "vendor_id", nullable = false)
    private Integer vendorId;

    @Column(name = "quotation_amount", nullable = false, precision = 12, scale = 3)
    private BigDecimal quotationAmount;

    @Column(name = "receipt")
    private byte[] receipt;

    @Column(name = "creation_date", nullable = false)
    private LocalDate creationDate;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Column(name = "status", nullable = false)
    private Short status;

    public String getPoQuotationId() {
        return poQuotationId;
    }

    public void setPoQuotationId(String poQuotationId) {
        this.poQuotationId = poQuotationId;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public Integer getVendorId() {
        return vendorId;
    }

    public void setVendorId(Integer vendorId) {
        this.vendorId = vendorId;
    }

    public BigDecimal getQuotationAmount() {
        return quotationAmount;
    }

    public void setQuotationAmount(BigDecimal quotationAmount) {
        this.quotationAmount = quotationAmount;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }
}