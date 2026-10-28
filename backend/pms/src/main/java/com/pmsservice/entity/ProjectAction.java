package com.pmsservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_action", schema = "public")
public class ProjectAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_action_id")
    private Integer projectActionId;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "project_progress_id", nullable = false)
    private Integer projectProgressId;

    @Column(name = "stock_allocation_request_id", nullable = false)
    private Integer stockAllocationRequestId;

    @Column(name = "action_quantity", nullable = false)
    private Integer actionQuantity;

    @Column(name = "action_date", nullable = false)
    private LocalDateTime actionDate;

    @Column(name = "action_by", nullable = false)
    private Integer actionBy;

    @PrePersist
    protected void onCreate() {
        if (actionDate == null) {
            actionDate = LocalDateTime.now();
        }
    }

    public Integer getProjectActionId() {
        return projectActionId;
    }

    public void setProjectActionId(Integer projectActionId) {
        this.projectActionId = projectActionId;
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

    public Integer getStockAllocationRequestId() {
        return stockAllocationRequestId;
    }

    public void setStockAllocationRequestId(Integer stockAllocationRequestId) {
        this.stockAllocationRequestId = stockAllocationRequestId;
    }

    public Integer getActionQuantity() {
        return actionQuantity;
    }

    public void setActionQuantity(Integer actionQuantity) {
        this.actionQuantity = actionQuantity;
    }

    public LocalDateTime getActionDate() {
        return actionDate;
    }

    public void setActionDate(LocalDateTime actionDate) {
        this.actionDate = actionDate;
    }

    public Integer getActionBy() {
        return actionBy;
    }

    public void setActionBy(Integer actionBy) {
        this.actionBy = actionBy;
    }
}
