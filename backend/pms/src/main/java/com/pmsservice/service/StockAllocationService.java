package com.pmsservice.service;

import com.pmsservice.dto.stockallocation.CreateStockAllocationRequest;
import com.pmsservice.dto.stockallocation.StockAllocationItemRequest;
import com.pmsservice.dto.stockallocation.StockAllocationRequestItemResponse;
import com.pmsservice.dto.stockallocation.StockAllocationRequestResponse;
import com.pmsservice.entity.ItemMaster;
import com.pmsservice.entity.ItemStock;
import com.pmsservice.entity.PoQuotation;
import com.pmsservice.entity.ProjectAction;
import com.pmsservice.entity.ProjectList;
import com.pmsservice.entity.ProjectProgress;
import com.pmsservice.entity.PurchaseOrder;
import com.pmsservice.entity.StockAllocationRequest;
import com.pmsservice.entity.StockAllocationRequestItem;
import com.pmsservice.entity.StockTransaction;
import com.pmsservice.entity.StockTransactionType;
import com.pmsservice.entity.UserAccount;
import com.pmsservice.projection.ProjectProgressLookupProjection;
import com.pmsservice.repository.ItemMasterRepository;
import com.pmsservice.repository.ProjectProgressRepository;
import com.pmsservice.repository.StockAllocationRequestItemRepository;
import com.pmsservice.repository.StockAllocationRequestRepository;
import com.pmsservice.repository.ItemStockRepository;
import com.pmsservice.repository.StockTransactionRepository;
import com.pmsservice.repository.StockTransactionTypeRepository;
import com.pmsservice.repository.ProjectActionRepository;
import com.pmsservice.repository.ProjectListRepository;
import com.pmsservice.repository.UserAccountRepository;
import com.pmsservice.repository.PoQuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.LocalDate;

@Service
public class StockAllocationService {

    private final StockAllocationRequestRepository requestRepository;
    private final StockAllocationRequestItemRepository requestItemRepository;
    private final ProjectProgressRepository projectProgressRepository;
    private final ItemMasterRepository itemMasterRepository;
    private final ItemStockRepository itemStockRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final StockTransactionTypeRepository stockTransactionTypeRepository;
    private final ProjectActionRepository projectActionRepository;
    private final ProjectListRepository projectListRepository;
    private final UserAccountRepository userAccountRepository;
    private final PoQuotationRepository poQuotationRepository;

    public StockAllocationService(
            StockAllocationRequestRepository requestRepository, StockAllocationRequestItemRepository requestItemRepository,
            ProjectProgressRepository projectProgressRepository, ItemMasterRepository itemMasterRepository,
            ItemStockRepository itemStockRepository, StockTransactionRepository stockTransactionRepository,
            ProjectActionRepository projectActionRepository, ProjectListRepository projectListRepository,
            UserAccountRepository userAccountRepository, PoQuotationRepository poQuotationRepository, StockTransactionTypeRepository stockTransactionTypeRepository
    		) {
        this.requestRepository = requestRepository;
        this.requestItemRepository = requestItemRepository;
        this.projectProgressRepository = projectProgressRepository;
        this.itemMasterRepository = itemMasterRepository;
        this.itemStockRepository = itemStockRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.stockTransactionTypeRepository = stockTransactionTypeRepository;
        this.projectActionRepository = projectActionRepository;
        this.projectListRepository = projectListRepository;
        this.userAccountRepository = userAccountRepository;
        this.poQuotationRepository = poQuotationRepository;
    }

