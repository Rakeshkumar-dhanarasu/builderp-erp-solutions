package com.pmsservice.dto.quotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class UpdateQuotationRequest {

    @NotNull(message = "Expiry date is required")
    @FutureOrPresent(message = "Expiry date cannot be in the past")
    @Future(message = "Expiry date must be after the draft date")
    private LocalDate expiryDate;

    @NotNull(message = "Site address is required")
    private String siteAddress;

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