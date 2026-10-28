package com.pmsservice.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_order", schema = "public")
public class PurchaseOrder {

    @Id
    @Column(name = "po_request_id", nullable = false, length = 255)
    private String poRequestId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectList project;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Column(name = "modified_by", nullable = false)
    private Integer modifiedBy;

    @Column(name = "modified_at", nullable = false)
    private LocalDate modifiedAt;

    @Column(name = "status", nullable = false)
    private Short status;

    @OneToMany(mappedBy = "purchaseOrder", fetch = FetchType.LAZY)
    private List<PoItemDetail> items = new ArrayList<>();

    @OneToMany(mappedBy = "purchaseOrder", fetch = FetchType.LAZY)
    private List<PoQuotation> quotations = new ArrayList<>();

    public String getPoRequestId() {
        return poRequestId;
    }

    public void setPoRequestId(String poRequestId) {
        this.poRequestId = poRequestId;
    }

    public ProjectList getProject() {
        return project;
    }

    public void setProject(ProjectList project) {
        this.project = project;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public LocalDate getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDate modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public List<PoItemDetail> getItems() {
        return items;
    }

    public void setItems(List<PoItemDetail> items) {
        this.items = items;
    }

    public List<PoQuotation> getQuotations() {
        return quotations;
    }

    public void setQuotations(List<PoQuotation> quotations) {
        this.quotations = quotations;
    }
}