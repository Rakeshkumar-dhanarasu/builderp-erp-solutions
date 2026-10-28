package com.pmsservice.service;

import com.pmsservice.dto.purchaseorder.PoItemRequest;
import com.pmsservice.dto.purchaseorder.PoQuotationRequest;
import com.pmsservice.dto.purchaseorder.PurchaseOrderSubmitRequest;
import com.pmsservice.dto.purchaseorder.PurchaseOrderSummaryResponse;
import com.pmsservice.entity.ItemMaster;
import com.pmsservice.entity.PoItemDetail;
import com.pmsservice.entity.PoQuotation;
import com.pmsservice.entity.ProjectList;
import com.pmsservice.entity.PoStatusTable;
import com.pmsservice.entity.PurchaseOrder;
import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.entity.BudgetCategoryBalance;
import com.pmsservice.entity.BudgetCategoryBalanceId;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.entity.BudgetTransaction;
import com.pmsservice.entity.BudgetTransactionType;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.repository.BudgetCategoryBalanceRepository;
import com.pmsservice.repository.BudgetRepository;
import com.pmsservice.repository.BudgetTransactionRepository;
import com.pmsservice.repository.BudgetTransactionTypeRepository;
import com.pmsservice.repository.ItemMasterRepository;
import com.pmsservice.repository.PoItemDetailRepository;
import com.pmsservice.repository.PoQuotationRepository;
import com.pmsservice.repository.PoStatusTableRepository;
import com.pmsservice.repository.ProjectListRepository;
import com.pmsservice.repository.PurchaseOrderRepository;
import com.pmsservice.repository.StakeholderRepository;
import com.pmsservice.dto.purchaseorder.PoItemResponse;
import com.pmsservice.dto.purchaseorder.PoQuotationResponse;
import com.pmsservice.dto.purchaseorder.PurchaseOrderDetailResponse;
import com.pmsservice.dto.purchaseorder.PoReceiptRequest;
import com.pmsservice.entity.ItemStock;
import com.pmsservice.entity.PoOrderReceipt;
import com.pmsservice.entity.PoOrderReceiptId;
import com.pmsservice.entity.StockTransaction;
import com.pmsservice.entity.StockTransactionType;
import com.pmsservice.entity.UserAccount;
import com.pmsservice.repository.ItemStockRepository;
import com.pmsservice.repository.PoOrderReceiptRepository;
import com.pmsservice.repository.StockTransactionRepository;
import com.pmsservice.repository.StockTransactionTypeRepository;
import com.pmsservice.repository.UserAccountRepository;
import com.pmsservice.projection.VendorLookupProjection;
import com.pmsservice.projection.ItemLookupProjection;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseOrderService {

	private static final short STATUS_SUBMITTED = 2;
	private static final short STATUS_APPROVED = 3;
	private static final short STATUS_REJECTED = 4;
	private static final short STATUS_ORDER_PLACED = 5;
	private static final short STATUS_SELECTED = 14;
    private static final short STATUS_NOT_SELECTED = 15;
    
    private static final String CATEGORY_PURCHASE_MATERIAL = "purchase_material";
    private static final String TRANSACTION_TYPE_PO_DEDUCTION = "PO_DEDUCTION";
    private static final short STATUS_ORDER_RECEIVED = 6;
    private static final short STATUS_INCOMPLETE = 16;
    private static final String TRANSACTION_TYPE_SUPPLIER_TO_INVENTORY =
            "SUPPLIER_TO_INVENTORY";

    private final BudgetRepository budgetRepository;
    private final BudgetCategoryBalanceRepository budgetCategoryBalanceRepository;
    private final BudgetTransactionRepository budgetTransactionRepository;
    private final BudgetTransactionTypeRepository budgetTransactionTypeRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PoItemDetailRepository poItemDetailRepository;
    private final PoQuotationRepository poQuotationRepository;
    private final ItemMasterRepository itemMasterRepository;
    private final ProjectListRepository projectListRepository;
    private final PoStatusTableRepository poStatusTableRepository;
    private final StakeholderRepository stakeholderRepository;
    private final ItemStockRepository itemStockRepository;
    private final PoOrderReceiptRepository poOrderReceiptRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final StockTransactionTypeRepository stockTransactionTypeRepository;
    private final UserAccountRepository userAccountRepository;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository, PoItemDetailRepository poItemDetailRepository,
            PoQuotationRepository poQuotationRepository, ItemMasterRepository itemMasterRepository,
            ProjectListRepository projectListRepository, PoStatusTableRepository poStatusTableRepository,
            StakeholderRepository stakeholderRepository, BudgetRepository budgetRepository,
            BudgetCategoryBalanceRepository budgetCategoryBalanceRepository, BudgetTransactionRepository budgetTransactionRepository,
            BudgetTransactionTypeRepository budgetTransactionTypeRepository, ItemStockRepository itemStockRepository,
            PoOrderReceiptRepository poOrderReceiptRepository, StockTransactionRepository stockTransactionRepository,
            StockTransactionTypeRepository stockTransactionTypeRepository, UserAccountRepository userAccountRepository
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.poItemDetailRepository = poItemDetailRepository;
        this.poQuotationRepository = poQuotationRepository;
        this.itemMasterRepository = itemMasterRepository;
        this.projectListRepository = projectListRepository;
        this.poStatusTableRepository = poStatusTableRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.budgetRepository = budgetRepository;
        this.budgetCategoryBalanceRepository = budgetCategoryBalanceRepository;
        this.budgetTransactionRepository = budgetTransactionRepository;
        this.budgetTransactionTypeRepository = budgetTransactionTypeRepository;
        this.itemStockRepository = itemStockRepository;
        this.poOrderReceiptRepository = poOrderReceiptRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.stockTransactionTypeRepository = stockTransactionTypeRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public PurchaseOrderDetailResponse createPurchaseOrder(PurchaseOrderSubmitRequest request, Integer userId) {
        validateRequest(request);
        validateSelectedQuotation(request.getQuotations());

        ProjectList project = getProject(request.getProjectId());
        String poRequestId = generatePoRequestId(project.getProjectId());
        LocalDate today = LocalDate.now();

        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setPoRequestId(poRequestId);
        purchaseOrder.setProject(project);
        purchaseOrder.setCreatedBy(userId);
        purchaseOrder.setCreatedAt(today);
        purchaseOrder.setModifiedBy(userId);
        purchaseOrder.setModifiedAt(today);

        // New PO is submitted directly.
        purchaseOrder.setStatus(STATUS_SUBMITTED);

        PurchaseOrder savedPurchaseOrder =
                purchaseOrderRepository.save(purchaseOrder);

        saveItems(savedPurchaseOrder, request.getItems());
        saveQuotations(savedPurchaseOrder, request.getQuotations(), userId);

        return getPurchaseOrder(poRequestId);
    }

    @Transactional
    public PurchaseOrderDetailResponse updateRejectedPurchaseOrder(
            String poRequestId,
            PurchaseOrderSubmitRequest request,
            Integer userId
    ) {
        validateRequest(request);

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(poRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase Order not found: " + poRequestId));

        if (purchaseOrder.getStatus() != STATUS_REJECTED) {
            throw new IllegalStateException("Only rejected Purchase Orders can be edited.");
        }

        if (!purchaseOrder.getProject().getProjectId().equals(request.getProjectId())) {
            throw new IllegalArgumentException("Project cannot be changed while editing a Purchase Order.");
        }

        /*
         * The complete PO is submitted again.
         * Existing item and vendor quotation details are replaced
         * with the complete data received from the frontend.
         */
        poItemDetailRepository.deleteByPurchaseOrder_PoRequestId(poRequestId);
        poQuotationRepository.deleteByPurchaseOrder_PoRequestId(poRequestId);

        saveItems(purchaseOrder, request.getItems());
        saveQuotations(purchaseOrder, request.getQuotations(), userId);

        purchaseOrder.setModifiedBy(userId);
        purchaseOrder.setModifiedAt(LocalDate.now());

        // Rejected -> Submitted
        purchaseOrder.setStatus(STATUS_SUBMITTED);

        return getPurchaseOrder(poRequestId);
    }

	@Transactional
	public PurchaseOrderDetailResponse approvePurchaseOrder(
	        String poRequestId,
	        Integer userId
	) {
	    return recordPurchaseOrderDecision(
	            poRequestId,
	            userId,
	            STATUS_APPROVED
	    );
	}
	
	@Transactional
	public PurchaseOrderDetailResponse rejectPurchaseOrder(
	        String poRequestId,
	        Integer userId 
	) {
	    return recordPurchaseOrderDecision(
	            poRequestId,
	            userId,
	            STATUS_REJECTED
	    );
	}

	@Transactional(readOnly = true)
	public PurchaseOrderDetailResponse getPurchaseOrder(String poRequestId) {
	    PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(poRequestId)
	        .orElseThrow(() -> new IllegalArgumentException(
	            "Purchase Order not found: " + poRequestId
	        ));
	
	    List<PoItemResponse> items = purchaseOrder.getItems().stream()
	        .map(item -> new PoItemResponse(
	            item.getItemRequestId(),
	            item.getItem().getItemId(),
	            item.getItemQuantity(),
	            item.getItemUnitPrice(),
	            item.getItemTotalPrice()
	        ))
	        .toList();
	
	    List<PoQuotationResponse> quotations = purchaseOrder.getQuotations().stream()
	        .map(quotation -> new PoQuotationResponse(
	            quotation.getPoQuotationId(),
	            quotation.getVendorId(),
	            quotation.getQuotationAmount(),
	            quotation.getCreationDate(),
	            quotation.getCreatedBy(),
	            getStatusName(quotation.getStatus()),
	            quotation.getReceipt()
	        ))
	        .toList();
	
	    return new PurchaseOrderDetailResponse(
	        purchaseOrder.getPoRequestId(),
	        purchaseOrder.getProject().getProjectId(),
	        purchaseOrder.getCreatedBy(),
	        purchaseOrder.getCreatedAt(),
	        purchaseOrder.getModifiedBy(),
	        purchaseOrder.getModifiedAt(),
	        getStatusName(purchaseOrder.getStatus()),
	        items,
	        quotations
	    );
	}
	
	@Transactional(readOnly = true)
	public List<PurchaseOrderSummaryResponse> getAllPurchaseOrders() {
	    return purchaseOrderRepository.findAllByOrderByPoRequestIdDesc()
	        .stream()
	        .map(purchaseOrder -> new PurchaseOrderSummaryResponse(
	            purchaseOrder.getPoRequestId(),
	            purchaseOrder.getProject().getProjectId(),
	            purchaseOrder.getCreatedBy(),
	            purchaseOrder.getCreatedAt(),
	            purchaseOrder.getModifiedBy(),
	            purchaseOrder.getModifiedAt(),
	            getStatusName(purchaseOrder.getStatus())
	        ))
	        .toList();
	}
	
	@Transactional
	public PurchaseOrderDetailResponse financeApprovePurchaseOrder(
	        String poRequestId,
	        Integer userId
	) {
	    PurchaseOrder purchaseOrder = findPurchaseOrder(poRequestId);

	    if (purchaseOrder.getStatus() != STATUS_APPROVED) {
	        throw new IllegalStateException(
	                "Only approved purchase orders can be approved by Finance."
	        );
	    }

	    List<PoQuotation> selectedQuotations =
	            purchaseOrder.getQuotations().stream()
	                    .filter(quotation ->
	                            quotation.getStatus() != null
	                                    && quotation.getStatus() == STATUS_SELECTED
	                    )
	                    .toList();

	    if (selectedQuotations.size() != 1) {
	        throw new IllegalStateException(
	                "The purchase order must have exactly one selected quotation."
	        );
	    }

	    PoQuotation selectedQuotation = selectedQuotations.get(0);
	    BigDecimal deductionAmount = selectedQuotation.getQuotationAmount();

	    if (deductionAmount == null
	            || deductionAmount.compareTo(BigDecimal.ZERO) <= 0) {
	        throw new IllegalStateException(
	                "The selected quotation amount must be greater than zero."
	        );
	    }

	    String quotationId = purchaseOrder.getProject().getQuotationId();

	    BudgetInfo budget = budgetRepository.findByQuotationId(quotationId)
	            .orElseThrow(() -> new IllegalStateException(
	                    "Budget not found for quotation: " + quotationId
	            ));

	    BudgetCategoryBalanceId balanceId = new BudgetCategoryBalanceId(
	            budget.getBudgetId(),
	            CATEGORY_PURCHASE_MATERIAL
	    );

	    BudgetCategoryBalance balance =
	            budgetCategoryBalanceRepository.findByIdForUpdate(balanceId)
	                    .orElseThrow(() -> new IllegalStateException(
	                            "Purchase material budget balance has not been initialized."
	                    ));

	    // Check after acquiring the balance lock so concurrent approvals
	    // cannot both proceed against the same balance.
	    if (budgetTransactionRepository
	            .existsByReferenceIdAndTransactionType_TransactionTypeName(
	                    poRequestId,
	                    TRANSACTION_TYPE_PO_DEDUCTION
	            )) {
	        throw new IllegalStateException(
	                "Finance approval has already been processed for this purchase order."
	        );
	    }

	    BigDecimal balanceBefore = balance.getRemainingAmount();

	    if (balanceBefore.compareTo(deductionAmount) < 0) {
	        throw new IllegalStateException(
	                "Insufficient purchase material budget. Available: "
	                        + balanceBefore
	                        + ", required: "
	                        + deductionAmount
	        );
	    }

	    BigDecimal balanceAfter = balanceBefore.subtract(deductionAmount);

	    balance.setRemainingAmount(balanceAfter);
	    balance.setModifiedAt(LocalDate.now());
	    budgetCategoryBalanceRepository.save(balance);

	    BudgetTransactionType transactionType =
	            budgetTransactionTypeRepository
	                    .findByTransactionTypeName(TRANSACTION_TYPE_PO_DEDUCTION)
	                    .orElseThrow(() -> new IllegalStateException(
	                            "Budget transaction type PO_DEDUCTION is not configured."
	                    ));

	    BudgetTransaction transaction = new BudgetTransaction();
	    transaction.setBudget(budget);
	    transaction.setCategory(CATEGORY_PURCHASE_MATERIAL);
	    transaction.setTransactionType(transactionType);
	    transaction.setAmountChange(deductionAmount.negate());
	    transaction.setBalanceBefore(balanceBefore);
	    transaction.setBalanceAfter(balanceAfter);
	    transaction.setReferenceId(poRequestId);
	    transaction.setDescription(
	            "Finance approval deduction for selected vendor quotation "
	                    + selectedQuotation.getPoQuotationId()
	    );
	    transaction.setPerformedBy(userId);
	    transaction.setPerformedAt(java.time.LocalDateTime.now());

	    budgetTransactionRepository.save(transaction);

	    // Finance is the second approval stage. Keep the PO's main status
	    // at Approved and append another Approved history record.
	    PoStatusTable statusRecord = new PoStatusTable();
	    statusRecord.setPoRequestId(purchaseOrder);
	    statusRecord.setStatus(STATUS_APPROVED);
	    statusRecord.setPerformedBy(userId);
	    statusRecord.setPerformedAt(LocalDate.now());

	    poStatusTableRepository.save(statusRecord);

	    return getPurchaseOrder(poRequestId);
	}
	
	@Transactional
	public PurchaseOrderDetailResponse placePurchaseOrder(
	        String poRequestId,
	        Integer userId
	) {
	    PurchaseOrder purchaseOrder = findPurchaseOrder(poRequestId);

	    if (purchaseOrder.getStatus() != STATUS_APPROVED) {
	        throw new IllegalStateException(
	                "Only Finance-approved purchase orders can be placed."
	        );
	    }

	    boolean financeApproved = budgetTransactionRepository
	            .existsByReferenceIdAndTransactionType_TransactionTypeName(
	                    poRequestId,
	                    TRANSACTION_TYPE_PO_DEDUCTION
	            );

	    if (!financeApproved) {
	        throw new IllegalStateException(
	                "Finance approval is required before placing the purchase order."
	        );
	    }

	    purchaseOrder.setStatus(STATUS_ORDER_PLACED);
	    purchaseOrder.setModifiedBy(userId);
	    purchaseOrder.setModifiedAt(LocalDate.now());

	    purchaseOrderRepository.save(purchaseOrder);

	    PoStatusTable statusRecord = new PoStatusTable();
	    statusRecord.setPoRequestId(purchaseOrder);
	    statusRecord.setStatus(STATUS_ORDER_PLACED);
	    statusRecord.setPerformedBy(userId);
	    statusRecord.setPerformedAt(LocalDate.now());

	    poStatusTableRepository.save(statusRecord);

	    return getPurchaseOrder(poRequestId);
	}
	
	@Transactional
	public PurchaseOrderDetailResponse receivePurchaseOrder(
	        String poRequestId,
	        List<PoReceiptRequest> requests,
	        Integer userId
	) {
	    if (requests == null || requests.isEmpty()) {
	        throw new IllegalArgumentException(
	                "At least one received item is required."
	        );
	    }

	    // Lock the PO first so concurrent receiving requests for this PO
	    // cannot process its remaining quantities simultaneously.
	    PurchaseOrder purchaseOrder = purchaseOrderRepository
	            .findByIdForUpdate(poRequestId)
	            .orElseThrow(() -> new IllegalArgumentException(
	                    "Purchase Order not found: " + poRequestId
	            ));

	    if (purchaseOrder.getStatus() != STATUS_ORDER_PLACED
	            && purchaseOrder.getStatus() != STATUS_INCOMPLETE) {
	        throw new IllegalStateException(
	                "Goods can only be received for a placed or partially received Purchase Order."
	        );
	    }

	    List<PoQuotation> selectedQuotations =
	            poQuotationRepository.findByPurchaseOrder_PoRequestId(poRequestId)
	                    .stream()
	                    .filter(q -> q.getStatus() != null
	                            && q.getStatus() == STATUS_SELECTED)
	                    .toList();

	    if (selectedQuotations.size() != 1) {
	        throw new IllegalStateException(
	                "The purchase order must have exactly one selected quotation."
	        );
	    }

	    PoQuotation selectedQuotation = selectedQuotations.get(0);

	    StockTransactionType transactionType =
	            stockTransactionTypeRepository
	                    .findByStockTransactionTypeName(
	                            TRANSACTION_TYPE_SUPPLIER_TO_INVENTORY
	                    )
	                    .orElseThrow(() -> new IllegalStateException(
	                            "Stock transaction type SUPPLIER_TO_INVENTORY is not configured."
	                    ));

	    UserAccount user = userAccountRepository.findById(userId)
	            .orElseThrow(() -> new IllegalArgumentException(
	                    "User not found: " + userId
	            ));

	    Set<Integer> processedItemIds = new HashSet<>();
	    LocalDate today = LocalDate.now();
	    LocalDateTime receivedAt = LocalDateTime.now();

	    for (PoReceiptRequest request : requests) {
	        if (request == null || request.getItemRequestId() == null) {
	            throw new IllegalArgumentException(
	                    "Purchase Order item request ID is required."
	            );
	        }

	        if (!processedItemIds.add(request.getItemRequestId())) {
	            throw new IllegalArgumentException(
	                    "Duplicate item request ID in receipt: "
	                            + request.getItemRequestId()
	            );
	        }

	        Integer incomingQuantity = request.getQuantityReceived();

	        if (incomingQuantity == null || incomingQuantity <= 0) {
	            throw new IllegalArgumentException(
	                    "Received quantity must be greater than zero."
	            );
	        }

	        // Lock the PO line and confirm it belongs to this PO.
	        PoItemDetail itemDetail = poItemDetailRepository
	                .findByPoRequestIdAndItemRequestIdForUpdate(
	                        poRequestId,
	                        request.getItemRequestId()
	                )
	                .orElseThrow(() -> new IllegalArgumentException(
	                        "Purchase Order item not found: "
	                                + request.getItemRequestId()
	                ));

	        PoOrderReceiptId receiptId = new PoOrderReceiptId(
	                poRequestId,
	                itemDetail.getItemRequestId()
	        );

	        // The PO and item-line locks serialize receiving for this PO.
	        // A missing receipt row means no quantity has been received yet.
	        PoOrderReceipt receipt = poOrderReceiptRepository
	                .findByIdForUpdate(receiptId)
	                .orElseGet(() -> {
	                    PoOrderReceipt newReceipt = new PoOrderReceipt();
	                    newReceipt.setId(receiptId);
	                    newReceipt.setQuantityReceived(0);
	                    newReceipt.setReceivedStatus(STATUS_INCOMPLETE);
	                    return newReceipt;
	                });

	        int previouslyReceived = receipt.getQuantityReceived() == null
	                ? 0
	                : receipt.getQuantityReceived();

	        int orderedQuantity = itemDetail.getItemQuantity();

	        if (previouslyReceived >= orderedQuantity) {
	            throw new IllegalStateException(
	                    "This item has already been fully received: "
	                            + itemDetail.getItemRequestId()
	            );
	        }

	        if (incomingQuantity > orderedQuantity - previouslyReceived) {
	            throw new IllegalArgumentException(
	                    "Received quantity exceeds the remaining quantity for item "
	                            + itemDetail.getItemRequestId()
	                            + ". Remaining: "
	                            + (orderedQuantity - previouslyReceived)
	            );
	        }

	        int cumulativeReceived = Math.addExact(
	                previouslyReceived,
	                incomingQuantity
	        );

	        boolean fullyReceived = cumulativeReceived == orderedQuantity;

	        receipt.setQuantityReceived(cumulativeReceived);
	        receipt.setReceivedStatus(
	                fullyReceived
	                        ? STATUS_ORDER_RECEIVED
	                        : STATUS_INCOMPLETE
	        );
	        receipt.setReceivedAt(receivedAt);
	        receipt.setReceivedBy(userId);

	        poOrderReceiptRepository.save(receipt);

	        // Maintain one stock row per PO and item.
	        Short itemId = itemDetail.getItem().getItemId();

	        ItemStock stock = itemStockRepository
	                .findByPurchaseOrder_PoRequestIdAndItem_ItemId(
	                        poRequestId,
	                        itemId
	                )
	                .orElseGet(() -> {
	                    ItemStock newStock = new ItemStock();
	                    newStock.setItem(itemDetail.getItem());
	                    newStock.setItemQuantity(0);
	                    newStock.setStockedAt(today);
	                    newStock.setStockedBy(userId);
	                    newStock.setProject(purchaseOrder.getProject());
	                    newStock.setPurchaseOrder(purchaseOrder);
	                    return newStock;
	                });

	        int currentStock = stock.getItemQuantity();

	        stock.setItemQuantity(Math.addExact(currentStock, incomingQuantity));
	        stock.setStockedAt(today);
	        stock.setStockedBy(userId);

	        ItemStock savedStock = itemStockRepository.saveAndFlush(stock);

	        // Each transaction represents only this delivery's incremental
	        // movement, not the cumulative received quantity.
	        StockTransaction transaction = new StockTransaction();
	        transaction.setTransactionDate(today);
	        transaction.setItem(itemDetail.getItem());
	        transaction.setStockTransactionType(transactionType);
	        transaction.setPoQuotationId(
	                selectedQuotation.getPoQuotationId()
	        );
	        transaction.setItemQuantity(incomingQuantity.longValue());
	        transaction.setStockFrom("SUPPLIER");
	        transaction.setStockTo("INVENTORY");
	        transaction.setHandledBy(user);
	        transaction.setProject(purchaseOrder.getProject());
	        transaction.setPurchaseOrder(purchaseOrder);
	        transaction.setItemStock(savedStock);

	        stockTransactionRepository.save(transaction);
	    }

	    // Re-read persisted receipt rows to determine whether every PO line
	    // has been fully received, including lines omitted from this request.
	    List<PoItemDetail> allItems =
	            poItemDetailRepository.findByPurchaseOrder_PoRequestId(poRequestId);

	    boolean allReceived = !allItems.isEmpty()
	            && allItems.stream().allMatch(item -> {
	                PoOrderReceiptId id = new PoOrderReceiptId(
	                        poRequestId,
	                        item.getItemRequestId()
	                );

	                return poOrderReceiptRepository.findById(id)
	                        .map(receipt ->
	                                receipt.getQuantityReceived() != null
	                                        && receipt.getQuantityReceived()
	                                                >= item.getItemQuantity()
	                        )
	                        .orElse(false);
	            });

	    short finalStatus = allReceived
	            ? STATUS_ORDER_RECEIVED
	            : STATUS_INCOMPLETE;

	    purchaseOrder.setStatus(finalStatus);
	    purchaseOrder.setModifiedBy(userId);
	    purchaseOrder.setModifiedAt(today);

	    purchaseOrderRepository.save(purchaseOrder);

	    PoStatusTable statusRecord = new PoStatusTable();
	    statusRecord.setPoRequestId(purchaseOrder);
	    statusRecord.setStatus(finalStatus);
	    statusRecord.setPerformedBy(userId);
	    statusRecord.setPerformedAt(today);

	    poStatusTableRepository.save(statusRecord);

	    return getPurchaseOrder(poRequestId);
	}
	

	@Transactional(readOnly = true)
	public List<VendorLookupProjection> getAvailableVendors() {
	    return stakeholderRepository.findActiveVendors();
	}
	
	@Transactional(readOnly = true)
	public List<ItemLookupProjection> getAvailableItems() {
	    return itemMasterRepository.findItemsForLookup();
	}

	
    private ProjectList getProject(String projectId) {
        return projectListRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
    }
    
	private PurchaseOrderDetailResponse recordPurchaseOrderDecision(
	        String poRequestId,
	        Integer userId,
	        short decisionStatus
	) {
	    PurchaseOrder purchaseOrder = findPurchaseOrder(poRequestId);
	
	    if (purchaseOrder.getStatus() != STATUS_SUBMITTED) {
	        throw new IllegalStateException(
	                "Only submitted purchase orders can be approved or rejected."
	        );
	    }
	
	    List<PoQuotation> selectedQuotations =
	            purchaseOrder.getQuotations().stream()
	                    .filter(quotation ->
	                            quotation.getStatus() != null
	                                    && quotation.getStatus() == STATUS_SELECTED
	                    )
	                    .toList();
	
	    if (selectedQuotations.size() != 1) {
	        throw new IllegalStateException(
	                "The purchase order must have exactly one selected quotation."
	        );
	    }
	
	    PoStatusTable statusRecord = new PoStatusTable();
	    statusRecord.setPoRequestId(purchaseOrder);
	    statusRecord.setStatus(decisionStatus);
	    statusRecord.setPerformedBy(userId);
	    statusRecord.setPerformedAt(LocalDate.now());
	
	    purchaseOrder.setStatus(decisionStatus);
	    purchaseOrder.setModifiedBy(userId);
	    purchaseOrder.setModifiedAt(LocalDate.now());
	
	    purchaseOrderRepository.save(purchaseOrder);
	    poStatusTableRepository.save(statusRecord);
	
	    return getPurchaseOrder(poRequestId);
	}

    private void saveItems(PurchaseOrder purchaseOrder, List<PoItemRequest> requests) {
        for (PoItemRequest request : requests) {
            ItemMaster item = itemMasterRepository.findById(request.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Item not found: " + request.getItemId()));

            BigDecimal totalPrice = request.getUnitPrice()
                    .multiply(BigDecimal.valueOf(request.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            PoItemDetail detail = new PoItemDetail();
            detail.setPurchaseOrder(purchaseOrder);
            detail.setItem(item);
            detail.setItemQuantity(request.getQuantity());
            detail.setItemUnitPrice(request.getUnitPrice());
            detail.setItemTotalPrice(totalPrice);

            poItemDetailRepository.save(detail);
        }
    }

    private void saveQuotations(
            PurchaseOrder purchaseOrder,
            List<PoQuotationRequest> requests,
            Integer userId
    ) {
        int quotationNumber = 1;

        for (PoQuotationRequest request : requests) {
            String quotationId = purchaseOrder.getPoRequestId()
                    + "-Q" + String.format("%03d", quotationNumber);

            PoQuotation quotation = new PoQuotation();
            quotation.setPoQuotationId(quotationId);
            quotation.setPurchaseOrder(purchaseOrder);
            quotation.setVendorId(request.getVendorId());
            quotation.setQuotationAmount(request.getQuotationAmount());
            quotation.setReceipt(request.getReceipt());
            quotation.setCreationDate(LocalDate.now());
            quotation.setCreatedBy(userId);

            quotation.setStatus(
                    request.isSelected()
                            ? STATUS_SELECTED
                            : STATUS_NOT_SELECTED
            );

            poQuotationRepository.save(quotation);
            quotationNumber++;
        }
    }
    
    private PurchaseOrder findPurchaseOrder(String poRequestId) {
        return purchaseOrderRepository.findById(poRequestId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Purchase Order not found: " + poRequestId
            ));
    }
    
    private void validateSelectedQuotation(
            List<PoQuotationRequest> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one vendor quotation is required."
            );
        }

        long selectedCount = requests.stream()
                .filter(PoQuotationRequest::isSelected)
                .count();

        if (selectedCount != 1) {
            throw new IllegalArgumentException(
                    "Exactly one vendor quotation must be selected."
            );
        }
    }
    
    private void validateSupplier(Integer vendorId) {
        StakeholderInfo stakeholder = stakeholderRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Selected vendor does not exist."
                ));

        if (stakeholder.getStakeholderCategory() != StakeholderType.SUPPLIER) {
            throw new IllegalArgumentException(
                    "Only suppliers can be selected as vendors."
            );
        }
    }

    private String generatePoRequestId(String projectId) {
        PurchaseOrder latest = purchaseOrderRepository
                .findTopByProject_ProjectIdOrderByPoRequestIdDesc(projectId);

        int nextNumber = 1;

        if (latest != null) {
            String latestId = latest.getPoRequestId();
            int lastDash = latestId.lastIndexOf("-R");

            if (lastDash >= 0) {
                String sequence = latestId.substring(lastDash + 2);
                nextNumber = Integer.parseInt(sequence) + 1;
            }
        }

        String projectNumber = projectId.substring(projectId.indexOf("PJ") + 2);

        return "PJ" + projectNumber + "-R" + String.format("%03d", nextNumber);
    }
    
    private String getStatusName(Short statusId) {
        if (statusId == null) {
            return "Unknown";
        }

        return switch (statusId) {
            case 0 -> "Drafting";
            case 1 -> "Sent to Customer";
            case 2 -> "Submitted";
            case 3 -> "Approved";
            case 4 -> "Rejected";
            case 5 -> "Order placed";
            case 6 -> "Order received";
            case 7 -> "Requested";
            case 8 -> "Allocated";
            case 9 -> "Initiated";
            case 10 -> "In Progress";
            case 11 -> "Delayed";
            case 12 -> "On Hold";
            case 13 -> "Completed";
            case 14 -> "Selected";
            case 15 -> "Not selected";
            case 16 -> "Incomplete";
            default -> "Unknown";
        };
    }

    private void validateRequest(PurchaseOrderSubmitRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Purchase Order request cannot be null.");
        }

        if (request.getProjectId() == null || request.getProjectId().isBlank()) {
            throw new IllegalArgumentException("Project ID is required.");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("At least one item is required.");
        }

        if (request.getQuotations() == null || request.getQuotations().isEmpty()) {
            throw new IllegalArgumentException("At least one quotation is required.");
        }

        for (PoItemRequest item : request.getItems()) {
            if (item.getItemId() == null) {
                throw new IllegalArgumentException("Item is required.");
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Item quantity must be greater than zero.");
            }

            if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Item unit price cannot be negative.");
            }
        }

        for (PoQuotationRequest quotation : request.getQuotations()) {
            if (quotation.getVendorId() == null) {
                throw new IllegalArgumentException("Vendor is required.");
            }

            if (quotation.getQuotationAmount() == null || quotation.getQuotationAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Quotation amount cannot be negative.");
            }
        }
        
        for (PoQuotationRequest quotation : request.getQuotations()) {
            if (quotation.getVendorId() == null) {
                throw new IllegalArgumentException("Vendor is required.");
            }

            if (quotation.getQuotationAmount() == null
                    || quotation.getQuotationAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Quotation amount cannot be negative.");
            }

            validateSupplier(quotation.getVendorId());
        }
    }
}