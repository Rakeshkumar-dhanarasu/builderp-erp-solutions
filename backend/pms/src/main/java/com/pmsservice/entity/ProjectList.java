package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "project_list")
public class ProjectList {

    @Id
    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "project_manager_id", nullable = false)
    private Integer projectManagerId;

    @Column(name = "quotation_id", nullable = false)
    private String quotationId;

    @Column(name = "quotation_version", nullable = false)
    private Integer quotationVersion;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "expected_end_date", nullable = false)
    private LocalDate expectedEndDate;

    @Column(name = "completion_percent", nullable = false)
    private Short completionPercent;

    @Column(name = "status", nullable = false)
    private Short status;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "modified_by", nullable = false)
    private Integer modifiedBy;

    @Column(name = "modified_date", nullable = false)
    private LocalDate modifiedDate;

    public String getProjectId() {
    	return projectId;
    }
    
    public void setProjectId(String projectId) {
    	this.projectId = projectId;
    }
    
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Integer getProjectManagerId() {
        return projectManagerId;
    }

    public void setProjectManagerId(Integer projectManagerId) {
        this.projectManagerId = projectManagerId;
    }

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public Integer getQuotationVersion() {
        return quotationVersion;
    }

    public void setQuotationVersion(Integer quotationVersion) {
        this.quotationVersion = quotationVersion;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(LocalDate expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public Short getCompletionPercent() {
        return completionPercent;
    }

    public void setCompletionPercent(Short completionPercent) {
        this.completionPercent = completionPercent;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public LocalDate getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDate modifiedDate) {
        this.modifiedDate = modifiedDate;
    }
}