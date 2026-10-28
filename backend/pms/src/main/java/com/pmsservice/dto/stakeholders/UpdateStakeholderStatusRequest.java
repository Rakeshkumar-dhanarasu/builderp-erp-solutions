package com.pmsservice.dto.stakeholders;

import jakarta.validation.constraints.NotNull;

public class UpdateStakeholderStatusRequest {

    @NotNull(message = "Active status is required")
    private Boolean active;

    public UpdateStakeholderStatusRequest() {
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}