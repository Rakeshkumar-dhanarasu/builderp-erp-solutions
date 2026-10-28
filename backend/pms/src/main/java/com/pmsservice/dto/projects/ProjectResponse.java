package com.pmsservice.dto.projects;

import java.time.LocalDate;

public class ProjectResponse {

    private String projectId;
    private String projectName;
    private Integer projectManagerId;
    private String customer;
    private String quotationId;
    private Integer quotationVersion;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private Short completionPercent;
    private String status;

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

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}