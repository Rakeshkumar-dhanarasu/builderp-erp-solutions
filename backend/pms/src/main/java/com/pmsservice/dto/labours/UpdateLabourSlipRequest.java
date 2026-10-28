package com.pmsservice.dto.labours;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class UpdateLabourSlipRequest {

    @NotEmpty
    @Valid
    private List<LabourSlipRequest.LabourSlipEmployeeRequest> employees;
    
    @NotEmpty
    private boolean markSubTaskCompleted = false;

    public boolean isMarkSubTaskCompleted() {
        return markSubTaskCompleted;
    }

    public void setMarkSubTaskCompleted(boolean markSubTaskCompleted) {
        this.markSubTaskCompleted = markSubTaskCompleted;
    }

    public List<LabourSlipRequest.LabourSlipEmployeeRequest> getEmployees() {
        return employees;
    }

    public void setEmployees(
            List<LabourSlipRequest.LabourSlipEmployeeRequest> employees) {
        this.employees = employees;
    }
}