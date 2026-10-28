package com.pmsservice.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "stock_allocation_request_item",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "stock_allocation_request_item_request_item_key",
            columnNames = {
                "stock_allocation_request_id",
                "item_id"
            }
        )
    }
)
public class StockAllocationRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_allocation_request_item_id")
    private Integer stockAllocationRequestItemId;

    @Column(name = "stock_allocation_request_id", nullable = false)
    private Integer stockAllocationRequestId;

    @Column(name = "item_id", nullable = false)
    private Short itemId;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    public Integer getStockAllocationRequestItemId() {
        return stockAllocationRequestItemId;
    }

    public void setStockAllocationRequestItemId(
            Integer stockAllocationRequestItemId) {
        this.stockAllocationRequestItemId = stockAllocationRequestItemId;
    }

    public Integer getStockAllocationRequestId() {
        return stockAllocationRequestId;
    }

    public void setStockAllocationRequestId(Integer stockAllocationRequestId) {
        this.stockAllocationRequestId = stockAllocationRequestId;
    }

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
