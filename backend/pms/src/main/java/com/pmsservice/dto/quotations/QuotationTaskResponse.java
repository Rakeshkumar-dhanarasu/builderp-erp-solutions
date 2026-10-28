package com.pmsservice.dto.quotations;

import java.math.BigDecimal;

public class QuotationTaskResponse {

    private Integer utid;
    private Short taskId;
    private String taskName;
    private Short subTaskId;
    private String subTaskName;
    private Integer quantity;
    private String unit;
    private BigDecimal unitCost;
    private BigDecimal price;

    public Integer getUtid() {
        return utid;
    }

    public void setUtid(Integer utid) {
        this.utid = utid;
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