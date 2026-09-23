package com.pmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "budget_allocation")
public class BudgetInfo {
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "budget_id_seq")
    @SequenceGenerator(name = "budget_id_seq", sequenceName = "budget_id_seq", allocationSize = 1)
    @Column(name = "budget_id")
    private Integer budgetId;

    @Column(name = "quotation_id", nullable = false, length = 12)
    private String quotationId;

    @Column(name = "total_budget", nullable = false, precision = 15, scale = 3)
    private BigDecimal totalBudget;

    @Column(name = "purchase_material", nullable = false, precision = 15, scale = 3)
    private BigDecimal purchaseMaterial = BigDecimal.ZERO;

    @Column(name = "subcontractor", nullable = false, precision = 15, scale = 3)
    private BigDecimal subcontractor = BigDecimal.ZERO;

    @Column(name = "labour_forces", nullable = false, precision = 15, scale = 3)
    private BigDecimal labourForces = BigDecimal.ZERO;

    @Column(name = "transport_logistics", nullable = false, precision = 15, scale = 3)
    private BigDecimal transportLogistics = BigDecimal.ZERO;

    @Column(name = "miscellaneous", nullable = false, precision = 15, scale = 3)
    private BigDecimal miscellaneous = BigDecimal.ZERO;

    @Column(name = "misc_details")
    private String miscDetails;
    
    @Column(name = "status", nullable= false)
    private Boolean status;

    public Integer getBudgetId() {
        return budgetId;
    }

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
    
    public Boolean getStatus() {
    	return status;
    }
    
    public void setStatus(Boolean status) {
    	this.status = status;
    }
}
