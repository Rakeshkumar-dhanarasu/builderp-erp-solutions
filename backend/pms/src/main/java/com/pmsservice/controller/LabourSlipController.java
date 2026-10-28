package com.pmsservice.controller;

import com.pmsservice.dto.labours.LabourSlipRequest;
import com.pmsservice.dto.labours.LabourSlipResponse;
import com.pmsservice.dto.labours.UpdateLabourSlipRequest;
import com.pmsservice.service.LabourSlipService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pms/labour-slips")
public class LabourSlipController {

    private final LabourSlipService labourSlipService;

    public LabourSlipController(LabourSlipService labourSlipService) {
        this.labourSlipService = labourSlipService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    public LabourSlipResponse createLabourSlip(
            @Valid @RequestBody LabourSlipRequest request) {
        return labourSlipService.createLabourSlip(request);
    }

    @PutMapping("/{labourSlipId}")
    @SecurityRequirement(name = "bearerAuth")
    public LabourSlipResponse updateLabourSlip(
            @PathVariable Integer labourSlipId,
            @Valid @RequestBody UpdateLabourSlipRequest request) {
        return labourSlipService.updateLabourSlip(labourSlipId, request);
    }

    @GetMapping("/{labourSlipId}")
    @SecurityRequirement(name = "bearerAuth")
    public LabourSlipResponse getLabourSlip(
            @PathVariable Integer labourSlipId) {
        return labourSlipService.getLabourSlip(labourSlipId);
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    public List<LabourSlipResponse> getLabourSlips(
            @RequestParam(required = false) String jobNumber) {

        if (jobNumber != null && !jobNumber.isBlank()) {
            return labourSlipService.getSlipsForJob(jobNumber.trim());
        }

        return labourSlipService.getAllLabourSlips();
    }
}