    @Transactional
    public StockAllocationRequest createRequest(
            CreateStockAllocationRequest request,
            Integer userId) {

        if (request == null
                || request.getProjectId() == null
                || request.getProjectId().isBlank()
                || request.getProjectProgressId() == null
                || request.getItems() == null
                || request.getItems().isEmpty()) {
        	throw new IllegalArgumentException(
        	        "Project, sub-task, and materials are required.");
        }

        if (userId == null) {
            throw new IllegalArgumentException(
                    "A valid logged-in user is required.");
        }

        ProjectProgress progress = projectProgressRepository
                .findByIdForUpdate(request.getProjectProgressId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Project progress record not found."));

        if (!progress.getProjectId().equals(request.getProjectId())) {
            throw new IllegalArgumentException(
                    "The selected sub-task does not belong to this project.");
        }

        if (progress.getStatus() == 13
                || progress.getQuantityCompleted()
                    >= progress.getTargetQuantity()) {
            throw new IllegalArgumentException(
                    "Cannot request materials for a completed sub-task.");
        }

        Set<Short> requestedItemIds = new HashSet<>();

        for (StockAllocationItemRequest item : request.getItems()) {
            if (item == null
                    || item.getItemId() == null
                    || item.getRequestedQuantity() == null
                    || item.getRequestedQuantity() <= 0) {
                throw new IllegalArgumentException(
                        "Every requested item must have a valid item ID "
                        + "and a positive quantity.");
            }

            if (!requestedItemIds.add(item.getItemId())) {
                throw new IllegalArgumentException(
                        "An item can only appear once in a request. "
                        + "Combine duplicate item quantities.");
            }

            if (!itemMasterRepository.existsById(item.getItemId())) {
                throw new IllegalArgumentException(
                        "Item not found: " + item.getItemId());
            }
        }

        StockAllocationRequest allocationRequest =
                new StockAllocationRequest();

        long sequenceValue =
                requestRepository.getNextJobNumberSequenceValue();

        String jobNumber = "JB-" + String.format("%04d", sequenceValue);

        allocationRequest.setJobNumber(jobNumber);
        allocationRequest.setProjectId(progress.getProjectId());
        allocationRequest.setProjectProgressId(
                progress.getProjectProgressId());
        allocationRequest.setRequestStatus((short) 7);
        allocationRequest.setRequestedBy(userId);

        StockAllocationRequest savedRequest =
                requestRepository.save(allocationRequest);

        List<StockAllocationRequestItem> requestItems =
                request.getItems().stream().map(item -> {
                    StockAllocationRequestItem requestItem =
                            new StockAllocationRequestItem();

                    requestItem.setStockAllocationRequestId(
                            savedRequest.getStockAllocationRequestId());
                    requestItem.setItemId(item.getItemId());
                    requestItem.setRequestedQuantity(
                            item.getRequestedQuantity());

                    return requestItem;
                }).toList();

        requestItemRepository.saveAll(requestItems);

        return savedRequest;
    }
    

    @Transactional(readOnly = true)
    public List<StockAllocationRequestResponse> getPendingRequests() {
        return requestRepository
                .findByRequestStatusOrderByRequestedAtAsc((short) 7)
                .stream()
                .map(request -> {
                    List<StockAllocationRequestItemResponse> items =
                            requestItemRepository
                                    .findByStockAllocationRequestId(request.getStockAllocationRequestId())
                                    .stream()
                                    .map(item -> {
                                        ItemMaster itemMaster = itemMasterRepository
                                                .findById(item.getItemId())
                                                .orElseThrow(() -> new IllegalStateException(
                                                        "Item not found: " + item.getItemId()));

                                        Long availableQuantity =
                                                itemStockRepository.getAvailableQuantityByItemId(item.getItemId());

                                        return new StockAllocationRequestItemResponse(
                                                item.getItemId(),
                                                itemMaster.getItemName(),
                                                itemMaster.getItemCategory(),
                                                item.getRequestedQuantity(),
                                                availableQuantity);
                                    })
                                    .toList();

                    return new StockAllocationRequestResponse(
                            request.getStockAllocationRequestId(),
                            request.getJobNumber(),
                            request.getProjectId(),
                            request.getProjectProgressId(),
                            request.getRequestStatus(),
                            request.getRequestedBy(),
                            request.getRequestedAt(),
                            items);
                })
                .toList();
    }

    @Transactional
    public StockAllocationRequest allocateRequest(
            Integer requestId,
            Integer userId) {

        if (requestId == null || userId == null) {
            throw new IllegalArgumentException(
                    "Request ID and logged-in user are required.");
        }

        StockAllocationRequest allocationRequest = requestRepository
                .findByIdForUpdate(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Stock allocation request not found."));

        if (allocationRequest.getRequestStatus() != 7) {
            throw new IllegalStateException(
                    "Only pending stock allocation requests can be allocated.");
        }

        ProjectProgress progress = projectProgressRepository
                .findByIdForUpdate(allocationRequest.getProjectProgressId())
                .orElseThrow(() -> new IllegalStateException(
                        "Project progress record not found."));

        if (!progress.getProjectId().equals(allocationRequest.getProjectId())) {
            throw new IllegalStateException(
                    "The allocation request does not match its project.");
        }

        if (progress.getStatus() == 13
                || progress.getQuantityCompleted() >= progress.getTargetQuantity()) {
            throw new IllegalStateException(
                    "The sub-task is already completed.");
        }

        List<StockAllocationRequestItem> requestItems =
                requestItemRepository.findByStockAllocationRequestId(requestId);

        if (requestItems.isEmpty()) {
            throw new IllegalStateException(
                    "The allocation request has no material items.");
        }

        requestItems = requestItems.stream()
                .sorted(java.util.Comparator.comparing(
                        StockAllocationRequestItem::getItemId))
                .toList();

        java.util.Map<Short, List<ItemStock>> batchesByItem =
                new java.util.LinkedHashMap<>();

        // Validate and lock stock for every requested item before issuing any.
        for (StockAllocationRequestItem line : requestItems) {
            List<ItemStock> batches =
                    itemStockRepository.findAvailableBatchesForUpdate(
                            line.getItemId());

            long available = batches.stream()
                    .mapToLong(ItemStock::getItemQuantity)
                    .sum();

            if (available < line.getRequestedQuantity()) {
                throw new IllegalStateException(
                        "Insufficient stock for item " + line.getItemId()
                        + ". Requested: " + line.getRequestedQuantity()
                        + ", available: " + available);
            }

            batchesByItem.put(line.getItemId(), batches);
        }

        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId));

        ProjectList destinationProject = projectListRepository
                .findById(allocationRequest.getProjectId())
                .orElseThrow(() -> new IllegalStateException(
                        "Destination project not found."));

        StockTransactionType transactionType =
                stockTransactionTypeRepository
                        .findByStockTransactionTypeName("INVENTORY_TO_SITE")
                        .orElseThrow(() -> new IllegalStateException(
                                "INVENTORY_TO_SITE transaction type is not configured."));

        LocalDate today = LocalDate.now();

        // Issue requested quantities across FIFO batches.
        for (StockAllocationRequestItem line : requestItems) {
            int remaining = line.getRequestedQuantity();

            for (ItemStock batch : batchesByItem.get(line.getItemId())) {
                if (remaining == 0) {
                    break;
                }

                int issued = Math.min(remaining, batch.getItemQuantity());

                if (issued <= 0) {
                    continue;
                }

                batch.setItemQuantity(batch.getItemQuantity() - issued);
                itemStockRepository.save(batch);

                PurchaseOrder sourceOrder = batch.getPurchaseOrder();

                List<PoQuotation> selectedQuotations =
                        poQuotationRepository
                                .findByPurchaseOrder_PoRequestId(
                                        sourceOrder.getPoRequestId())
                                .stream()
                                .filter(q -> q.getStatus() != null
                                        && q.getStatus() == 14)
                                .toList();

                if (selectedQuotations.size() != 1) {
                    throw new IllegalStateException(
                            "Each source purchase order must have exactly one "
                            + "selected quotation: "
                            + sourceOrder.getPoRequestId());
                }

                StockTransaction transaction = new StockTransaction();
                transaction.setTransactionDate(today);
                transaction.setItem(batch.getItem());
                transaction.setStockTransactionType(transactionType);
                transaction.setPoQuotationId(
                        selectedQuotations.get(0).getPoQuotationId());
                transaction.setItemQuantity((long) issued);
                transaction.setStockFrom("INVENTORY");
                transaction.setStockTo("SITE");
                transaction.setHandledBy(user);
                transaction.setProject(destinationProject);
                transaction.setPurchaseOrder(sourceOrder);
                transaction.setItemStock(batch);

                stockTransactionRepository.save(transaction);

                remaining -= issued;
            }

            if (remaining > 0) {
                throw new IllegalStateException(
                        "Stock changed during allocation. Please retry.");
            }
        }

        // Record the allocation action without updating project completion.
        ProjectAction action = new ProjectAction();
        action.setProjectId(allocationRequest.getProjectId());
        action.setProjectProgressId(progress.getProjectProgressId());
        action.setStockAllocationRequestId(requestId);
        action.setActionBy(userId);

        projectActionRepository.save(action);

        allocationRequest.setRequestStatus((short) 8);
        allocationRequest.setAllocatedBy(userId);
        allocationRequest.setAllocatedAt(java.time.LocalDateTime.now());

        return requestRepository.save(allocationRequest);
    }
	
