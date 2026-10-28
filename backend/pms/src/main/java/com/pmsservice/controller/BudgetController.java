package com.pmsservice.controller;

import com.pmsservice.dto.budget.*;
import com.pmsservice.service.BudgetService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pms/budgeting")
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping("/{quotationId}/budgetdetails")
    public ResponseEntity<BudgetResponse> getBudgetDetails(
            @PathVariable String quotationId) {

        BudgetResponse response = budgetService.getBudgetDetails(quotationId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{quotationId}/editBudget")
    public ResponseEntity<BudgetResponse> editBudget(
            @PathVariable String quotationId,
            @RequestBody BudgetEditRequest request) {

        BudgetResponse response = budgetService.editBudget(quotationId, request);

        return ResponseEntity.ok(response);
    }
    

	@GetMapping("/{quotationId}/tracking")
	public ResponseEntity<BudgetTrackingResponse> getBudgetTracking(
	        @PathVariable String quotationId) {
	
	    BudgetTrackingResponse response =
	            budgetService.getBudgetTracking(quotationId);
	
	    return ResponseEntity.ok(response);
	}

}