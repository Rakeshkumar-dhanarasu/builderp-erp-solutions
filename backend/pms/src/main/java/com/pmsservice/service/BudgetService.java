package com.pmsservice.service;

import com.pmsservice.dto.budget.BudgetEditRequest;
import com.pmsservice.dto.budget.BudgetResponse;
import com.pmsservice.entity.BudgetCategoryBalance;
import com.pmsservice.entity.BudgetCategoryBalanceId;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.entity.BudgetTransaction;
import com.pmsservice.entity.BudgetTransactionType;
import com.pmsservice.repository.BudgetCategoryBalanceRepository;
import com.pmsservice.repository.BudgetRepository;
import com.pmsservice.repository.BudgetTransactionRepository;
import com.pmsservice.repository.BudgetTransactionTypeRepository;
import com.pmsservice.dto.budget.BudgetCategoryTrackingResponse;
import com.pmsservice.dto.budget.BudgetTrackingResponse;
import com.pmsservice.projection.BudgetTransactionProjection;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    private static final String CATEGORY_PURCHASE_MATERIAL = "purchase_material";
    private static final String CATEGORY_SUBCONTRACTOR = "subcontractor";
    private static final String CATEGORY_LABOUR_FORCES = "labour_forces";
    private static final String CATEGORY_TRANSPORT_LOGISTICS = "transport_logistics";
    private static final String CATEGORY_MISCELLANEOUS = "miscellaneous";

    private static final String TRANSACTION_TYPE_ALLOCATION_ADJUSTMENT =
            "ALLOCATION_ADJUSTMENT";

    private final BudgetRepository budgetRepository;
    private final BudgetCategoryBalanceRepository balanceRepository;
    private final BudgetTransactionRepository transactionRepository;
    private final BudgetTransactionTypeRepository transactionTypeRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            BudgetCategoryBalanceRepository balanceRepository,
            BudgetTransactionRepository transactionRepository,
            BudgetTransactionTypeRepository transactionTypeRepository) {

        this.budgetRepository = budgetRepository;
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }

    public BudgetResponse getBudgetDetails(String quotationId) {

        BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Budget not found for quotation ID: " + quotationId));

        return mapToResponse(budgetInfo);
    }

    @Transactional
    public BudgetResponse editBudget(
            String quotationId,
            BudgetEditRequest request) {

        BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Budget not found for quotation ID: " + quotationId));

        validateAllocations(budgetInfo, request);

        Map<String, BigDecimal> oldAllocations = getAllocations(budgetInfo);
        Map<String, BigDecimal> newAllocations = getRequestedAllocations(request);

        Map<String, BudgetCategoryBalance> balances = new LinkedHashMap<>();

        for (String category : oldAllocations.keySet()) {
            BudgetCategoryBalanceId id =
                    new BudgetCategoryBalanceId(budgetInfo.getBudgetId(), category);

            BudgetCategoryBalance balance = balanceRepository.findByIdForUpdate(id)
                    .orElseThrow(() -> new IllegalStateException(
                            "Budget balance is not initialized for category: "
                                    + category + ", quotation ID: " + quotationId));

            balances.put(category, balance);
        }

        BudgetTransactionType adjustmentType =
                transactionTypeRepository
                        .findByTransactionTypeName(
                                TRANSACTION_TYPE_ALLOCATION_ADJUSTMENT)
                        .orElseThrow(() -> new IllegalStateException(
                                "Budget transaction type not found: "
                                        + TRANSACTION_TYPE_ALLOCATION_ADJUSTMENT));

        Integer userId = getLoggedInUserId();

        for (String category : oldAllocations.keySet()) {
            BigDecimal oldAllocation = oldAllocations.get(category);
            BigDecimal newAllocation = newAllocations.get(category);
            BigDecimal difference = newAllocation.subtract(oldAllocation);

            if (difference.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            BudgetCategoryBalance balance = balances.get(category);
            BigDecimal balanceBefore = balance.getRemainingAmount();
            BigDecimal balanceAfter = balanceBefore.add(difference);

            if (balanceAfter.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException(
                        "Cannot reduce allocation for category '" + category
                                + "' because the remaining balance would become negative.");
            }

            balance.setRemainingAmount(balanceAfter);
            balance.setModifiedAt(LocalDate.now());

            BudgetTransaction transaction = new BudgetTransaction();
            transaction.setBudget(budgetInfo);
            transaction.setCategory(category);
            transaction.setTransactionType(adjustmentType);
            transaction.setAmountChange(difference);
            transaction.setBalanceBefore(balanceBefore);
            transaction.setBalanceAfter(balanceAfter);
            transaction.setReferenceId(quotationId);
            transaction.setDescription(
                    "Budget allocation adjusted from "
                            + oldAllocation + " to " + newAllocation);
            transaction.setPerformedBy(userId);
            transaction.setPerformedAt(LocalDateTime.now());

            transactionRepository.save(transaction);
        }

        budgetInfo.setPurchaseMaterial(
                newAllocations.get(CATEGORY_PURCHASE_MATERIAL));
        budgetInfo.setSubcontractor(
                newAllocations.get(CATEGORY_SUBCONTRACTOR));
        budgetInfo.setLabourForces(
                newAllocations.get(CATEGORY_LABOUR_FORCES));
        budgetInfo.setTransportLogistics(
                newAllocations.get(CATEGORY_TRANSPORT_LOGISTICS));
        budgetInfo.setMiscellaneous(
                newAllocations.get(CATEGORY_MISCELLANEOUS));
        budgetInfo.setMiscDetails(request.getMiscDetails());

        budgetRepository.save(budgetInfo);
        balanceRepository.saveAll(balances.values());

        return mapToResponse(budgetInfo);
    }    

	@Transactional(readOnly = true)
	public BudgetTrackingResponse getBudgetTracking(String quotationId) {
	
	    BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
	            .orElseThrow(() -> new IllegalArgumentException(
	                    "Budget not found for quotation ID: " + quotationId));
	
	    Map<String, BigDecimal> allocations = getAllocations(budgetInfo);
	    List<BudgetCategoryBalance> balances =
	            balanceRepository.findByIdBudgetId(budgetInfo.getBudgetId());
	
	    Map<String, BigDecimal> remainingByCategory = new LinkedHashMap<>();
	
	    for (BudgetCategoryBalance balance : balances) {
	        remainingByCategory.put(
	                balance.getId().getCategory(),
	                balance.getRemainingAmount()
	        );
	    }
	
	    BigDecimal totalAllocated = BigDecimal.ZERO;
	    BigDecimal totalRemaining = BigDecimal.ZERO;
	    List<BudgetCategoryTrackingResponse> categories = new ArrayList<>();
	
	    for (Map.Entry<String, BigDecimal> entry : allocations.entrySet()) {
	        String category = entry.getKey();
	        BigDecimal allocated = entry.getValue();
	        BigDecimal remaining = remainingByCategory.get(category);
	
	        if (remaining == null) {
	            throw new IllegalStateException(
	                    "Budget balance is not initialized for category: "
	                            + category + ", quotation ID: " + quotationId);
	        }
	
	        BigDecimal used = allocated.subtract(remaining);
	
	        categories.add(new BudgetCategoryTrackingResponse(
	                category,
	                allocated,
	                used,
	                remaining
	        ));
	
	        totalAllocated = totalAllocated.add(allocated);
	        totalRemaining = totalRemaining.add(remaining);
	    }
	
	    BudgetTrackingResponse response = new BudgetTrackingResponse();
	    response.setBudgetId(budgetInfo.getBudgetId());
	    response.setTotalCategoryAllocated(totalAllocated);
	    response.setTotalCategoryRemaining(totalRemaining);
	    response.setTotalCategoryUsed(totalAllocated.subtract(totalRemaining));
	    response.setCategories(categories);
	
	    List<BudgetTransactionProjection> transactions =
	            transactionRepository.findTrackingTransactionsByBudgetId(
	                    budgetInfo.getBudgetId());
	
	    response.setTransactions(transactions);
	
	    return response;
	}

    private void validateAllocations(
            BudgetInfo budgetInfo,
            BudgetEditRequest request) {

        if (request.getPurchaseMaterial() == null
                || request.getSubcontractor() == null
                || request.getLabourForces() == null
                || request.getTransportLogistics() == null
                || request.getMiscellaneous() == null) {

            throw new IllegalArgumentException(
                    "All budget category allocations must be provided.");
        }

        Map<String, BigDecimal> allocations = getRequestedAllocations(request);
        BigDecimal allocatedTotal = BigDecimal.ZERO;

        for (Map.Entry<String, BigDecimal> entry : allocations.entrySet()) {
            BigDecimal amount = entry.getValue();

            if (amount.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException(
                        "Budget allocation cannot be negative for category: "
                                + entry.getKey());
            }

            allocatedTotal = allocatedTotal.add(amount);
        }

        if (allocatedTotal.compareTo(budgetInfo.getTotalBudget()) > 0) {
            throw new IllegalArgumentException(
                    "The total of category allocations cannot exceed the total budget.");
        }
    }

    private Map<String, BigDecimal> getAllocations(BudgetInfo budgetInfo) {

        Map<String, BigDecimal> allocations = new LinkedHashMap<>();

        allocations.put(CATEGORY_PURCHASE_MATERIAL,
                budgetInfo.getPurchaseMaterial());
        allocations.put(CATEGORY_SUBCONTRACTOR,
                budgetInfo.getSubcontractor());
        allocations.put(CATEGORY_LABOUR_FORCES,
                budgetInfo.getLabourForces());
        allocations.put(CATEGORY_TRANSPORT_LOGISTICS,
                budgetInfo.getTransportLogistics());
        allocations.put(CATEGORY_MISCELLANEOUS,
                budgetInfo.getMiscellaneous());

        return allocations;
    }

    private Map<String, BigDecimal> getRequestedAllocations(
            BudgetEditRequest request) {

        Map<String, BigDecimal> allocations = new LinkedHashMap<>();

        allocations.put(CATEGORY_PURCHASE_MATERIAL,
                request.getPurchaseMaterial());
        allocations.put(CATEGORY_SUBCONTRACTOR,
                request.getSubcontractor());
        allocations.put(CATEGORY_LABOUR_FORCES,
                request.getLabourForces());
        allocations.put(CATEGORY_TRANSPORT_LOGISTICS,
                request.getTransportLogistics());
        allocations.put(CATEGORY_MISCELLANEOUS,
                request.getMiscellaneous());

        return allocations;
    }

    private Integer getLoggedInUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException(
                    "Authenticated JWT user information is not available");
        }

        Number userIdNumber = jwtAuthentication.getToken().getClaim("user_id");

        if (userIdNumber == null) {
            throw new IllegalStateException(
                    "User ID is missing from the authenticated JWT");
        }

        return userIdNumber.intValue();
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