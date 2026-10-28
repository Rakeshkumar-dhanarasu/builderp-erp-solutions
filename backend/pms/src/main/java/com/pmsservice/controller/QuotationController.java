package com.pmsservice.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

import com.pmsservice.dto.quotations.CreateQuotationRequest;
import com.pmsservice.dto.quotations.QuotationListResponse;
import com.pmsservice.dto.quotations.QuotationResponse;
import com.pmsservice.dto.quotations.QuotationVersionHistoryResponse;
import com.pmsservice.dto.quotations.UpdateQuotationRequest;
import com.pmsservice.service.QuotationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pms/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<QuotationResponse> createQuotation(
            @Valid @RequestBody CreateQuotationRequest request) {

        QuotationResponse response =
                quotationService.createQuotation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<QuotationListResponse>> getAllQuotations() {

        List<QuotationListResponse> response =
                quotationService.getAllQuotations();

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{quotationId}")
    public ResponseEntity<QuotationResponse> getQuotation(
            @PathVariable String quotationId) {

        QuotationResponse response =
                quotationService.getQuotation(quotationId);

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{quotationId}")
    public ResponseEntity<QuotationResponse> updateQuotation(
            @PathVariable String quotationId,
            @Valid @RequestBody UpdateQuotationRequest request) {

        QuotationResponse response =
                quotationService.updateQuotation(
                        quotationId,
                        request);

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{quotationId}/send")
    public ResponseEntity<QuotationResponse> sendQuotation(
            @PathVariable String quotationId) {

        QuotationResponse response =
                quotationService.sendQuotation(quotationId);

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{quotationId}/accept")
    public ResponseEntity<QuotationResponse> acceptQuotation(
            @PathVariable String quotationId) {

        QuotationResponse response =
                quotationService.acceptQuotation(quotationId);

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{quotationId}/reject")
    public ResponseEntity<QuotationResponse> rejectQuotation(
            @PathVariable String quotationId) {

        QuotationResponse response =
                quotationService.rejectQuotation(quotationId);

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{quotationId}/versions")
    public ResponseEntity<QuotationResponse> createNewVersion(
            @PathVariable String quotationId) {

        QuotationResponse response =
                quotationService.createNewVersion(
                        quotationId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    } 
    
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{quotationId}/versions")
    public ResponseEntity<List<QuotationVersionHistoryResponse>> getQuotationVersionHistory(
            @PathVariable String quotationId) {

        List<QuotationVersionHistoryResponse> response =
                quotationService.getQuotationVersionHistory(
                        quotationId);

        return ResponseEntity.ok(response);
    }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{quotationId}/pdf")
    public ResponseEntity<byte[]> generateQuotationPdf(@PathVariable String quotationId) {
        byte[] pdf = quotationService.generateQuotationPdf(quotationId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + quotationId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}