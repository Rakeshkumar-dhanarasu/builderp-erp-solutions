package com.pmsservice.controller;

import com.pmsservice.dto.purchaseorder.PurchaseOrderDetailResponse;
import com.pmsservice.dto.purchaseorder.PurchaseOrderSubmitRequest;
import com.pmsservice.dto.purchaseorder.PurchaseOrderSummaryResponse;
import com.pmsservice.dto.purchaseorder.PoReceiptRequest;
import com.pmsservice.projection.VendorLookupProjection;
import com.pmsservice.projection.ItemLookupProjection;
import com.pmsservice.service.PurchaseOrderService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pms/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<PurchaseOrderDetailResponse> createPurchaseOrder(
            @RequestBody PurchaseOrderSubmitRequest request) {

        Integer userId = getCurrentUserId();

        PurchaseOrderDetailResponse response =
                purchaseOrderService.createPurchaseOrder(
                        request,
                        userId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{poRequestId}")
    public ResponseEntity<PurchaseOrderDetailResponse> updatePurchaseOrder(
            @PathVariable String poRequestId,
            @RequestBody PurchaseOrderSubmitRequest request) {

        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
        		purchaseOrderService.updateRejectedPurchaseOrder(poRequestId, request, userId)
        		);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{poRequestId}/approve")
    public ResponseEntity<PurchaseOrderDetailResponse> approvePurchaseOrder(
            @PathVariable String poRequestId) {

        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
                purchaseOrderService.approvePurchaseOrder(poRequestId, userId)
            );
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{poRequestId}/reject")
    public ResponseEntity<PurchaseOrderDetailResponse> rejectPurchaseOrder(
            @PathVariable String poRequestId) {

        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
                purchaseOrderService.rejectPurchaseOrder(poRequestId, userId)
            );
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{poRequestId}/finance-approve")
    public ResponseEntity<PurchaseOrderDetailResponse> financeApprovePurchaseOrder(
            @PathVariable String poRequestId
    ) {
        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
                purchaseOrderService.financeApprovePurchaseOrder(
                        poRequestId,
                        userId
                )
        );
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{poRequestId}")
    public ResponseEntity<PurchaseOrderDetailResponse> getPurchaseOrder(
            @PathVariable String poRequestId) {
        return ResponseEntity.ok(
            purchaseOrderService.getPurchaseOrder(poRequestId)
        );
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<PurchaseOrderSummaryResponse>> getAllPurchaseOrders() {
        return ResponseEntity.ok(
            purchaseOrderService.getAllPurchaseOrders()
        );
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{poRequestId}/place-order")
    public ResponseEntity<PurchaseOrderDetailResponse> placePurchaseOrder(
            @PathVariable String poRequestId
    ) {
        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
                purchaseOrderService.placePurchaseOrder(
                        poRequestId,
                        userId
                )
        );
    }
    

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{poRequestId}/receive")
    public ResponseEntity<PurchaseOrderDetailResponse> receivePurchaseOrder(
            @PathVariable String poRequestId,
            @RequestBody List<PoReceiptRequest> request
    ) {
        Integer userId = getCurrentUserId();

        return ResponseEntity.ok(
                purchaseOrderService.receivePurchaseOrder(
                        poRequestId,
                        request,
                        userId
                )
        );
    }
    

	@GetMapping("/vendors")
	public ResponseEntity<List<VendorLookupProjection>> getAvailableVendors() {
	    return ResponseEntity.ok(purchaseOrderService.getAvailableVendors());
	}
	
	@GetMapping("/items")
	public ResponseEntity<List<ItemLookupProjection>> getAvailableItems() {
	    return ResponseEntity.ok(purchaseOrderService.getAvailableItems());
	}



    private Integer getCurrentUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException(
                    "Authenticated JWT not found."
            );
        }

        Number userId = jwtAuthentication.getToken().getClaim("user_id");

        if (userId == null) {
            throw new IllegalStateException(
                    "User ID not found in JWT."
            );
        }

        return userId.intValue();
    }
}