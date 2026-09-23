package com.pmsservice.controller;

import jakarta.validation.Valid;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import com.pmsservice.dto.StakeholderListResponse;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.dto.CreateStakeholderRequest;
import com.pmsservice.dto.CreateStakeholderResponse;
import com.pmsservice.service.StakeholderService;
import com.pmsservice.dto.StakeholderDetailResponse;
import com.pmsservice.dto.UpdateStakeholderRequest;
import com.pmsservice.dto.UpdateStakeholderStatusRequest;

@RestController
@RequestMapping("/api/pms/stakeholders")
public class StakeholderController {

    private final StakeholderService stakeholderService;

    public StakeholderController(
            StakeholderService stakeholderService) {

        this.stakeholderService = stakeholderService;
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CreateStakeholderResponse> createStakeholder(
    		@RequestBody @Valid CreateStakeholderRequest request) {

        CreateStakeholderResponse response =
                stakeholderService.createStakeholder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<StakeholderListResponse>> getStakeholders(
            @RequestParam StakeholderType type) {

        List<StakeholderListResponse> response =
                stakeholderService.getStakeholdersByType(type);

        return ResponseEntity.ok(response);
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{stakeholderId}")
    public ResponseEntity<StakeholderDetailResponse> getStakeholderById(
            @PathVariable Integer stakeholderId) {

        StakeholderDetailResponse response =
                stakeholderService.getStakeholderById(stakeholderId);

        return ResponseEntity.ok(response);
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{stakeholderId}")
    public ResponseEntity<StakeholderDetailResponse> updateStakeholder(
            @PathVariable Integer stakeholderId,
            @RequestBody @Valid UpdateStakeholderRequest request) {

        StakeholderDetailResponse response =
                stakeholderService.updateStakeholder(
                        stakeholderId,
                        request
                );

        return ResponseEntity.ok(response);
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{stakeholderId}")
    public ResponseEntity<Void> deleteStakeholder(
            @PathVariable Integer stakeholderId) {

        stakeholderService.deleteStakeholder(stakeholderId);

        return ResponseEntity.noContent().build();
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{stakeholderId}/status")
    public ResponseEntity<StakeholderDetailResponse> updateStakeholderStatus(
            @PathVariable Integer stakeholderId,
            @RequestBody @Valid UpdateStakeholderStatusRequest request) {

        StakeholderDetailResponse response =
                stakeholderService.updateStakeholderStatus(
                        stakeholderId,
                        request.getActive()
                );

        return ResponseEntity.ok(response);
    }
}