    @Transactional
    public StockAllocationRequest allocateRequestByJobNumber(
            String jobNumber,
            Integer userId) {

        if (jobNumber == null || jobNumber.isBlank() || userId == null) {
            throw new IllegalArgumentException(
                    "Job number and logged-in user are required.");
        }

        StockAllocationRequest request = requestRepository
                .findByJobNumberForUpdate(jobNumber)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Stock allocation job not found: " + jobNumber));

        return allocateRequest(
                request.getStockAllocationRequestId(),
                userId);
    }
	

	@Transactional(readOnly = true)
	public List<StockAllocationRequestItemResponse> getRequestItems(
	        Integer requestId) {
	
	    return requestItemRepository
	            .findByStockAllocationRequestId(requestId)
	            .stream()
	            .map(item -> {
	                var itemMaster = itemMasterRepository
	                        .findById(item.getItemId())
	                        .orElseThrow(() -> new IllegalStateException(
	                                "Item not found: " + item.getItemId()));
	
	                Long availableQuantity =
	                        itemStockRepository.getAvailableQuantityByItemId(
	                                item.getItemId());
	
	                return new StockAllocationRequestItemResponse(
	                        item.getItemId(),
	                        itemMaster.getItemName(),
	                        itemMaster.getItemCategory(),
	                        item.getRequestedQuantity(),
	                        availableQuantity);
	            })
	            .toList();
	}
	
	@Transactional(readOnly = true)
	public List<ProjectProgressLookupProjection> getProjectProgress(
	        String projectId) {
	
	    if (projectId == null || projectId.isBlank()) {
	        throw new IllegalArgumentException("Project ID is required.");
	    }
	
	    return projectProgressRepository.findAvailableForStockRequest(projectId);
	}
	
	@Transactional(readOnly = true)
	public List<StockAllocationRequestResponse> getAllocatedRequests() {
	    List<StockAllocationRequest> requests =
	            requestRepository.findByRequestStatusOrderByRequestedAtAsc((short) 8);

	    return requests.stream()
	            .map(request -> new StockAllocationRequestResponse(
	                    request.getStockAllocationRequestId(),
	                    request.getJobNumber(),
	                    request.getProjectId(),
	                    request.getProjectProgressId(),
	                    request.getRequestStatus(),
	                    request.getRequestedBy(),
	                    request.getRequestedAt(),
	                    getRequestItems(request.getStockAllocationRequestId())
	            ))
	            .toList();
	}

}
