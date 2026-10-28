package com.pmsservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max; 
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateQuotationRequest {

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be greater than zero")
    private Integer customerId;

    @NotNull(message = "Draft date is required")
    private LocalDate draftDate;

    @NotNull(message = "Expiry date is required")
    @FutureOrPresent(message = "Expiry date cannot be in the past")
    @Future(message = "Expiry date must be after the draft date")
    private LocalDate expiryDate;

    @NotNull(message = "Site address is required")
    private String siteAddress;
    
    @NotBlank(message = "Currency code is required")
    @Size(min = 3, max = 3, message = "Currency code must contain exactly 3 characters")
    private String currencyCode;

    private String addComments;

    @NotEmpty(message = "At least one quotation task is required") 
    private List<@Valid QuotationTaskRequest> tasks;
    
    @NotNull(message = "Market price is required") 
    @DecimalMin(value = "0.00", inclusive = true, message = "Market price cannot be negative") 
    private BigDecimal marketPrice;
    
    @Min(value = 0, message = "Tax percentage cannot be negative")
    @Max(value = 100, message = "Tax percentage cannot exceed 100")
    private Short taxPercent;
    
    @NotNull(message = "Discount amount is required") 
    @DecimalMin(value = "0.00", inclusive = true, message = "Discount amount cannot be negative")
    private BigDecimal discountAmount;
    
    @NotNull(message = "Total is required") 
    @DecimalMin(value = "0.00", inclusive = true, message = "Total cannot be negative") 
    private BigDecimal total;

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public LocalDate getDraftDate() {
        return draftDate;
    }

    public void setDraftDate(LocalDate draftDate) {
        this.draftDate = draftDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSiteAddress() {
        return siteAddress;
    }

    public void setSiteAddress(String siteAddress) {
        this.siteAddress = siteAddress;
    }
    
    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getAddComments() {
        return addComments;
    }

    public void setAddComments(String addComments) {
        this.addComments = addComments;
    }

    public List<QuotationTaskRequest> getTasks() {
        return tasks;
    }

    public void setTasks(List<QuotationTaskRequest> tasks) {
        this.tasks = tasks;
    }
    
    public BigDecimal getMarketPrice() { 
    	return marketPrice; 
    } 
    
    public void setMarketPrice(BigDecimal marketPrice) { 
    	this.marketPrice = marketPrice;
    }
    
    public Short getTaxPercent() {
    	return taxPercent;
    }
    
    public void setTaxPercent(Short taxPercent) {
    	this.taxPercent = taxPercent;    
    }
    
    public BigDecimal getDiscountAmount() {
    	return discountAmount;
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
    	this.discountAmount = discountAmount;    
    }
    
    public BigDecimal getTotal() { 
    	return total; 
    } 
    
    public void setTotal(BigDecimal total) { 
    	this.total = total;
    }
}