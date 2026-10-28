package com.pmsservice.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "po_status_table", schema = "public")
public class PoStatusTable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "po_status_seq")
    @SequenceGenerator(
            name = "po_status_seq",
            sequenceName = "po_status_table_po_status_id_seq",
            allocationSize = 1
    )
    @Column(name = "po_status_id", nullable = false)
    private Integer poStatusId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "po_request_id", nullable = false)
    private PurchaseOrder poRequestId;

    @Column(name = "status", nullable = false)
    private Short status;

    @Column(name = "performed_by", nullable = false)
    private Integer performedBy;

    @Column(name = "performed_at", nullable = false)
    private LocalDate performedAt;

    public Integer getPoStatusId() {
        return poStatusId;
    }

    public void setPoStatusId(Integer poStatusId) {
        this.poStatusId = poStatusId;
    }

    public PurchaseOrder getPoRequestId() {
        return poRequestId;
    }

    public void setPoRequestId(PurchaseOrder poRequestId) {
        this.poRequestId = poRequestId;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public Integer getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(Integer performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDate getPerformedAt() {
        return performedAt;
    }

    public void setPerformedAt(LocalDate performedAt) {
        this.performedAt = performedAt;
    }
}