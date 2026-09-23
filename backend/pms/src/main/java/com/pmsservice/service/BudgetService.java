package com.pmsservice.service;

import com.pmsservice.dto.BudgetEditRequest;
import com.pmsservice.dto.BudgetResponse;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public BudgetResponse getBudgetDetails(String quotationId) {

        BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Budget not found for quotation ID: " + quotationId));

        return mapToResponse(budgetInfo);
    }

    @Transactional
    public BudgetResponse editBudget(String quotationId, BudgetEditRequest request) {

        BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Budget not found for quotation ID: " + quotationId));

        budgetInfo.setPurchaseMaterial(request.getPurchaseMaterial());
        budgetInfo.setSubcontractor(request.getSubcontractor());
        budgetInfo.setLabourForces(request.getLabourForces());
        budgetInfo.setTransportLogistics(request.getTransportLogistics());
        budgetInfo.setMiscellaneous(request.getMiscellaneous());
        budgetInfo.setMiscDetails(request.getMiscDetails());

        budgetRepository.save(budgetInfo);

        return mapToResponse(budgetInfo);
    }

    private BudgetResponse mapToResponse(BudgetInfo budgetInfo) {

        BudgetResponse response = new BudgetResponse();

        response.setQuotationId(budgetInfo.getQuotationId());
        response.setTotalBudget(budgetInfo.getTotalBudget());
        response.setPurchaseMaterial(budgetInfo.getPurchaseMaterial());
        response.setSubcontractor(budgetInfo.getSubcontractor());
        response.setLabourForces(budgetInfo.getLabourForces());
        response.setTransportLogistics(budgetInfo.getTransportLogistics());
        response.setMiscellaneous(budgetInfo.getMiscellaneous());
        response.setMiscDetails(budgetInfo.getMiscDetails());

        return response;
    }
}