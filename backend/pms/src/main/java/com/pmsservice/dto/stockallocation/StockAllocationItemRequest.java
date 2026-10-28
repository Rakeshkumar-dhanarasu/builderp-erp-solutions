
package com.pmsservice.dto.stockallocation;

public class StockAllocationItemRequest {

    private Short itemId;
    private Integer requestedQuantity;

    public Short getItemId() {
        return itemId;
    }

    public void setItemId(Short itemId) {
        this.itemId = itemId;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }
}
