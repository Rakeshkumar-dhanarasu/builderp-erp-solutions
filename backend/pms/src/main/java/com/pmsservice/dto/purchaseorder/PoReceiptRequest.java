package com.pmsservice.dto.purchaseorder;

public class PoReceiptRequest {

    private Integer itemRequestId;
    private Integer quantityReceived;

    public Integer getItemRequestId() {
        return itemRequestId;
    }

    public void setItemRequestId(Integer itemRequestId) {
        this.itemRequestId = itemRequestId;
    }

    public Integer getQuantityReceived() {
        return quantityReceived;
    }

    public void setQuantityReceived(Integer quantityReceived) {
        this.quantityReceived = quantityReceived;
    }
}
