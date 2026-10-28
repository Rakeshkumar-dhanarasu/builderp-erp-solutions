package com.pmsservice.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "labour_slip_detail",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_labour_slip_detail_employee",
            columnNames = {"labour_slip_id", "employee_id"}
        )
    }
)
public class LabourSlipDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "labour_slip_detail_id")
    private Integer labourSlipDetailId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "labour_slip_id", nullable = false)
    private LabourSlip labourSlip;

    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @Column(name = "hours_worked", nullable = false, precision = 7, scale = 2)
    private BigDecimal hoursWorked;

    @Column(name = "hourly_rate", nullable = false, precision = 12, scale = 3)
    private BigDecimal hourlyRate;

    @Column(name = "total_pay", nullable = false, precision = 12, scale = 3)
    private BigDecimal totalPay;

    public Integer getLabourSlipDetailId() {
        return labourSlipDetailId;
    }

    public void setLabourSlipDetailId(Integer labourSlipDetailId) {
        this.labourSlipDetailId = labourSlipDetailId;
    }

    public LabourSlip getLabourSlip() {
        return labourSlip;
    }

    public void setLabourSlip(LabourSlip labourSlip) {
        this.labourSlip = labourSlip;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public BigDecimal getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(BigDecimal hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public BigDecimal getTotalPay() {
        return totalPay;
    }

    public void setTotalPay(BigDecimal totalPay) {
        this.totalPay = totalPay;
    }
}
