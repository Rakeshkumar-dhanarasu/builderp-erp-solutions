package com.pmsservice.dto.projects;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProjectDetailResponse {

    private String projectId;
    private String projectName;
    private String customer;
    private String siteAddress;
    private Integer projectManagerId;
    private String quotationId;
    private Integer quotationVersion;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private Short completionPercent;
    private BigDecimal budgetAllocated;
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

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getSiteAddress() {
        return siteAddress;
    }

    public void setSiteAddress(String siteAddress) {
        this.siteAddress = siteAddress;
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

    public BigDecimal getBudgetAllocated() {
        return budgetAllocated;
    }

    public void setBudgetAllocated(BigDecimal budgetAllocated) {
        this.budgetAllocated = budgetAllocated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}