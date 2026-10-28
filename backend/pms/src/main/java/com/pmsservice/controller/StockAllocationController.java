package com.pmsservice.controller;

import com.pmsservice.dto.stockallocation.CreateStockAllocationRequest;
import com.pmsservice.dto.stockallocation.StockAllocationRequestItemResponse;
import com.pmsservice.dto.stockallocation.StockAllocationRequestResponse;
import com.pmsservice.entity.StockAllocationRequest;
import com.pmsservice.service.StockAllocationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pms/stock-allocation")
public class StockAllocationController {

    private final StockAllocationService stockAllocationService;

    public StockAllocationController(
            StockAllocationService stockAllocationService) {
        this.stockAllocationService = stockAllocationService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/requests")
    public ResponseEntity<?> createRequest(
            @RequestBody CreateStockAllocationRequest request) {

        try {
            Integer userId = getLoggedInUserId();

            StockAllocationRequest savedRequest =
                    stockAllocationService.createRequest(request, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(toResponse(savedRequest));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/requests/pending")
    public ResponseEntity<List<StockAllocationRequestResponse>>
            getPendingRequests() {

        return ResponseEntity.ok(
                stockAllocationService.getPendingRequests());
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/project-progress/{projectId}")
    public ResponseEntity<?> getProjectProgress(
            @PathVariable String projectId) {

        try {
            return ResponseEntity.ok(
                    stockAllocationService.getProjectProgress(projectId));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/requests/{requestId}/allocate")
    public ResponseEntity<?> allocateRequest(
            @PathVariable Integer requestId) {

        try {
            Integer userId = getLoggedInUserId();

            StockAllocationRequest allocatedRequest =
                    stockAllocationService.allocateRequest(
                            requestId, userId);

            return ResponseEntity.ok(toResponse(allocatedRequest));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/jobs/{jobNumber}/allocate")
    public ResponseEntity<?> allocateByJobNumber(
            @PathVariable String jobNumber) {

        try {
            Integer userId = getLoggedInUserId();

            StockAllocationRequest allocatedRequest =
                    stockAllocationService.allocateRequestByJobNumber(
                            jobNumber, userId);

            return ResponseEntity.ok(toResponse(allocatedRequest));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/requests/allocated")
    public ResponseEntity<List<StockAllocationRequestResponse>> getAllocatedRequests() {
        return ResponseEntity.ok(stockAllocationService.getAllocatedRequests());
    }

    private StockAllocationRequestResponse toResponse(
            StockAllocationRequest request) {

        List<StockAllocationRequestItemResponse> items =
                stockAllocationService.getRequestItems(
                        request.getStockAllocationRequestId());

        return new StockAllocationRequestResponse(
                request.getStockAllocationRequestId(),
                request.getJobNumber(),
                request.getProjectId(),
                request.getProjectProgressId(),
                request.getRequestStatus(),
                request.getRequestedBy(),
                request.getRequestedAt(),
                items);
    }

    private Integer getLoggedInUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            Object userId =
                    jwtAuthentication.getToken().getClaim("user_id");

            if (userId instanceof Number number) {
                return number.intValue();
            }

            if (userId instanceof String value) {
                try {
                    return Integer.valueOf(value);
                } catch (NumberFormatException e) {
                    throw new IllegalStateException(
                            "Invalid user_id claim in JWT.");
                }
            }
        }

        throw new IllegalStateException(
                "Unable to identify the authenticated user.");
    }
}
