
package com.pmsservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "stock_transaction", schema = "public")
public class StockTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stock_transaction_seq")
    @SequenceGenerator(
        name = "stock_transaction_seq",
        sequenceName = "stock_transaction_transaction_id_seq",
        allocationSize = 1
    )
    @Column(name = "transaction_id", nullable = false)
    private Long transactionId;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemMaster item;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stock_transaction_type_id", nullable = false)
    private StockTransactionType stockTransactionType;

    @Column(name = "po_quotation_id", nullable = false, length = 255)
    private String poQuotationId;

    @Column(name = "item_quantity", nullable = false)
    private Long itemQuantity;

    @Column(name = "stock_from", nullable = false, length = 255)
    private String stockFrom;

    @Column(name = "stock_to", nullable = false, length = 255)
    private String stockTo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "handled_by", nullable = false)
    private UserAccount handledBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectList project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "po_request_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_stock_id")
    private ItemStock itemStock;

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public ItemMaster getItem() {
        return item;
    }

    public void setItem(ItemMaster item) {
        this.item = item;
    }

    public StockTransactionType getStockTransactionType() {
        return stockTransactionType;
    }

    public void setStockTransactionType(StockTransactionType stockTransactionType) {
        this.stockTransactionType = stockTransactionType;
    }

    public String getPoQuotationId() {
        return poQuotationId;
    }

    public void setPoQuotationId(String poQuotationId) {
        this.poQuotationId = poQuotationId;
    }

    public Long getItemQuantity() {
        return itemQuantity;
    }

    public void setItemQuantity(Long itemQuantity) {
        this.itemQuantity = itemQuantity;
    }

    public String getStockFrom() {
        return stockFrom;
    }

    public void setStockFrom(String stockFrom) {
        this.stockFrom = stockFrom;
    }

    public String getStockTo() {
        return stockTo;
    }

    public void setStockTo(String stockTo) {
        this.stockTo = stockTo;
    }

    public UserAccount getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(UserAccount handledBy) {
        this.handledBy = handledBy;
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

    public ItemStock getItemStock() {
        return itemStock;
    }

    public void setItemStock(ItemStock itemStock) {
        this.itemStock = itemStock;
    }
}
