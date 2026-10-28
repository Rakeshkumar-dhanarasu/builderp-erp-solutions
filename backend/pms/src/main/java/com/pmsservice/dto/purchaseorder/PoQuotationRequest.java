package com.pmsservice.dto.purchaseorder;

import java.math.BigDecimal;

public class PoQuotationRequest {

	private Integer vendorId;
    private BigDecimal quotationAmount;
    private byte[] receipt;
    private boolean selected;

    public Integer getVendorId() {
        return vendorId;
    }

    public void setVendorId(Integer vendorId) {
        this.vendorId = vendorId;
    }

    public BigDecimal getQuotationAmount() {
        return quotationAmount;
    }

    public void setQuotationAmount(BigDecimal quotationAmount) {
        this.quotationAmount = quotationAmount;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }
    
    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }
}