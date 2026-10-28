package com.pmsservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "item_stock", schema = "public")
public class ItemStock {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "item_stock_seq")
    @SequenceGenerator(
        name = "item_stock_seq",
        sequenceName = "item_stock_item_stock_id_seq",
        allocationSize = 1
    )
    @Column(name = "item_stock_id", nullable = false)
    private Integer itemStockId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemMaster item;

    @Column(name = "item_quantity", nullable = false)
    private Integer itemQuantity;

    @Column(name = "stocked_at", nullable = false)
    private LocalDate stockedAt;

    @Column(name = "stocked_by", nullable = false)
    private Integer stockedBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectList project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "po_request_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    public Integer getItemStockId() {
        return itemStockId;
    }

    public void setItemStockId(Integer itemStockId) {
        this.itemStockId = itemStockId;
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

    public LocalDate getStockedAt() {
        return stockedAt;
    }

    public void setStockedAt(LocalDate stockedAt) {
        this.stockedAt = stockedAt;
    }

    public Integer getStockedBy() {
        return stockedBy;
    }

    public void setStockedBy(Integer stockedBy) {
        this.stockedBy = stockedBy;
    }

    public ProjectList getProject() {
        return project;
    }

    public void setProject(ProjectList project) {
        this.project = project;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }
}
