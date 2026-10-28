package com.pmsservice.dto.purchaseorder;

import java.util.List;

public class PurchaseOrderSubmitRequest {

    private String projectId;
    private List<PoItemRequest> items;
    private List<PoQuotationRequest> quotations;

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public List<PoItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PoItemRequest> items) {
        this.items = items;
    }

    public List<PoQuotationRequest> getQuotations() {
        return quotations;
    }

    public void setQuotations(List<PoQuotationRequest> quotations) {
        this.quotations = quotations;
    }
}