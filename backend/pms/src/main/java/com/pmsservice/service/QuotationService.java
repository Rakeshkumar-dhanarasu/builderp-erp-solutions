package com.pmsservice.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.pmsservice.dto.quotations.CreateQuotationRequest;
import com.pmsservice.dto.quotations.QuotationListResponse;
import com.pmsservice.dto.quotations.QuotationResponse;
import com.pmsservice.dto.quotations.QuotationTaskRequest;
import com.pmsservice.dto.quotations.QuotationTaskResponse;
import com.pmsservice.dto.quotations.QuotationVersionHistoryResponse;
import com.pmsservice.dto.quotations.UpdateQuotationRequest;
import com.pmsservice.entity.QuotationDetail;
import com.pmsservice.entity.QuotationTaskDetail;
import com.pmsservice.entity.QuotationVersion;
import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.entity.BudgetCategoryBalance;
import com.pmsservice.entity.BudgetCategoryBalanceId;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.repository.BudgetCategoryBalanceRepository;
import com.pmsservice.repository.QuotationDetailRepository;
import com.pmsservice.repository.QuotationTaskDetailRepository;
import com.pmsservice.repository.QuotationVersionRepository;
import com.pmsservice.repository.StakeholderRepository;
import com.pmsservice.repository.UserAccountRepository;
import com.pmsservice.repository.BudgetRepository;
import com.pmsservice.util.DateUtils;

@Service
public class QuotationService {

	private final QuotationDetailRepository quotationDetailRepository;
	private final QuotationVersionRepository quotationVersionRepository;
	private final QuotationTaskDetailRepository quotationTaskDetailRepository;
	private final StakeholderRepository stakeholderRepository;
	private final UserAccountRepository userAccountRepository;
	private final BudgetRepository budgetRepository;
	private final BudgetCategoryBalanceRepository budgetCategoryBalanceRepository;
	private final TemplateEngine templateEngine;

	public QuotationService(
	        QuotationDetailRepository quotationDetailRepository, QuotationVersionRepository quotationVersionRepository,
	        BudgetRepository budgetRepository, BudgetCategoryBalanceRepository budgetCategoryBalanceRepository,
	        QuotationTaskDetailRepository quotationTaskDetailRepository, StakeholderRepository stakeholderRepository,
	        UserAccountRepository userAccountRepository, TemplateEngine templateEngine
	        ) 
		{
	    this.quotationDetailRepository = quotationDetailRepository;
	    this.quotationVersionRepository = quotationVersionRepository;
	    this.budgetRepository = budgetRepository;
	    this.budgetCategoryBalanceRepository = budgetCategoryBalanceRepository;
	    this.quotationTaskDetailRepository = quotationTaskDetailRepository;
	    this.stakeholderRepository = stakeholderRepository;
	    this.userAccountRepository = userAccountRepository;
	    this.templateEngine = templateEngine;
	}

