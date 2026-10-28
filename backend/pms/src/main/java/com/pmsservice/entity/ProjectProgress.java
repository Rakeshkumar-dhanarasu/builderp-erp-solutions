package com.pmsservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_progress", schema = "public")
public class ProjectProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_progress_id")
    private Integer projectProgressId;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "quotation_task_detail_id", nullable = false)
    private Integer quotationTaskDetailId;

    @Column(name = "task_id", nullable = false)
    private Short taskId;

    @Column(name = "sub_task_id", nullable = false)
    private Short subTaskId;

    @Column(name = "target_quantity", nullable = false)
    private Integer targetQuantity;

    @Column(name = "quantity_completed", nullable = false)
    private Integer quantityCompleted = 0;

    @Column(name = "status", nullable = false)
    private Short status;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = false)
    private Integer updatedBy;

    public Integer getProjectProgressId() {
        return projectProgressId;
    }

    public void setProjectProgressId(Integer projectProgressId) {
        this.projectProgressId = projectProgressId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public Integer getQuotationTaskDetailId() {
        return quotationTaskDetailId;
    }

    public void setQuotationTaskDetailId(Integer quotationTaskDetailId) {
        this.quotationTaskDetailId = quotationTaskDetailId;
    }

    public Short getTaskId() {
        return taskId;
    }

    public void setTaskId(Short taskId) {
        this.taskId = taskId;
    }

    public Short getSubTaskId() {
        return subTaskId;
    }

    public void setSubTaskId(Short subTaskId) {
        this.subTaskId = subTaskId;
    }

    public Integer getTargetQuantity() {
        return targetQuantity;
    }

    public void setTargetQuantity(Integer targetQuantity) {
        this.targetQuantity = targetQuantity;
    }

    public Integer getQuantityCompleted() {
        return quantityCompleted;
    }

    public void setQuantityCompleted(Integer quantityCompleted) {
        this.quantityCompleted = quantityCompleted;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }
}
