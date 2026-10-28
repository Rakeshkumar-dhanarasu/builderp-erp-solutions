
package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PoOrderReceiptId implements Serializable {

    @Column(name = "po_request_id", nullable = false, length = 255)
    private String poRequestId;

    @Column(name = "item_request_id", nullable = false)
    private Integer itemRequestId;

    public PoOrderReceiptId() {
    }

    public PoOrderReceiptId(String poRequestId, Integer itemRequestId) {
        this.poRequestId = poRequestId;
        this.itemRequestId = itemRequestId;
    }

    public String getPoRequestId() {
        return poRequestId;
    }

    public void setPoRequestId(String poRequestId) {
        this.poRequestId = poRequestId;
    }

    public Integer getItemRequestId() {
        return itemRequestId;
    }

    public void setItemRequestId(Integer itemRequestId) {
        this.itemRequestId = itemRequestId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof PoOrderReceiptId that)) return false;
        return Objects.equals(poRequestId, that.poRequestId)
            && Objects.equals(itemRequestId, that.itemRequestId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(poRequestId, itemRequestId);
    }
}
