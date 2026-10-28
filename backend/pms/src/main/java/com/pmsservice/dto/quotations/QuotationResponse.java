package com.pmsservice.dto; 

import java.math.BigDecimal; 
import java.time.LocalDate; 
import java.util.List;

public class QuotationResponse {
	private String quotationId; 
	private Integer customerId; 
	private String customer; 
	private LocalDate draftDate; 
	private LocalDate expiryDate; 
	private String siteAddress; 
	private String addComments; 
	private Short versionNumber; 
	private String quoteStatus; 
	private BigDecimal marketPrice; 
	private Short taxPercent; 
	private BigDecimal discountAmount; 
	private BigDecimal total; 
	private String currencyCode; 
	private List<QuotationTaskResponse> tasks;
	
	public String getQuotationId() {
	    return quotationId;
	}

	public void setQuotationId(String quotationId) {
	    this.quotationId = quotationId;
	}

	public Integer getCustomerId() {
	    return customerId;
	}

	public void setCustomerId(Integer customerId) {
	    this.customerId = customerId;
	}

	public String getCustomer() {
	    return customer;
	}

	public void setCustomer(String customer) {
	    this.customer = customer;
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

	public String getAddComments() {
	    return addComments;
	}

	public void setAddComments(String addComments) {
	    this.addComments = addComments;
	}

	public Short getVersionNumber() {
	    return versionNumber;
	}

	public void setVersionNumber(Short versionNumber) {
	    this.versionNumber = versionNumber;
	}

	public String getQuoteStatus() {
	    return quoteStatus;
	}

	public void setQuoteStatus(String quoteStatus) {
	    this.quoteStatus = quoteStatus;
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

	public String getCurrencyCode() {
	    return currencyCode;
	}

	public void setCurrencyCode(String currencyCode) {
	    this.currencyCode = currencyCode;
	}

	public List<QuotationTaskResponse> getTasks() {
	    return tasks;
	}

	public void setTasks(List<QuotationTaskResponse> tasks) {
	    this.tasks = tasks;
	}

}
