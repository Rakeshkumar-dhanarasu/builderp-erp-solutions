package com.pmsservice.dto.projects;

import java.time.LocalDate;

public class CreateProjectRequest {

    private String projectName;
    private Integer projectManagerId;
    private String quotationId;
    private Integer quotationVersion;
    private LocalDate startDate;
    private LocalDate expectedEndDate;

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
}