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

import com.pmsservice.dto.QuotationVersionHistoryResponse;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.pmsservice.dto.CreateQuotationRequest;
import com.pmsservice.dto.QuotationResponse;
import com.pmsservice.dto.QuotationTaskRequest;
import com.pmsservice.dto.QuotationTaskResponse;
import com.pmsservice.dto.UpdateQuotationRequest;
import com.pmsservice.entity.QuotationDetail;
import com.pmsservice.entity.QuotationTaskDetail;
import com.pmsservice.entity.QuotationVersion;
import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.enums.QuotationStatus;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.repository.QuotationDetailRepository;
import com.pmsservice.repository.QuotationTaskDetailRepository;
import com.pmsservice.repository.QuotationVersionRepository;
import com.pmsservice.repository.StakeholderRepository;
import com.pmsservice.repository.UserAccountRepository;
import com.pmsservice.repository.BudgetRepository;
import com.pmsservice.dto.QuotationListResponse;
import com.pmsservice.util.DateUtils;

@Service
public class QuotationService {

	private final QuotationDetailRepository quotationDetailRepository;
	private final QuotationVersionRepository quotationVersionRepository;
	private final QuotationTaskDetailRepository quotationTaskDetailRepository;
	private final StakeholderRepository stakeholderRepository;
	private final UserAccountRepository userAccountRepository;
	private final BudgetRepository budgetRepository;
	private final TemplateEngine templateEngine;

	public QuotationService(QuotationDetailRepository quotationDetailRepository,
			QuotationVersionRepository quotationVersionRepository, BudgetRepository budgetRepository,
			QuotationTaskDetailRepository quotationTaskDetailRepository, StakeholderRepository stakeholderRepository,
			UserAccountRepository userAccountRepository, TemplateEngine templateEngine) {

		this.quotationDetailRepository = quotationDetailRepository;
		this.quotationVersionRepository = quotationVersionRepository;
		this.budgetRepository = budgetRepository;
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
		quotationDetail.setQuotaStatus(QuotationStatus.DRAFTING);

		quotationDetailRepository.save(quotationDetail);

		/*
		 * 2. Prepare task details.
		 *
		 * Task-level price is calculated from quantity and unit cost. The
		 * quotation-level market price and total are supplied by the frontend through
		 * the request.
		 */

		List<QuotationTaskDetail> taskDetails = new ArrayList<>();

		for (QuotationTaskRequest taskRequest : request.getTasks()) {

			BigDecimal price = taskRequest.getUnitCost().multiply(BigDecimal.valueOf(taskRequest.getQuantity()));

			QuotationTaskDetail taskDetail = new QuotationTaskDetail();

			taskDetail.setQuotationId(quotationId);
			taskDetail.setVersionNumber((short) 1);
			taskDetail.setTaskName(taskRequest.getTaskName());
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
		quotationVersion.setQuoteStatus(QuotationStatus.DRAFTING);
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

		if (quotationVersion.getQuoteStatus() != QuotationStatus.DRAFTING) {
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

		List<QuotationTaskDetail> existingTasks = quotationTaskDetailRepository
				.findByQuotationIdAndVersionNumber(quotationId, currentVersion);

		quotationTaskDetailRepository.deleteAll(existingTasks);

		List<QuotationTaskDetail> taskDetails = new ArrayList<>();

		for (QuotationTaskRequest taskRequest : request.getTasks()) {

			BigDecimal price = taskRequest.getUnitCost().multiply(BigDecimal.valueOf(taskRequest.getQuantity()));

			QuotationTaskDetail taskDetail = new QuotationTaskDetail();

			taskDetail.setQuotationId(quotationId);
			taskDetail.setVersionNumber(currentVersion);
			taskDetail.setTaskName(taskRequest.getTaskName());
			taskDetail.setSubTaskName(taskRequest.getSubTaskName());
			taskDetail.setQuantity(taskRequest.getQuantity());
			taskDetail.setUnit(taskRequest.getUnit());
			taskDetail.setUnitCost(taskRequest.getUnitCost());
			taskDetail.setPrice(price);

			taskDetails.add(taskDetail);
		}

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
		 * Save updated task details.
		 */

		List<QuotationTaskResponse> taskResponses = new ArrayList<>();

		for (QuotationTaskDetail taskDetail : taskDetails) {

			QuotationTaskDetail savedTask = quotationTaskDetailRepository.save(taskDetail);

			taskResponses.add(toTaskResponse(savedTask));
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

		if (quotationVersion.getQuoteStatus() != QuotationStatus.DRAFTING) {
			throw new IllegalStateException("Only quotations in Drafting status can be sent to the customer.");
		}

		quotationVersion.setQuoteStatus(QuotationStatus.SENT_TO_CUSTOMER);

		quotationDetail.setQuotaStatus(QuotationStatus.SENT_TO_CUSTOMER);

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

		if (quotationVersion.getQuoteStatus() != QuotationStatus.SENT_TO_CUSTOMER) {

			throw new IllegalStateException("Only quotations in Sent to Customer status can be accepted.");
		}

		quotationVersion.setQuoteStatus(QuotationStatus.ACCEPTED);

		quotationDetail.setQuotaStatus(QuotationStatus.ACCEPTED);

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

		if (quotationVersion.getQuoteStatus() != QuotationStatus.SENT_TO_CUSTOMER) {

			throw new IllegalStateException("Only quotations in Sent to Customer status can be rejected.");
		}

		quotationVersion.setQuoteStatus(QuotationStatus.REJECTED);

		quotationDetail.setQuotaStatus(QuotationStatus.REJECTED);

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

		QuotationStatus currentStatus = currentQuotationVersion.getQuoteStatus();

		if (currentStatus != QuotationStatus.ACCEPTED && currentStatus != QuotationStatus.REJECTED) {

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
		newQuotationVersion.setQuoteStatus(QuotationStatus.DRAFTING);
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
			newTask.setTaskName(currentTask.getTaskName());
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
		quotationDetail.setQuotaStatus(QuotationStatus.DRAFTING);

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

		response.setQuoteStatus(quotationVersion.getQuoteStatus().getDatabaseValue());

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

			response.setQuoteStatus(quotationVersion.getQuoteStatus().getDatabaseValue());

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
		response.setTaskName(taskDetail.getTaskName());
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

					response.setQuoteStatus(version.getQuoteStatus());

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

	    BudgetInfo budgetInfo = budgetRepository.findByQuotationId(quotationId)
	            .orElseGet(() -> {
	                BudgetInfo newBudget = new BudgetInfo();
	                newBudget.setQuotationId(quotationId);
	                newBudget.setPurchaseMaterial(BigDecimal.ZERO);
	                newBudget.setSubcontractor(BigDecimal.ZERO);
	                newBudget.setLabourForces(BigDecimal.ZERO);
	                newBudget.setTransportLogistics(BigDecimal.ZERO);
	                newBudget.setMiscellaneous(BigDecimal.ZERO);
	                newBudget.setStatus(true);
	                return newBudget;
	            });

	    budgetInfo.setTotalBudget(quotationTotal);

	    budgetRepository.save(budgetInfo);
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