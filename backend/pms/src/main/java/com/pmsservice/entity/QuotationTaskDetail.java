package com.pmsservice.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "quotation_task_details", schema = "public")
public class QuotationTaskDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "quotation_task_details_uid_seq")
    @SequenceGenerator(
        name = "quotation_task_details_uid_seq",
        sequenceName = "quotation_task_details_utid_seq",
        allocationSize = 1
    )
    @Column(name = "utid")
    private Integer utid;

    @Column(name = "quotation_id", length = 12, nullable = false)
    private String quotationId;

    @Column(name = "version_number", nullable = false)
    private Short versionNumber;
    
    @Column(name = "task_id", nullable = false)
    private Short taskId;

    @Column(name = "task_name", nullable = false)
    private String taskName;
    
    @Column(name = "sub_task_id", nullable = false)
    private Short subTaskId;

    @Column(name = "sub_task_name", nullable = false)
    private String subTaskName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit", length = 6, nullable = false)
    private String unit;

    @Column(name = "unit_cost", precision = 12, scale = 2, nullable = false)
    private BigDecimal unitCost;

    @Column(name = "price", precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    public Integer getUtid() {
        return utid;
    }

    public void setUtid(Integer utid) {
        this.utid = utid;
    }

    public String getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(String quotationId) {
        this.quotationId = quotationId;
    }

    public Short getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Short versionNumber) {
        this.versionNumber = versionNumber;
    }
    
    public Short getTaskId() {
    	return taskId;
    }
    
    public void setTaskId(Short taskId) {
    	this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
    
    public Short getSubTaskId() {
    	return subTaskId;
    }
    
    public void setSubTaskId(Short subTaskId) {
    	this.subTaskId = subTaskId;
    }

    public String getSubTaskName() {
        return subTaskName;
    }

    public void setSubTaskName(String subTaskName) {
        this.subTaskName = subTaskName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}