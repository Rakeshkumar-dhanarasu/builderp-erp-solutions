package com.pmsservice.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "labour_slip",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_labour_slip_job_date",
            columnNames = {"job_number", "work_date"}
        )
    }
)
public class LabourSlip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "labour_slip_id")
    private Integer labourSlipId;

    @Column(name = "job_number", nullable = false, length = 50)
    private String jobNumber;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(name = "total_wages", nullable = false, precision = 12, scale = 3)
    private BigDecimal totalWages;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(
        mappedBy = "labourSlip",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<LabourSlipDetail> details = new ArrayList<>();

    public Integer getLabourSlipId() {
        return labourSlipId;
    }

    public void setLabourSlipId(Integer labourSlipId) {
        this.labourSlipId = labourSlipId;
    }

    public String getJobNumber() {
        return jobNumber;
    }

    public void setJobNumber(String jobNumber) {
        this.jobNumber = jobNumber;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public BigDecimal getTotalWages() {
        return totalWages;
    }

    public void setTotalWages(BigDecimal totalWages) {
        this.totalWages = totalWages;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<LabourSlipDetail> getDetails() {
        return details;
    }

    public void setDetails(List<LabourSlipDetail> details) {
        this.details = details;
    }

    public void addDetail(LabourSlipDetail detail) {
        details.add(detail);
        detail.setLabourSlip(this);
    }

    public void removeDetail(LabourSlipDetail detail) {
        details.remove(detail);
        detail.setLabourSlip(null);
    }
}
