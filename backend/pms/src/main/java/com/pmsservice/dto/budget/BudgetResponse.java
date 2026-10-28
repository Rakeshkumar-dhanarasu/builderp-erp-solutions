package com.pmsservice.dto.budget;

import java.math.BigDecimal;

public class BudgetResponse {

    private String quotationId;
    private BigDecimal totalBudget;
    private BigDecimal purchaseMaterial;
    private BigDecimal subcontractor;
    private BigDecimal labourForces;
    private BigDecimal transportLogistics;
    private BigDecimal miscellaneous;
    private String miscDetails;

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getPurchaseMaterial() {
        return purchaseMaterial;
    }

    public void setPurchaseMaterial(BigDecimal purchaseMaterial) {
        this.purchaseMaterial = purchaseMaterial;
    }

    public BigDecimal getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(BigDecimal subcontractor) {
        this.subcontractor = subcontractor;
    }

    public BigDecimal getLabourForces() {
        return labourForces;
    }

    public void setLabourForces(BigDecimal labourForces) {
        this.labourForces = labourForces;
    }

    public BigDecimal getTransportLogistics() {
        return transportLogistics;
    }

    public void setTransportLogistics(BigDecimal transportLogistics) {
        this.transportLogistics = transportLogistics;
    }

    public BigDecimal getMiscellaneous() {
        return miscellaneous;
    }

    public void setMiscellaneous(BigDecimal miscellaneous) {
        this.miscellaneous = miscellaneous;
    }

    public String getMiscDetails() {
        return miscDetails;
    }

    public void setMiscDetails(String miscDetails) {
        this.miscDetails = miscDetails;
    }
}