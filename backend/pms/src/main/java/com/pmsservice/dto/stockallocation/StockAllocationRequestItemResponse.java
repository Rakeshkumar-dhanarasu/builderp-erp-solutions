
package com.pmsservice.dto.stockallocation;

public class StockAllocationRequestItemResponse {

    private final Short itemId;
    private final String itemName;
    private final String itemCategory;
    private final Integer requestedQuantity;
    private final Long availableQuantity;

    public StockAllocationRequestItemResponse(
            Short itemId,
            String itemName,
            String itemCategory,
            Integer requestedQuantity,
            Long availableQuantity) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemCategory = itemCategory;
        this.requestedQuantity = requestedQuantity;
        this.availableQuantity = availableQuantity;
    }

    public Short getItemId() {
        return itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public String getItemCategory() {
        return itemCategory;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public Long getAvailableQuantity() {
        return availableQuantity;
    }
}
