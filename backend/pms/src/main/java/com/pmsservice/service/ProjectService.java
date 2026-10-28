package com.pmsservice.service;

import com.pmsservice.dto.projects.CreateProjectRequest;
import com.pmsservice.dto.projects.ProjectDetailResponse;
import com.pmsservice.dto.projects.ProjectListResponse;
import com.pmsservice.dto.projects.ProjectResponse;
import com.pmsservice.entity.BudgetInfo;
import com.pmsservice.entity.ProjectList;
import com.pmsservice.entity.QuotationDetail;
import com.pmsservice.entity.QuotationVersion;
import com.pmsservice.repository.BudgetRepository;
import com.pmsservice.repository.ProjectListRepository;
import com.pmsservice.repository.QuotationDetailRepository;
import com.pmsservice.repository.QuotationVersionRepository;
import com.pmsservice.entity.ProjectProgress;
import com.pmsservice.entity.QuotationTaskDetail;
import com.pmsservice.repository.ProjectProgressRepository;
import com.pmsservice.repository.QuotationTaskDetailRepository;
import com.pmsservice.dto.projects.ProjectProgressTrackingResponse;
import com.pmsservice.projection.ProjectProgressLookupProjection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectListRepository projectListRepository;
    private final QuotationVersionRepository quotationVersionRepository;
    private final QuotationDetailRepository quotationDetailRepository;
    private final BudgetRepository budgetRepository;
    private final ProjectProgressRepository projectProgressRepository;
    private final QuotationTaskDetailRepository quotationTaskDetailRepository;

    public ProjectService(
            ProjectListRepository projectListRepository,
            QuotationVersionRepository quotationVersionRepository,
            QuotationDetailRepository quotationDetailRepository,
            BudgetRepository budgetRepository,
            ProjectProgressRepository projectProgressRepository,
            QuotationTaskDetailRepository quotationTaskDetailRepository) {
        this.projectListRepository = projectListRepository;
        this.quotationVersionRepository = quotationVersionRepository;
        this.quotationDetailRepository = quotationDetailRepository;
        this.budgetRepository = budgetRepository;
        this.projectProgressRepository = projectProgressRepository;
        this.quotationTaskDetailRepository = quotationTaskDetailRepository;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {

        if (request.getProjectName() == null
                || request.getProjectName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name is required");
        }

        if (request.getQuotationId() == null
                || request.getQuotationId().trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID is required");
        }

        if (request.getQuotationVersion() == null) {
            throw new IllegalArgumentException("Quotation version is required");
        }

        if (request.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }

        if (request.getExpectedEndDate() == null) {
            throw new IllegalArgumentException("Expected end date is required");
        }

        if (request.getExpectedEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException(
                    "Expected end date cannot be before the start date");
        }

        /*
         * 1. Verify quotation version.
         */
        QuotationVersion quotationVersion =
                quotationVersionRepository.findByQuotationIdAndVersionNumber(
                        request.getQuotationId(),
                        request.getQuotationVersion().shortValue())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Quotation version not found for quotation ID: "
                                + request.getQuotationId()
                                + ", version: "
                                + request.getQuotationVersion()));

        /*
         * 2. Project can only be created from an Approved quotation.
         *
         * Status 3 = Approved
         */
        if (quotationVersion.getQuoteStatus() != (short) 3) {
            throw new IllegalStateException(
                    "Project can only be created from an Approved quotation.");
        }

        /*
         * 3. Get logged-in user.
         */
        Integer loggedInUserId = getLoggedInUserId();

        /*
         * 4. Generate project ID.
         */
        String projectId = generateProjectNumber();

        /*
         * 5. Create project.
         */
        ProjectList project = new ProjectList();

        project.setProjectId(projectId);
        project.setProjectName(request.getProjectName().trim());
        project.setProjectManagerId(request.getProjectManagerId());
        project.setQuotationId(request.getQuotationId());
        project.setQuotationVersion(request.getQuotationVersion());
        project.setStartDate(request.getStartDate());
        project.setExpectedEndDate(request.getExpectedEndDate());

        /*
         * New project starts at 0% and Initiated.
         *
         * Status 9 = Initiated
         */
        project.setCompletionPercent((short) 0);
        project.setStatus((short) 9);

        project.setCreatedBy(loggedInUserId);
        project.setCreatedDate(LocalDate.now());
        project.setModifiedBy(loggedInUserId);
        project.setModifiedDate(LocalDate.now());


		ProjectList savedProject = projectListRepository.save(project);
		
		/*
		 * 6. Initialize progress for every quotation sub-task.
		 */
		List<QuotationTaskDetail> quotationTasks =
		        quotationTaskDetailRepository.findByQuotationIdAndVersionNumber(
		                savedProject.getQuotationId(),
		                savedProject.getQuotationVersion().shortValue());
		
		if (quotationTasks.isEmpty()) {
		    throw new IllegalStateException(
		            "No task details found for the approved quotation version.");
		}
		
		LocalDateTime now = LocalDateTime.now();
		List<ProjectProgress> progressRecords = new ArrayList<>();
		
		for (QuotationTaskDetail quotationTask : quotationTasks) {
		    ProjectProgress progress = new ProjectProgress();
		
		    progress.setProjectId(savedProject.getProjectId());
		    progress.setQuotationTaskDetailId(quotationTask.getUtid());
		    progress.setTaskId(quotationTask.getTaskId());
		    progress.setSubTaskId(quotationTask.getSubTaskId());
		    progress.setTargetQuantity(quotationTask.getQuantity());
		    progress.setQuantityCompleted(0);
		    progress.setStatus((short) 9);
		    progress.setUpdatedAt(now);
		    progress.setUpdatedBy(loggedInUserId);
		
		    progressRecords.add(progress);
		}
		
		projectProgressRepository.saveAll(progressRecords);
		
		return toProjectResponse(savedProject);

    }

    /*
     * Get all projects for the project list.
     */
    @Transactional(readOnly = true)
    public List<ProjectListResponse> getAllProjects() {

        List<ProjectList> projects =
                projectListRepository.findAll();

        return projects.stream()
                .map(this::toProjectListResponse)
                .toList();
    }

    /*
     * Get complete project-level information.
     */
    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetails(String projectId) {

        ProjectList project =
                projectListRepository.findById(projectId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Project not found: " + projectId));

        return toProjectDetailResponse(project);
    }
    

    @Transactional(readOnly = true)
    public ProjectProgressTrackingResponse getProjectProgress(String projectId) {

        if (!projectListRepository.existsById(projectId)) {
            throw new IllegalArgumentException("Project not found: " + projectId);
        }

        List<ProjectProgressLookupProjection> progressRecords =
                projectProgressRepository.findProgressForProject(projectId);

        int totalSubTasks = progressRecords.size();

        int completedSubTasks = (int) progressRecords.stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == 13)
                .count();

        int inProgressSubTasks = (int) progressRecords.stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == 10)
                .count();

        int initiatedSubTasks = (int) progressRecords.stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == 9)
                .count();

        Map<Short, List<ProjectProgressLookupProjection>> tasks =
                progressRecords.stream()
                        .collect(Collectors.groupingBy(
                                ProjectProgressLookupProjection::getTaskId));

        int totalTasks = tasks.size();

        int completedTasks = (int) tasks.values().stream()
                .filter(subTasks -> subTasks.stream()
                        .allMatch(p -> p.getStatus() != null
                                && p.getStatus() == 13))
                .count();

        // Quantity-based completion is not available in this projection.
        // Keep the existing response field at zero until quantity data
        // is intentionally added back to the tracking query.
        BigDecimal completionPercentage = BigDecimal.ZERO;

        return new ProjectProgressTrackingResponse(
                projectId,
                totalTasks,
                completedTasks,
                totalSubTasks,
                completedSubTasks,
                inProgressSubTasks,
                initiatedSubTasks,
                completionPercentage,
                progressRecords);
    }
	
    @Transactional(readOnly = true)
    public List<ProjectProgressLookupProjection>
            getProgressAvailableForStockRequest(String projectId) {

        if (!projectListRepository.existsById(projectId)) {
            throw new IllegalArgumentException("Project not found: " + projectId);
        }

        return projectProgressRepository.findAvailableForStockRequest(projectId);
    }
    
    @Transactional
    public void synchronizeProjectStatus(String projectId) {

        ProjectList project = projectListRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Project not found: " + projectId));

        List<ProjectProgress> progressRecords =
                projectProgressRepository.findByProjectId(projectId);

        // Do not change the project status if it has no progress records.
        if (progressRecords.isEmpty()) {
            return;
        }

        List<Short> statuses = progressRecords.stream()
                .map(ProjectProgress::getStatus)
                .toList();

        short newStatus;

        // All sub-tasks must be completed before the project is completed.
        if (statuses.stream().allMatch(status ->
                status != null && status == 13)) {
            newStatus = 13;
        }
        // An On Hold sub-task takes precedence over other active statuses.
        else if (statuses.stream().anyMatch(status ->
                status != null && status == 12)) {
            newStatus = 12;
        }
        // A Delayed sub-task makes the overall project Delayed.
        else if (statuses.stream().anyMatch(status ->
                status != null && status == 11)) {
            newStatus = 11;
        }
        // At least one sub-task has started.
        else if (statuses.stream().anyMatch(status ->
                status != null && status == 10)) {
            newStatus = 10;
        }
        // Every sub-task is still Initiated.
        else if (statuses.stream().allMatch(status ->
                status != null && status == 9)) {
            newStatus = 9;
        } else {
            // Preserve the current project status for unhandled status combinations.
            return;
        }

        if (project.getStatus() != newStatus) {
            project.setStatus(newStatus);
            project.setModifiedDate(LocalDate.now());
            project.setModifiedBy(getLoggedInUserId());

            projectListRepository.save(project);
        }
    }

    private String generateProjectNumber() {

        int currentYear = LocalDate.now().getYear();
        String yearSuffix = String.format("%02d", currentYear % 100);

        String prefix = "AMI" + yearSuffix + "PJ";

        int nextSequence = projectListRepository
                .findTopByProjectIdStartingWithOrderByProjectIdDesc(prefix)
                .map(project -> {
                    String sequencePart =
                            project.getProjectId().substring(prefix.length());

                    return Integer.parseInt(sequencePart) + 1;
                })
                .orElse(1);

        if (nextSequence > 9999) {
            throw new IllegalStateException(
                    "Project sequence limit reached for year " + currentYear);
        }

        return prefix + String.format("%04d", nextSequence);
    }

    private Integer getLoggedInUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException(
                    "Authenticated JWT user information is not available");
        }

        Number userIdNumber =
                jwtAuthentication.getToken().getClaim("user_id");

        if (userIdNumber == null) {
            throw new IllegalStateException(
                    "User ID is missing from JWT");
        }

        return userIdNumber.intValue();
    }

    /*
     * Existing create-project response.
     */
    private ProjectResponse toProjectResponse(ProjectList project) {

        ProjectResponse response = new ProjectResponse();

        response.setProjectId(project.getProjectId());
        response.setProjectName(project.getProjectName());
        response.setProjectManagerId(project.getProjectManagerId());
        response.setQuotationId(project.getQuotationId());
        response.setQuotationVersion(project.getQuotationVersion());
        response.setStartDate(project.getStartDate());
        response.setExpectedEndDate(project.getExpectedEndDate());
        response.setCompletionPercent(project.getCompletionPercent());
        response.setStatus(getProjectStatusName(project.getStatus()));

        QuotationDetail quotationDetail =
                quotationDetailRepository.findById(project.getQuotationId())
                        .orElseThrow(() -> new IllegalStateException(
                                "Quotation details not found for quotation ID: "
                                        + project.getQuotationId()));

        response.setCustomer(quotationDetail.getCustomer());

        return response;
    }

    /*
     * Map project information required for the project table.
     */
    private ProjectListResponse toProjectListResponse(ProjectList project) {

        ProjectListResponse response = new ProjectListResponse();

        response.setProjectId(project.getProjectId());
        response.setProjectName(project.getProjectName());
        response.setStatus(getProjectStatusName(project.getStatus()));

        QuotationDetail quotationDetail =
                quotationDetailRepository.findById(project.getQuotationId())
                        .orElseThrow(() -> new IllegalStateException(
                                "Quotation details not found for quotation ID: "
                                        + project.getQuotationId()));

        response.setCustomer(quotationDetail.getCustomer());

        BudgetInfo budgetInfo =
                budgetRepository.findByQuotationId(project.getQuotationId())
                        .orElse(null);

        response.setBudgetAllocated(
                budgetInfo != null
                        ? budgetInfo.getTotalBudget()
                        : BigDecimal.ZERO);

        return response;
    }

    /*
     * Map complete project-level information.
     */
    private ProjectDetailResponse toProjectDetailResponse(ProjectList project) {

        ProjectDetailResponse response = new ProjectDetailResponse();

        response.setProjectId(project.getProjectId());
        response.setProjectName(project.getProjectName());
        response.setProjectManagerId(project.getProjectManagerId());
        response.setQuotationId(project.getQuotationId());
        response.setQuotationVersion(project.getQuotationVersion());
        response.setStartDate(project.getStartDate());
        response.setExpectedEndDate(project.getExpectedEndDate());
        response.setCompletionPercent(project.getCompletionPercent());
        response.setStatus(getProjectStatusName(project.getStatus()));

        QuotationDetail quotationDetail =
                quotationDetailRepository.findById(project.getQuotationId())
                        .orElseThrow(() -> new IllegalStateException(
                                "Quotation details not found for quotation ID: "
                                        + project.getQuotationId()));

        response.setCustomer(quotationDetail.getCustomer());
        response.setSiteAddress(quotationDetail.getSiteAddress());

        BudgetInfo budgetInfo =
                budgetRepository.findByQuotationId(project.getQuotationId())
                        .orElse(null);

        response.setBudgetAllocated(
                budgetInfo != null
                        ? budgetInfo.getTotalBudget()
                        : BigDecimal.ZERO);

        return response;
    }

    private String getProjectStatusName(Short statusId) {

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
}