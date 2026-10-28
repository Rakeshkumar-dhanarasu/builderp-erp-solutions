package com.pmsservice.dto.labours;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class LabourSlipResponse {

    private Integer labourSlipId;
    private String jobNumber;
    private LocalDate workDate;
    private BigDecimal totalWages;
    private List<EmployeePayResponse> employees;

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

    public List<EmployeePayResponse> getEmployees() {
        return employees;
    }

    public void setEmployees(List<EmployeePayResponse> employees) {
        this.employees = employees;
    }

    public static class EmployeePayResponse {

        private Integer employeeId;
        private BigDecimal hoursWorked;
        private BigDecimal hourlyRate;
        private BigDecimal totalPay;

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
}