package com.pmsservice.entity;

import java.io.Serializable;
import java.util.Objects;

public class QuotationVersionId implements Serializable {

    private String quotationId;
    private Short versionNumber;

    public QuotationVersionId() {
    }

    public QuotationVersionId(String quotationId, Short versionNumber) {
        this.quotationId = quotationId;
        this.versionNumber = versionNumber;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof QuotationVersionId)) {
            return false;
        }

        QuotationVersionId that = (QuotationVersionId) o;

        return Objects.equals(quotationId, that.quotationId)
                && Objects.equals(versionNumber, that.versionNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(quotationId, versionNumber);
    }
}