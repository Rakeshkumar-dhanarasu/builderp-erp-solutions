package com.pmsservice.dto.stockallocation;

import java.time.LocalDateTime;
import java.util.List;

public class StockAllocationRequestResponse {

    private final Integer stockAllocationRequestId;
    private final String jobNumber;
    private final String projectId;
    private final Integer projectProgressId;
    private final Short requestStatus;
    private final Integer requestedBy;
    private final LocalDateTime requestedAt;
    private final List<StockAllocationRequestItemResponse> items;

    public StockAllocationRequestResponse(
            Integer stockAllocationRequestId,
            String jobNumber,
            String projectId,
            Integer projectProgressId,
            Short requestStatus,
            Integer requestedBy,
            LocalDateTime requestedAt,
            List<StockAllocationRequestItemResponse> items) {
        this.stockAllocationRequestId = stockAllocationRequestId;
        this.jobNumber = jobNumber;
        this.projectId = projectId;
        this.projectProgressId = projectProgressId;
        this.requestStatus = requestStatus;
        this.requestedBy = requestedBy;
        this.requestedAt = requestedAt;
        this.items = items;
    }

    public Integer getStockAllocationRequestId() {
        return stockAllocationRequestId;
    }
    
    public String getJobNumber() {
    	return jobNumber;
    }

    public String getProjectId() {
        return projectId;
    }

    public Integer getProjectProgressId() {
        return projectProgressId;
    }

    public Short getRequestStatus() {
        return requestStatus;
    }

    public Integer getRequestedBy() {
        return requestedBy;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }
    
    public List<StockAllocationRequestItemResponse> getItems() {
        return items;
    }
}
