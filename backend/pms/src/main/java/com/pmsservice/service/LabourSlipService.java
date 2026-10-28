package com.pmsservice.service;

import com.pmsservice.dto.labours.LabourSlipRequest;
import com.pmsservice.dto.labours.LabourSlipResponse;
import com.pmsservice.dto.labours.UpdateLabourSlipRequest;
import com.pmsservice.entity.*;
import com.pmsservice.projection.EmployeeLookupProjection;
import com.pmsservice.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class LabourSlipService {

    private static final String LABOUR_CATEGORY = "labour_forces";
    private static final String DEDUCTION_TYPE = "LABOUR_SLIP_DEDUCTION";
    private static final String ADJUSTMENT_TYPE = "LABOUR_SLIP_ADJUSTMENT";

    private static final Short ALLOCATED_STATUS = 8;

    private final LabourSlipRepository labourSlipRepository;
    private final StockAllocationRequestRepository stockRequestRepository;
    private final ProjectListRepository projectRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetCategoryBalanceRepository balanceRepository;
    private final BudgetTransactionRepository transactionRepository;
    private final BudgetTransactionTypeRepository transactionTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectProgressRepository projectProgressRepository;
    private final ProjectService projectService;

    public LabourSlipService(
            LabourSlipRepository labourSlipRepository,
            StockAllocationRequestRepository stockRequestRepository,
            ProjectListRepository projectRepository,
            BudgetRepository budgetRepository,
            BudgetCategoryBalanceRepository balanceRepository,
            BudgetTransactionRepository transactionRepository,
            BudgetTransactionTypeRepository transactionTypeRepository,
            EmployeeRepository employeeRepository,
            ProjectProgressRepository projectProgressRepository,
            ProjectService projectService) {
        this.labourSlipRepository = labourSlipRepository;
        this.stockRequestRepository = stockRequestRepository;
        this.projectRepository = projectRepository;
        this.budgetRepository = budgetRepository;
        this.balanceRepository = balanceRepository;
        this.transactionRepository = transactionRepository;
        this.transactionTypeRepository = transactionTypeRepository;
        this.employeeRepository = employeeRepository;
        this.projectProgressRepository = projectProgressRepository;
        this.projectService = projectService;
    }

    @Transactional
    public LabourSlipResponse createLabourSlip(LabourSlipRequest request) {
        String jobNumber = request.getJobNumber().trim();

        if (labourSlipRepository.existsByJobNumberAndWorkDate(
                jobNumber, request.getWorkDate())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A labour slip already exists for this job and work date.");
        }

        StockAllocationRequest stockRequest = getAllocatedJob(jobNumber);
        BudgetInfo budget = getBudgetForProject(stockRequest.getProjectId());

        BudgetCategoryBalance balance = lockLabourBalance(budget.getBudgetId());

        Map<Integer, EmployeeLookupProjection> employees =
                getEligibleEmployees(request.getEmployees());

        List<LabourSlipDetail> details =
                calculateDetails(request.getEmployees(), employees);

        BigDecimal total = calculateTotal(details);
        BigDecimal before = balance.getRemainingAmount();
        BigDecimal after = before.subtract(total);

        if (after.signum() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Insufficient labour budget. Available: " + before
                            + ", required: " + total);
        }

        Integer userId = getLoggedInUserId();
        LocalDateTime now = LocalDateTime.now();

        LabourSlip slip = new LabourSlip();
        slip.setJobNumber(jobNumber);
        slip.setWorkDate(request.getWorkDate());
        slip.setTotalWages(total);
        slip.setCreatedBy(userId);
        slip.setCreatedAt(now);

        for (LabourSlipDetail detail : details) {
            slip.addDetail(detail);
        }

        LabourSlip savedSlip = labourSlipRepository.save(slip);

        balance.setRemainingAmount(after);
        balance.setModifiedAt(LocalDate.now());

        saveBudgetTransaction(
                budget,
                DEDUCTION_TYPE,
                total.negate(),
                before,
                after,
                jobNumber,
                "Labour wages recorded for " + jobNumber,
                userId,
                now);
        
        if (request.isMarkSubTaskCompleted()) {
            markSubTaskCompleted(stockRequest, userId, now);
        }

        return toResponse(savedSlip);
    }

    @Transactional
    public LabourSlipResponse updateLabourSlip(
            Integer labourSlipId,
            UpdateLabourSlipRequest request) {

        LabourSlip slip = labourSlipRepository.findByIdForUpdate(labourSlipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Labour slip not found."));

        StockAllocationRequest stockRequest = getAllocatedJob(slip.getJobNumber());
        BudgetInfo budget = getBudgetForProject(stockRequest.getProjectId());

        BudgetCategoryBalance balance = lockLabourBalance(budget.getBudgetId());

        Map<Integer, EmployeeLookupProjection> employees =
                getEligibleEmployees(request.getEmployees());

        List<LabourSlipDetail> newDetails =
                calculateDetails(request.getEmployees(), employees);

        BigDecimal oldTotal = slip.getTotalWages();
        BigDecimal newTotal = calculateTotal(newDetails);

        // Positive change means a refund; negative means an additional deduction.
        BigDecimal balanceChange = oldTotal.subtract(newTotal);
        BigDecimal before = balance.getRemainingAmount();
        BigDecimal after = before.add(balanceChange);

        if (after.signum() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Insufficient labour budget for the updated wages. Available: "
                            + before + ", additional amount required: "
                            + balanceChange.negate());
        }

        Integer userId = getLoggedInUserId();
        LocalDateTime now = LocalDateTime.now();

        // Keep the slip ID, job number, work date and creation audit unchanged.
        slip.getDetails().clear();

        for (LabourSlipDetail detail : newDetails) {
            slip.addDetail(detail);
        }

        slip.setTotalWages(newTotal);
        slip.setUpdatedBy(userId);
        slip.setUpdatedAt(now);

        LabourSlip savedSlip = labourSlipRepository.save(slip);

        if (balanceChange.compareTo(BigDecimal.ZERO) != 0) {
            balance.setRemainingAmount(after);
            balance.setModifiedAt(LocalDate.now());

            saveBudgetTransaction(
                    budget,
                    ADJUSTMENT_TYPE,
                    balanceChange,
                    before,
                    after,
                    slip.getJobNumber(),
                    "Labour slip updated: " + slip.getJobNumber(),
                    userId,
                    now);
        }
        
        if (request.isMarkSubTaskCompleted()) {
            markSubTaskCompleted(stockRequest, userId, now);
        } 

        return toResponse(savedSlip);
    }

    @Transactional(readOnly = true)
    public LabourSlipResponse getLabourSlip(Integer labourSlipId) {
        LabourSlip slip = labourSlipRepository.findById(labourSlipId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Labour slip not found."));

        return toResponse(slip);
    }

    @Transactional(readOnly = true)
    public List<LabourSlipResponse> getSlipsForJob(String jobNumber) {
        return labourSlipRepository
                .findByJobNumberOrderByWorkDateDesc(jobNumber)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LabourSlipResponse> getAllLabourSlips() {
        return labourSlipRepository.findAllByOrderByWorkDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    private void markSubTaskCompleted(
            StockAllocationRequest stockRequest,
            Integer userId,
            LocalDateTime now) {

        ProjectProgress progress = projectProgressRepository
                .findByIdForUpdate(stockRequest.getProjectProgressId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project progress record not found for job "
                                + stockRequest.getJobNumber()));

        // Ensure the job and progress record belong to the same project.
        if (!progress.getProjectId().equals(stockRequest.getProjectId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "The job and sub-task do not belong to the same project.");
        }

        // Status 13 = Completed.
        if (!Short.valueOf((short) 13).equals(progress.getStatus())) {
            progress.setStatus((short) 13);
            progress.setUpdatedAt(now);
            progress.setUpdatedBy(userId);
        }

        projectService.synchronizeProjectStatus(progress.getProjectId());
    }

    private StockAllocationRequest getAllocatedJob(String jobNumber) {
        StockAllocationRequest request = stockRequestRepository
                .findByJobNumber(jobNumber)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No stock allocation request found for job " + jobNumber));

        if (!ALLOCATED_STATUS.equals(request.getRequestStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Labour pay can only be recorded after the job's stock request is allocated.");
        }

        return request;
    }

    private BudgetInfo getBudgetForProject(String projectId) {
        ProjectList project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found: " + projectId));

        return budgetRepository.findByQuotationId(project.getQuotationId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No budget found for quotation " + project.getQuotationId()));
    }

    private BudgetCategoryBalance lockLabourBalance(Integer budgetId) {
        BudgetCategoryBalanceId id =
                new BudgetCategoryBalanceId(budgetId, LABOUR_CATEGORY);

        return balanceRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Labour budget balance not found for budget " + budgetId));
    }

    private Map<Integer, EmployeeLookupProjection> getEligibleEmployees(
            List<LabourSlipRequest.LabourSlipEmployeeRequest> requestedEmployees) {

        Set<Integer> requestedIds = new HashSet<>();

        for (LabourSlipRequest.LabourSlipEmployeeRequest employee : requestedEmployees) {
            if (!requestedIds.add(employee.getEmployeeId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Duplicate employee ID: " + employee.getEmployeeId());
            }
        }

        Map<Integer, EmployeeLookupProjection> eligible =
                employeeRepository.findActiveHourlyPaidEmployees()
                        .stream()
                        .collect(Collectors.toMap(
                                EmployeeLookupProjection::getEmployeeId,
                                Function.identity()));

        for (Integer employeeId : requestedIds) {
            if (!eligible.containsKey(employeeId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Employee " + employeeId
                                + " is inactive or is not paid by hourly wages.");
            }
        }

        return eligible;
    }

    private List<LabourSlipDetail> calculateDetails(
            List<LabourSlipRequest.LabourSlipEmployeeRequest> requestedEmployees,
            Map<Integer, EmployeeLookupProjection> employees) {

        List<LabourSlipDetail> details = new ArrayList<>();

        for (LabourSlipRequest.LabourSlipEmployeeRequest requested : requestedEmployees) {
            EmployeeLookupProjection employee = employees.get(requested.getEmployeeId());
            BigDecimal rate = employee.getHourlyRate();

            if (rate == null || rate.signum() < 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A valid hourly rate is not configured for employee "
                                + requested.getEmployeeId());
            }

            BigDecimal hours = requested.getHoursWorked();
            BigDecimal totalPay = rate.multiply(hours)
                    .setScale(3, RoundingMode.HALF_UP);

            LabourSlipDetail detail = new LabourSlipDetail();
            detail.setEmployeeId(requested.getEmployeeId());
            detail.setHoursWorked(hours);
            detail.setHourlyRate(rate);
            detail.setTotalPay(totalPay);

            details.add(detail);
        }

        return details;
    }

    private BigDecimal calculateTotal(List<LabourSlipDetail> details) {
        return details.stream()
                .map(LabourSlipDetail::getTotalPay)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(3, RoundingMode.HALF_UP);
    }

    private void saveBudgetTransaction(
            BudgetInfo budget,
            String transactionTypeName,
            BigDecimal amountChange,
            BigDecimal before,
            BigDecimal after,
            String referenceId,
            String description,
            Integer userId,
            LocalDateTime performedAt) {

        BudgetTransactionType transactionType =
                transactionTypeRepository.findByTransactionTypeName(transactionTypeName)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Missing budget transaction type: "
                                        + transactionTypeName));

        BudgetTransaction transaction = new BudgetTransaction();
        transaction.setBudget(budget);
        transaction.setCategory(LABOUR_CATEGORY);
        transaction.setTransactionType(transactionType);
        transaction.setAmountChange(amountChange);
        transaction.setBalanceBefore(before);
        transaction.setBalanceAfter(after);
        transaction.setReferenceId(referenceId);
        transaction.setDescription(description);
        transaction.setPerformedBy(userId);
        transaction.setPerformedAt(performedAt);

        transactionRepository.save(transaction);
    }

    private LabourSlipResponse toResponse(LabourSlip slip) {
        LabourSlipResponse response = new LabourSlipResponse();
        response.setLabourSlipId(slip.getLabourSlipId());
        response.setJobNumber(slip.getJobNumber());
        response.setWorkDate(slip.getWorkDate());
        response.setTotalWages(slip.getTotalWages());

        List<LabourSlipResponse.EmployeePayResponse> employeeResponses =
                slip.getDetails().stream()
                        .map(detail -> {
                            LabourSlipResponse.EmployeePayResponse item =
                                    new LabourSlipResponse.EmployeePayResponse();
                            item.setEmployeeId(detail.getEmployeeId());
                            item.setHoursWorked(detail.getHoursWorked());
                            item.setHourlyRate(detail.getHourlyRate());
                            item.setTotalPay(detail.getTotalPay());
                            return item;
                        })
                        .toList();

        response.setEmployees(employeeResponses);
        return response;
    }

    private Integer getLoggedInUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwt)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Authenticated user not found.");
        }

        Object userId = jwt.getToken().getClaim("user_id");

        if (!(userId instanceof Number number)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid user_id claim.");
        }

        return number.intValue();
    }
}