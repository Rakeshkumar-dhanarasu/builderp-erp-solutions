package com.pmsservice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "po_item_detail", schema = "public")
public class PoItemDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "po_item_request_seq")
    @SequenceGenerator(
            name = "po_item_request_seq",
            sequenceName = "po_item_detail_item_request_id_seq",
            allocationSize = 1
    )
    @Column(name = "item_request_id", nullable = false)
    private Integer itemRequestId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "po_request_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemMaster item;

    @Column(name = "item_quantity", nullable = false)
    private Integer itemQuantity;

    @Column(name = "item_unit_price", nullable = false, precision = 8, scale = 3)
    private BigDecimal itemUnitPrice;

    @Column(name = "item_total_price", nullable = false, precision = 10, scale = 3)
    private BigDecimal itemTotalPrice;

    public Integer getItemRequestId() {
        return itemRequestId;
    }

    public void setItemRequestId(Integer itemRequestId) {
        this.itemRequestId = itemRequestId;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public ItemMaster getItem() {
        return item;
    }

    public void setItem(ItemMaster item) {
        this.item = item;
    }

    public Integer getItemQuantity() {
        return itemQuantity;
    }

    public void setItemQuantity(Integer itemQuantity) {
        this.itemQuantity = itemQuantity;
    }

    public BigDecimal getItemUnitPrice() {
        return itemUnitPrice;
    }

    public void setItemUnitPrice(BigDecimal itemUnitPrice) {
        this.itemUnitPrice = itemUnitPrice;
    }

    public BigDecimal getItemTotalPrice() {
        return itemTotalPrice;
    }

    public void setItemTotalPrice(BigDecimal itemTotalPrice) {
        this.itemTotalPrice = itemTotalPrice;
    }
}