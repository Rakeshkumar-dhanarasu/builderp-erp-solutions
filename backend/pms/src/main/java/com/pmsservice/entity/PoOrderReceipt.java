
package com.pmsservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "po_order_receipt", schema = "public")
public class PoOrderReceipt {

    @EmbeddedId
    private PoOrderReceiptId id;

    @Column(name = "quantity_received", nullable = false)
    private Integer quantityReceived = 0;

    @Column(name = "received_status", nullable = false)
    private Short receivedStatus;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "received_by")
    private Integer receivedBy;

    public PoOrderReceiptId getId() {
        return id;
    }

    public void setId(PoOrderReceiptId id) {
        this.id = id;
    }

    public Integer getQuantityReceived() {
        return quantityReceived;
    }

    public void setQuantityReceived(Integer quantityReceived) {
        this.quantityReceived = quantityReceived;
    }

    public Short getReceivedStatus() {
        return receivedStatus;
    }

    public void setReceivedStatus(Short receivedStatus) {
        this.receivedStatus = receivedStatus;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(LocalDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public Integer getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(Integer receivedBy) {
        this.receivedBy = receivedBy;
    }
}
