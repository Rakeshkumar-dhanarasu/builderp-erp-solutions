package com.pmsservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_allocation_request")
public class StockAllocationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_allocation_request_id")
    private Integer stockAllocationRequestId;
    
    @Column(name = "job_number", nullable = false, unique = true, length = 50)
    private String jobNumber;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "project_progress_id", nullable = false)
    private Integer projectProgressId;

    @Column(name = "request_status", nullable = false)
    private Short requestStatus = 7;

    @Column(name = "requested_by", nullable = false)
    private Integer requestedBy;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "allocated_by")
    private Integer allocatedBy;

    @Column(name = "allocated_at")
    private LocalDateTime allocatedAt;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
    }

    public Integer getStockAllocationRequestId() {
        return stockAllocationRequestId;
    }

    public void setStockAllocationRequestId(Integer stockAllocationRequestId) {
        this.stockAllocationRequestId = stockAllocationRequestId;
    }

    public String getJobNumber() {
        return jobNumber;
    }

    public void setJobNumber(String jobNumber) {
        this.jobNumber = jobNumber;
    }

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

    public Short getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(Short requestStatus) {
        this.requestStatus = requestStatus;
    }

    public Integer getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(Integer requestedBy) {
        this.requestedBy = requestedBy;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public Integer getAllocatedBy() {
        return allocatedBy;
    }

    public void setAllocatedBy(Integer allocatedBy) {
        this.allocatedBy = allocatedBy;
    }

    public LocalDateTime getAllocatedAt() {
        return allocatedAt;
    }

    public void setAllocatedAt(LocalDateTime allocatedAt) {
        this.allocatedAt = allocatedAt;
    }
}
