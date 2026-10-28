package com.pmsservice.dto.stockallocation;

import java.util.List;


public class CreateStockAllocationRequest {

    private String projectId;
    private Integer projectProgressId;
    private List<StockAllocationItemRequest> items;

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public Integer getProjectProgressId() {
        return projectProgressId;
    }

    public void setProjectProgressId(Integer projectProgressId) {
        this.projectProgressId = projectProgressId;
    }

    public List<StockAllocationItemRequest> getItems() {
        return items;
    }

    public void setItems(List<StockAllocationItemRequest> items) {
        this.items = items;
    }
}
