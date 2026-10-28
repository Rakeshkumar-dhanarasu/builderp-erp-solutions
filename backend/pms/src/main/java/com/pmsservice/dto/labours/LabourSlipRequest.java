package com.pmsservice.dto.labours;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

public class LabourSlipRequest {

    @NotBlank
    private String jobNumber;

    @NotNull
    private LocalDate workDate;
    
    @NotEmpty
    private boolean markSubTaskCompleted = false;

    @NotEmpty
    @Valid
    private List<LabourSlipEmployeeRequest> employees;

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

    public List<LabourSlipEmployeeRequest> getEmployees() {
        return employees;
    }

    public void setEmployees(List<LabourSlipEmployeeRequest> employees) {
        this.employees = employees;
    }
    
    public boolean isMarkSubTaskCompleted() {
        return markSubTaskCompleted;
    }

    public void setMarkSubTaskCompleted(boolean markSubTaskCompleted) {
        this.markSubTaskCompleted = markSubTaskCompleted;
    }

    public static class LabourSlipEmployeeRequest {

        @NotNull
        private Integer employeeId;

        @NotNull
        @DecimalMin(value = "0.01")
        @Digits(integer = 5, fraction = 2)
        private BigDecimal hoursWorked;

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
    }
}