	@Transactional
	public QuotationResponse createQuotation(CreateQuotationRequest request) {

		Integer customerId = request.getCustomerId();

		StakeholderInfo customer = stakeholderRepository.findById(customerId)
				.orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));

		if (customer.getStakeholderCategory() != StakeholderType.CUSTOMER) {
			throw new IllegalArgumentException("Selected stakeholder is not a customer");
		}

		Integer loggedInUserId = getLoggedInUserId();
		String loggedInUserName = getUserName(loggedInUserId);

		String quotationId = generateQuotationNumber();

		String currencyCode = request.getCurrencyCode().trim().toUpperCase();

		LocalDate draftDate = request.getDraftDate();
		LocalDate expiryDate = request.getExpiryDate();

		if (expiryDate.isBefore(draftDate)) {
			throw new IllegalArgumentException("Expiry date cannot be before draft date");
		}

		String customerName = buildCustomerName(customer);

		/*
		 * 1. Create quotation header
		 */

		QuotationDetail quotationDetail = new QuotationDetail();

		quotationDetail.setQuotationId(quotationId);
		quotationDetail.setCustomerId(customerId);
		quotationDetail.setCustomer(customerName);
		quotationDetail.setDraftedBy(loggedInUserName);
		quotationDetail.setDraftDate(draftDate);
		quotationDetail.setExpiryDate(expiryDate);
		quotationDetail.setSiteAddress(request.getSiteAddress());
		quotationDetail.setAddComments(request.getAddComments());
		quotationDetail.setCurrentVersion((short) 1);
		quotationDetail.setQuoteStatus((short) 0);

		quotationDetailRepository.save(quotationDetail);

		/*
		 * 2. Prepare task details.
		 *
		 * Task-level price is calculated from quantity and unit cost. The
		 * quotation-level market price and total are supplied by the frontend through
		 * the request.
		 */

		List<QuotationTaskDetail> taskDetails = new ArrayList<>();
		short taskId = 0;
		short subTaskId = 0;
		String previousTaskName = null;

		for (QuotationTaskRequest taskRequest : request.getTasks()) {
			
			String currentTaskName = taskRequest.getTaskName().trim();

		    if (!currentTaskName.equals(previousTaskName)) {
		        taskId++;
		        subTaskId = 1;
		        previousTaskName = currentTaskName;
		    } else {
		        subTaskId++;
		    }

			BigDecimal price = taskRequest.getUnitCost().multiply(BigDecimal.valueOf(taskRequest.getQuantity()));

			QuotationTaskDetail taskDetail = new QuotationTaskDetail();

			taskDetail.setQuotationId(quotationId);
			taskDetail.setVersionNumber((short) 1);
			taskDetail.setTaskId(taskId);
		    taskDetail.setTaskName(currentTaskName);
		    taskDetail.setSubTaskId(subTaskId);
			taskDetail.setSubTaskName(taskRequest.getSubTaskName());
			taskDetail.setQuantity(taskRequest.getQuantity());
			taskDetail.setUnit(taskRequest.getUnit());
			taskDetail.setUnitCost(taskRequest.getUnitCost());
			taskDetail.setPrice(price);

			taskDetails.add(taskDetail);
		}

		/*
		 * 3. Create quotation version before task details because
		 * quotation_task_details has a foreign key to quotation_versions.
		 */

		QuotationVersion quotationVersion = new QuotationVersion();

		quotationVersion.setQuotationId(quotationId);
		quotationVersion.setVersionNumber((short) 1);
		quotationVersion.setDraftedAt(draftDate);
		quotationVersion.setDraftedBy(loggedInUserName);
		quotationVersion.setQuoteStatus((short) 0);
		quotationVersion.setExpiredAt(expiryDate);
		quotationVersion.setAddComments(request.getAddComments());

		quotationVersion.setMarketPrice(request.getMarketPrice());
		quotationVersion.setTaxPercent(request.getTaxPercent());
		quotationVersion.setDiscountAmount(request.getDiscountAmount());
		quotationVersion.setTotal(request.getTotal());
		quotationVersion.setCurrencyCode(currencyCode);

		quotationVersionRepository.save(quotationVersion);

		/*
		 * 4. Save task details.
		 */

		List<QuotationTaskResponse> taskResponses = new ArrayList<>();

		for (QuotationTaskDetail taskDetail : taskDetails) {

			QuotationTaskDetail savedTask = quotationTaskDetailRepository.save(taskDetail);

			taskResponses.add(toTaskResponse(savedTask));
		}

		/*
		 * 5. Build response.
		 */

		return buildQuotationResponse(quotationDetail, quotationVersion, taskResponses);
	}

	@Transactional(readOnly = true)
	public QuotationResponse getQuotation(String quotationId) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion quotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		List<QuotationTaskDetail> taskDetails = quotationTaskDetailRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion);

		List<QuotationTaskResponse> taskResponses = new ArrayList<>();

		for (QuotationTaskDetail taskDetail : taskDetails) {
			taskResponses.add(toTaskResponse(taskDetail));
		}

		return buildQuotationResponse(quotationDetail, quotationVersion, taskResponses);
	}

	@Transactional
	public QuotationResponse updateQuotation(String quotationId, UpdateQuotationRequest request) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion quotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		if (quotationVersion.getQuoteStatus() != (short) 0) {
			throw new IllegalStateException("Only quotations in Drafting status can be edited.");
		}

		if (request.getExpiryDate().isBefore(quotationDetail.getDraftDate())) {
			throw new IllegalArgumentException("Expiry date cannot be before the draft date.");
		}

		/*
		 * Update quotation-level values.
		 */

		quotationDetail.setExpiryDate(request.getExpiryDate());
		quotationDetail.setSiteAddress(request.getSiteAddress());
		quotationDetail.setAddComments(request.getAddComments());

		quotationDetailRepository.save(quotationDetail);

		/*
		 * Replace task details for the current Drafting version.
		 */

		List<QuotationTaskDetail> existingTasks = quotationTaskDetailRepository.findByQuotationIdAndVersionNumber(quotationId, currentVersion);

		quotationTaskDetailRepository.deleteAll(existingTasks);

		short taskId = 0;
		short subTaskId = 0;
		String previousTaskName = null;

		List<QuotationTaskDetail> updatedTaskDetails = new ArrayList<>();

		for (QuotationTaskRequest taskRequest : request.getTasks()) {
		    String currentTaskName = taskRequest.getTaskName().trim();

		    if (!currentTaskName.equals(previousTaskName)) {
		        taskId++;
		        subTaskId = 1;
		        previousTaskName = currentTaskName;
		    } else {
		        subTaskId++;
		    }

		    BigDecimal price = taskRequest.getUnitCost().multiply(BigDecimal.valueOf(taskRequest.getQuantity()));
			
		    QuotationTaskDetail taskDetail = new QuotationTaskDetail();
		    taskDetail.setQuotationId(quotationId);
		    taskDetail.setVersionNumber(currentVersion);
		    taskDetail.setTaskId(taskId);
		    taskDetail.setTaskName(currentTaskName);
		    taskDetail.setSubTaskId(subTaskId);
		    taskDetail.setSubTaskName(taskRequest.getSubTaskName());
		    taskDetail.setQuantity(taskRequest.getQuantity());
		    taskDetail.setUnit(taskRequest.getUnit());
		    taskDetail.setUnitCost(taskRequest.getUnitCost());
		    taskDetail.setPrice(price);

		    updatedTaskDetails.add(taskDetail);
		}

		quotationTaskDetailRepository.saveAll(updatedTaskDetails);;

		/*
		 * Update current version.
		 *
		 * Financial values are supplied by the frontend.
		 */

		quotationVersion.setExpiredAt(request.getExpiryDate());
		quotationVersion.setAddComments(request.getAddComments());
		quotationVersion.setMarketPrice(request.getMarketPrice());
		quotationVersion.setTaxPercent(request.getTaxPercent());
		quotationVersion.setDiscountAmount(request.getDiscountAmount());
		quotationVersion.setTotal(request.getTotal());

		quotationVersionRepository.save(quotationVersion);

		/*
		 * Build task responses.
		 */
		List<QuotationTaskResponse> taskResponses = new ArrayList<>();

		for (QuotationTaskDetail taskDetail : updatedTaskDetails) {
		    taskResponses.add(toTaskResponse(taskDetail));
		}

		return buildQuotationResponse(quotationDetail, quotationVersion, taskResponses);
	}

	@Transactional
	public QuotationResponse sendQuotation(String quotationId) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion quotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		if (quotationVersion.getQuoteStatus() != (short) 0) {
			throw new IllegalStateException("Only quotations in Drafting status can be sent to the customer.");
		}

		quotationVersion.setQuoteStatus((short) 1);
		quotationDetail.setQuoteStatus((short) 1);

		quotationVersionRepository.save(quotationVersion);
		quotationDetailRepository.save(quotationDetail);

		return getQuotation(quotationId);
	}

	@Transactional
	public QuotationResponse acceptQuotation(String quotationId) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion quotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		if (quotationVersion.getQuoteStatus() != (short) 1) {

			throw new IllegalStateException("Only quotations in Sent to Customer status can be accepted.");
		}

		quotationVersion.setQuoteStatus((short) 3);
		quotationDetail.setQuoteStatus((short) 3);

		quotationVersionRepository.save(quotationVersion);
		quotationDetailRepository.save(quotationDetail);
		
		createOrUpdateBudget(quotationId, quotationVersion.getTotal());

		return getQuotation(quotationId);
	}

	@Transactional
	public QuotationResponse rejectQuotation(String quotationId) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion quotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		if (quotationVersion.getQuoteStatus() != (short) 1) {

			throw new IllegalStateException("Only quotations in Sent to Customer status can be rejected.");
		}

		quotationVersion.setQuoteStatus((short) 4);

		quotationDetail.setQuoteStatus((short) 4);;

		quotationVersionRepository.save(quotationVersion);
		quotationDetailRepository.save(quotationDetail);

		return getQuotation(quotationId);
	}

	@Transactional
	public QuotationResponse createNewVersion(String quotationId) {

		QuotationDetail quotationDetail = quotationDetailRepository.findById(quotationId)
				.orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));

		Short currentVersion = quotationDetail.getCurrentVersion();

		QuotationVersion currentQuotationVersion = quotationVersionRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion)
				.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
						+ quotationId + ", version: " + currentVersion));

		Short currentStatus = currentQuotationVersion.getQuoteStatus();

		if (currentStatus != (short) 3 && currentStatus != (short) 4) {

			throw new IllegalStateException(
					"A new version can only be created after the customer has accepted or rejected the current version.");
		}

		short newVersionNumber = (short) (currentVersion + 1);

		if (newVersionNumber <= 0) {
			throw new IllegalStateException("Quotation version limit reached.");
		}

		/*
		 * Create the new quotation version.
		 *
		 * All quotation values are copied from the previous version, except version
		 * number, status, drafted date and drafted by.
		 */

		LocalDate newDraftDate = LocalDate.now();

		Integer loggedInUserId = getLoggedInUserId();
		String loggedInUserName = getUserName(loggedInUserId);

		QuotationVersion newQuotationVersion = new QuotationVersion();

		newQuotationVersion.setQuotationId(quotationId);
		newQuotationVersion.setVersionNumber(newVersionNumber);
		newQuotationVersion.setDraftedAt(newDraftDate);
		newQuotationVersion.setDraftedBy(loggedInUserName);
		newQuotationVersion.setQuoteStatus((short) 0);
		newQuotationVersion.setExpiredAt(newDraftDate);
		newQuotationVersion.setAddComments(currentQuotationVersion.getAddComments());
		newQuotationVersion.setMarketPrice(currentQuotationVersion.getMarketPrice());
		newQuotationVersion.setTaxPercent(currentQuotationVersion.getTaxPercent());
		newQuotationVersion.setDiscountAmount(currentQuotationVersion.getDiscountAmount());
		newQuotationVersion.setTotal(currentQuotationVersion.getTotal());
		newQuotationVersion.setCurrencyCode(currentQuotationVersion.getCurrencyCode());

		/*
		 * Save the new version before saving its tasks because quotation_task_details
		 * has a foreign key to quotation_versions.
		 */

		quotationVersionRepository.save(newQuotationVersion);

		/*
		 * Copy all tasks from the current version.
		 */

		List<QuotationTaskDetail> currentTasks = quotationTaskDetailRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion);

		for (QuotationTaskDetail currentTask : currentTasks) {

			QuotationTaskDetail newTask = new QuotationTaskDetail();

			newTask.setQuotationId(quotationId);
			newTask.setVersionNumber(newVersionNumber);
			newTask.setTaskId(currentTask.getTaskId());
		    newTask.setTaskName(currentTask.getTaskName());
		    newTask.setSubTaskId(currentTask.getSubTaskId());
			newTask.setSubTaskName(currentTask.getSubTaskName());
			newTask.setQuantity(currentTask.getQuantity());
			newTask.setUnit(currentTask.getUnit());
			newTask.setUnitCost(currentTask.getUnitCost());
			newTask.setPrice(currentTask.getPrice());

			quotationTaskDetailRepository.save(newTask);
		}

		/*
		 * Make the new version the current version of the quotation.
		 */

		quotationDetail.setCurrentVersion(newVersionNumber);
		quotationDetail.setDraftDate(newDraftDate);
		quotationDetail.setExpiryDate(newDraftDate);
		quotationDetail.setQuoteStatus((short) 0);

		quotationDetailRepository.save(quotationDetail);

		return getQuotation(quotationId);
	}

	/*
	 * Helper methods
	 */

	private QuotationResponse buildQuotationResponse(QuotationDetail quotationDetail, QuotationVersion quotationVersion,
			List<QuotationTaskResponse> taskResponses) {

		QuotationResponse response = new QuotationResponse();

		response.setQuotationId(quotationDetail.getQuotationId());

		response.setCustomerId(quotationDetail.getCustomerId());

		response.setCustomer(quotationDetail.getCustomer());

		response.setDraftDate(quotationDetail.getDraftDate());

		response.setExpiryDate(quotationDetail.getExpiryDate());

		response.setSiteAddress(quotationDetail.getSiteAddress());

		response.setAddComments(quotationDetail.getAddComments());

		response.setVersionNumber(quotationVersion.getVersionNumber());

		response.setQuoteStatus(getQuoteStatusName(quotationVersion.getQuoteStatus()));

		response.setMarketPrice(quotationVersion.getMarketPrice());

		response.setTaxPercent(quotationVersion.getTaxPercent());

		response.setDiscountAmount(quotationVersion.getDiscountAmount());

		response.setTotal(quotationVersion.getTotal());

		response.setCurrencyCode(quotationVersion.getCurrencyCode());

		response.setTasks(taskResponses);

		return response;
	}

	@Transactional(readOnly = true)
	public List<QuotationListResponse> getAllQuotations() {

		List<QuotationDetail> quotationDetails = quotationDetailRepository.findAll();

		List<QuotationListResponse> responses = new ArrayList<>();

		for (QuotationDetail quotationDetail : quotationDetails) {

			Short currentVersion = quotationDetail.getCurrentVersion();

			QuotationVersion quotationVersion = quotationVersionRepository
					.findByQuotationIdAndVersionNumber(quotationDetail.getQuotationId(), currentVersion)
					.orElseThrow(() -> new IllegalStateException("Quotation version not found for quotation ID: "
							+ quotationDetail.getQuotationId() + ", version: " + currentVersion));

			QuotationListResponse response = new QuotationListResponse();

			response.setQuotationId(quotationDetail.getQuotationId());

			response.setCustomer(quotationDetail.getCustomer());

			response.setQuoteStatus(getQuoteStatusName(quotationVersion.getQuoteStatus()));

			response.setVersionNumber(quotationVersion.getVersionNumber());

			response.setTotal(quotationVersion.getTotal());

			response.setCurrencyCode(quotationVersion.getCurrencyCode());

			response.setDraftedAt(quotationVersion.getDraftedAt());

			responses.add(response);
		}

		return responses;
	}

	private QuotationTaskResponse toTaskResponse(QuotationTaskDetail taskDetail) {

		QuotationTaskResponse response = new QuotationTaskResponse();

		response.setUtid(taskDetail.getUtid());
	    response.setTaskId(taskDetail.getTaskId());
	    response.setTaskName(taskDetail.getTaskName());
	    response.setSubTaskId(taskDetail.getSubTaskId());
	    response.setSubTaskName(taskDetail.getSubTaskName());
	    response.setQuantity(taskDetail.getQuantity());
	    response.setUnit(taskDetail.getUnit());
	    response.setUnitCost(taskDetail.getUnitCost());
	    response.setPrice(taskDetail.getPrice());

		return response;
	}

	public List<QuotationVersionHistoryResponse> getQuotationVersionHistory(String quotationId) {

		quotationDetailRepository.findById(quotationId).orElseThrow(() -> new RuntimeException("Quotation not found"));

		List<QuotationVersionHistoryResponse> history = quotationVersionRepository.findAll().stream()
				.filter(version -> version.getQuotationId().equals(quotationId))
				.sorted((version1, version2) -> version2.getVersionNumber().compareTo(version1.getVersionNumber()))
				.map(version -> {

					QuotationVersionHistoryResponse response = new QuotationVersionHistoryResponse();

					response.setVersionNumber(version.getVersionNumber());

					response.setDraftedAt(version.getDraftedAt());

					response.setExpiredAt(version.getExpiredAt());

					response.setQuoteStatus(getQuoteStatusName(version.getQuoteStatus()));

					response.setMarketPrice(version.getMarketPrice());

					response.setDiscountAmount(version.getDiscountAmount());

					response.setTaxPercent(version.getTaxPercent());

					response.setTotal(version.getTotal());

					response.setCurrencyCode(version.getCurrencyCode());

					response.setDraftedBy(version.getDraftedBy());

					response.setAddComments(version.getAddComments());

					return response;
				}).toList();

		return history;
	}

	private String generateQuotationNumber() {

		int currentYear = LocalDate.now().getYear();

		String yearSuffix = String.format("%02d", currentYear % 100);

		String prefix = "AMI" + yearSuffix + "QT";

		int nextSequence = quotationDetailRepository.findTopByQuotationIdStartingWithOrderByQuotationIdDesc(prefix)
				.map(quotation -> {

					String sequencePart = quotation.getQuotationId().substring(prefix.length());

					return Integer.parseInt(sequencePart) + 1;
				}).orElse(1);

		if (nextSequence > 9999) {
			throw new IllegalStateException("Quotation sequence limit reached for year " + currentYear);
		}

		return prefix + String.format("%04d", nextSequence);
	}

	private Integer getLoggedInUserId() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {

			throw new IllegalStateException("Authenticated JWT user information is not available");
		}

		Number userIdNumber = jwtAuthentication.getToken().getClaim("user_id");

		if (userIdNumber == null) {
			throw new IllegalStateException("User ID is missing from JWT");
		}

		return userIdNumber.intValue();
	}

	private String getUserName(Integer userId) {

		return userAccountRepository.findById(userId).map(user -> user.getUserName())
				.orElseThrow(() -> new IllegalStateException("Authenticated user not found with ID: " + userId));
	}

	private String buildCustomerName(StakeholderInfo customer) {

		return customer.getFirstName() + " " + customer.getLastName();
	}
	
	private void createOrUpdateBudget(String quotationId, BigDecimal quotationTotal) {

	    var existingBudget = budgetRepository.findByQuotationId(quotationId);

	    BudgetInfo budgetInfo;

	    if (existingBudget.isPresent()) {
	        // Existing budget: update the total without resetting balances.
	        budgetInfo = existingBudget.get();
	        budgetInfo.setTotalBudget(quotationTotal);
	        budgetRepository.save(budgetInfo);
	        return;
	    }

	    // New budget: initialize all category allocations to zero.
	    BudgetInfo newBudget = new BudgetInfo();
	    newBudget.setQuotationId(quotationId);
	    newBudget.setPurchaseMaterial(BigDecimal.ZERO);
	    newBudget.setSubcontractor(BigDecimal.ZERO);
	    newBudget.setLabourForces(BigDecimal.ZERO);
	    newBudget.setTransportLogistics(BigDecimal.ZERO);
	    newBudget.setMiscellaneous(BigDecimal.ZERO);
	    newBudget.setTotalBudget(quotationTotal);
	    newBudget.setStatus(true);

	    // Save first to obtain the generated budget ID.
	    budgetInfo = budgetRepository.save(newBudget);

	    List<String> categories = List.of(
	            "purchase_material",
	            "subcontractor",
	            "labour_forces",
	            "transport_logistics",
	            "miscellaneous"
	    );

	    LocalDate now = LocalDate.now();

	    List<BudgetCategoryBalance> balances = categories.stream()
	            .map(category -> {
	                BudgetCategoryBalance balance = new BudgetCategoryBalance();

	                balance.setId(new BudgetCategoryBalanceId(
	                        budgetInfo.getBudgetId(),
	                        category
	                ));

	                balance.setRemainingAmount(BigDecimal.ZERO);
	                balance.setModifiedAt(now);

	                return balance;
	            })
	            .toList();

	    budgetCategoryBalanceRepository.saveAll(balances);
	}
	
	private String getQuoteStatusName(Short statusId) {
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
	        default -> "Unknown";
	    };
	}

	public byte[] generateQuotationPdf(String quotationId) {

		QuotationResponse quotationResponse = getQuotation(quotationId);

		Map<String, Integer> taskNumbers = new LinkedHashMap<>();
		Map<String, Integer> subTaskCounters = new HashMap<>();
		Map<Integer, String> taskHeaderNumbers = new HashMap<>();
		Map<Integer, String> subTaskNumbers = new HashMap<>();

		for (QuotationTaskResponse item : quotationResponse.getTasks()) {

			String taskName = item.getTaskName();

			Integer taskNumber = taskNumbers.get(taskName);

			if (taskNumber == null) {
				taskNumber = taskNumbers.size() + 1;
				taskNumbers.put(taskName, taskNumber);
			}

			Integer subTaskNumber = subTaskCounters.get(taskName);

			if (subTaskNumber == null) {
				subTaskNumber = 0;
			}

			subTaskNumber++;
			subTaskCounters.put(taskName, subTaskNumber);

			if (subTaskNumber == 1) {
				taskHeaderNumbers.put(item.getUtid(), String.valueOf(taskNumber));
			}

			subTaskNumbers.put(item.getUtid(), taskNumber + "." + subTaskNumber);
		}

		Context context = new Context();
		context.setVariable("quotation", quotationResponse);
		context.setVariable("taskHeaderNumbers", taskHeaderNumbers);
		context.setVariable("subTaskNumbers", subTaskNumbers);
		context.setVariable("formattedDraftDate",DateUtils.formatDateWithOrdinal(quotationResponse.getDraftDate()));

		String html = templateEngine.process("quotation", context);

		try {
			Path debugPath = Path.of("C:/temp/quotation-debug.html");
			Files.createDirectories(debugPath.getParent());
			Files.writeString(debugPath, html, StandardCharsets.UTF_8);

			ClassPathResource quotationResources = new ClassPathResource("quotation/");
			String baseUri = quotationResources.getURL().toString();

			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

			PdfRendererBuilder builder = new PdfRendererBuilder();
			builder.useFastMode();
			builder.withHtmlContent(html, baseUri);
			builder.toStream(outputStream);
			builder.run();

			byte[] pdfBytes = outputStream.toByteArray();
			Path pdfPath = Path.of("C:/temp/quotation.pdf");
			Files.createDirectories(pdfPath.getParent());
			Files.write(pdfPath, pdfBytes);
			System.out.println("Quotation PDF generated at: " + pdfPath.toAbsolutePath());
			return outputStream.toByteArray();

		} catch (Exception e) {
			throw new RuntimeException("Failed to generate quotation PDF", e);
		}
	}
}