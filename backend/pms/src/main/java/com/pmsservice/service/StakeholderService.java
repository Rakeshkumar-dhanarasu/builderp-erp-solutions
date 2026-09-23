package com.pmsservice.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

import com.pmsservice.dto.StakeholderListResponse;
import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.dto.CreateStakeholderRequest;
import com.pmsservice.dto.CreateStakeholderResponse;
import com.pmsservice.repository.StakeholderRepository;
import com.pmsservice.validation.StakeholderValidator;
import com.pmsservice.repository.EmployeeRepository;
import com.pmsservice.repository.UserAccountRepository;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.entity.EmployeeInfo;
import com.pmsservice.dto.EmployeeDetailRequest;
import com.pmsservice.dto.StakeholderDetailResponse;
import com.pmsservice.errorhandle.StakeholderNotFoundException;
import com.pmsservice.dto.UpdateStakeholderRequest;

@Service
public class StakeholderService {

    private final StakeholderRepository stakeholderRepository;
    private final StakeholderValidator stakeholderValidator;
    private final StakeholderSanitizer stakeholderSanitizer;
    private final EmployeeRepository employeeRepository;
    private final UserAccountRepository userAccountRepository;

    public StakeholderService(

            StakeholderRepository stakeholderRepository,

            StakeholderValidator stakeholderValidator,

            StakeholderSanitizer stakeholderSanitizer,

            UserAccountRepository userAccountRepository,

            EmployeeRepository employeeInfoRepository) {

        this.stakeholderRepository = stakeholderRepository;

        this.stakeholderValidator = stakeholderValidator;

        this.stakeholderSanitizer = stakeholderSanitizer;

        this.userAccountRepository = userAccountRepository;

        this.employeeRepository = employeeInfoRepository;
    }
    
    private StakeholderInfo mapToEntity(
            CreateStakeholderRequest request,
            Integer loggedInUserId) {

        StakeholderInfo stakeholder = new StakeholderInfo();

        stakeholder.setStakeholderCategory(
                request.getStakeholderCategory()
        );

        stakeholder.setFirstName(
                request.getFirstName()
        );

        stakeholder.setLastName(
                request.getLastName()
        );

        stakeholder.setPrimaryPhoneCode(
                request.getPrimaryPhoneCode()
        );

        stakeholder.setPrimaryPhoneNum(
                request.getPrimaryPhoneNum()
        );

        stakeholder.setSecondaryPhoneCode(
                request.getSecondaryPhoneCode()
        );

        stakeholder.setSecondaryPhoneNum(
                request.getSecondaryPhoneNum()
        );

        stakeholder.setEmail(
                request.getEmail()
        );

        stakeholder.setPrimaryAddress(
                request.getPrimaryAddress()
        );

        stakeholder.setSecondaryAddress(
                request.getSecondaryAddress()
        );

        stakeholder.setCity(
                request.getCity()
        );

        stakeholder.setStateOrProvince(
                request.getStateOrProvince()
        );

        stakeholder.setCountry(
                request.getCountry()
        );

        stakeholder.setRelatedDocs(
                request.getRelatedDocs()
        );

        stakeholder.setExtraComments(
                request.getExtraComments()
        );

        stakeholder.setPostalCode(
                request.getPostalCode()
        );

        // Audit information
        stakeholder.setCreatedBy(loggedInUserId);
        stakeholder.setCreatedDate(Instant.now());

        // New stakeholder is active by default
        stakeholder.setActive(true);

        return stakeholder;
    }
    
    private String getUserName(Integer userId) {

        if (userId == null) {
            return null;
        }

        return userAccountRepository.findById(userId)
                .map(userAccount -> userAccount.getUserName())
                .orElse(null);
    }
    
    @Transactional
    public CreateStakeholderResponse createStakeholder(
            CreateStakeholderRequest request) {

        // 1. Sanitize input
        stakeholderSanitizer.sanitize(request);

        // 2. Validate business rules
        stakeholderValidator.validate(request);

        // 3. Get logged-in user's ID from JWT
        Integer loggedInUserId = getLoggedInUserId();

        // 4. Map request to stakeholder entity
        StakeholderInfo stakeholder =
                mapToEntity(request, loggedInUserId);

        // 5. Save stakeholder first
        StakeholderInfo savedStakeholder =
                stakeholderRepository.save(stakeholder);
        
        if (request.getStakeholderCategory() != StakeholderType.EMPLOYEE
                && request.getEmployeeDetails() != null) {

            throw new IllegalArgumentException(
                    "Employee details are allowed only for Employee stakeholders"
            );
        }

        // 6. Create employee-specific information if applicable
        if (request.getStakeholderCategory() == StakeholderType.EMPLOYEE) {

            EmployeeDetailRequest employeeDetails =
                    request.getEmployeeDetails();

            if (employeeDetails == null) {
                throw new IllegalArgumentException(
                        "Employee details are required for an Employee stakeholder"
                );
            }

            if (employeeDetails.getEmployeeRole() == null) {
                throw new IllegalArgumentException(
                        "Employee role is required"
                );
            }

            if (employeeDetails.getEmployeeDept() == null) {
                throw new IllegalArgumentException(
                        "Employee department is required"
                );
            }

            if (employeeDetails.getPayrollStructure() == null) {
                throw new IllegalArgumentException(
                        "Payroll structure is required"
                );
            }

            if (employeeDetails.getSalary() == null) {
                throw new IllegalArgumentException(
                        "Salary is required"
                );
            }

            EmployeeInfo employeeInfo = new EmployeeInfo();

            // Same ID as stakeholder_info.stakeholder_id
            employeeInfo.setEmployeeId(
                    savedStakeholder.getStakeholderId()
            );

            employeeInfo.setEmployeeRole(
                    employeeDetails.getEmployeeRole()
            );

            employeeInfo.setEmployeeDept(
                    employeeDetails.getEmployeeDept()
            );

            employeeInfo.setPayrollStructure(
                    employeeDetails.getPayrollStructure()
            );

            employeeInfo.setSalary(
                    employeeDetails.getSalary()
            );

            employeeRepository.save(employeeInfo);
        }

        // 7. Build response
        CreateStakeholderResponse response =
                new CreateStakeholderResponse();

        response.setStakeholderId(
                savedStakeholder.getStakeholderId()
        );

        response.setStakeholderCategory(
                savedStakeholder.getStakeholderCategory()
        );

        response.setFirstName(
                savedStakeholder.getFirstName()
        );

        response.setLastName(
                savedStakeholder.getLastName()
        );

        response.setEmail(
                savedStakeholder.getEmail()
        );

        response.setPrimaryPhoneCode(
                savedStakeholder.getPrimaryPhoneCode()
        );

        response.setPrimaryPhoneNum(
                savedStakeholder.getPrimaryPhoneNum()
        );

        response.setCreatedBy(
                getUserName(savedStakeholder.getCreatedBy())
        );

        response.setModifiedBy(
                getUserName(savedStakeholder.getModifiedBy())
        );

        response.setCreatedDate(
                savedStakeholder.getCreatedDate()
        );

        response.setModifiedDate(
                savedStakeholder.getModifiedDate()
        );

        response.setActive(
                savedStakeholder.getActive()
        );

        return response;
    }
    
    @Transactional
    public StakeholderDetailResponse updateStakeholder(
            Integer stakeholderId,
            UpdateStakeholderRequest request) {

        // 1. Sanitize input
        stakeholderSanitizer.sanitize(request);

        // 2. Validate business rules
        stakeholderValidator.validate(request);

        // 3. Find existing stakeholder
        StakeholderInfo stakeholder =
                stakeholderRepository.findById(stakeholderId)
                        .orElseThrow(() ->
                                new StakeholderNotFoundException(
                                        "Stakeholder with ID "
                                                + stakeholderId
                                                + " was not found"
                                )
                        );

        // 4. Get logged-in user
        Integer loggedInUserId = getLoggedInUserId();

        // 5. Update stakeholder information
        stakeholder.setStakeholderCategory(
                request.getStakeholderCategory()
        );

        stakeholder.setFirstName(
                request.getFirstName()
        );

        stakeholder.setLastName(
                request.getLastName()
        );

        stakeholder.setPrimaryPhoneCode(
                request.getPrimaryPhoneCode()
        );

        stakeholder.setPrimaryPhoneNum(
                request.getPrimaryPhoneNum()
        );

        stakeholder.setSecondaryPhoneCode(
                request.getSecondaryPhoneCode()
        );

        stakeholder.setSecondaryPhoneNum(
                request.getSecondaryPhoneNum()
        );

        stakeholder.setEmail(
                request.getEmail()
        );

        stakeholder.setPrimaryAddress(
                request.getPrimaryAddress()
        );

        stakeholder.setSecondaryAddress(
                request.getSecondaryAddress()
        );

        stakeholder.setCity(
                request.getCity()
        );

        stakeholder.setStateOrProvince(
                request.getStateOrProvince()
        );

        stakeholder.setCountry(
                request.getCountry()
        );

        stakeholder.setRelatedDocs(
                request.getRelatedDocs()
        );

        stakeholder.setExtraComments(
                request.getExtraComments()
        );

        stakeholder.setPostalCode(
                request.getPostalCode()
        );

        // 6. Update audit information
        stakeholder.setModifiedBy(loggedInUserId);
        stakeholder.setModifiedDate(Instant.now());

        // 7. Save stakeholder
        StakeholderInfo savedStakeholder =
                stakeholderRepository.save(stakeholder);

        /*
         * 8. Handle employee-specific information
         */
        if (request.getStakeholderCategory() == StakeholderType.EMPLOYEE) {

            EmployeeDetailRequest employeeDetails =
                    request.getEmployeeDetails();

            EmployeeInfo employeeInfo =
                    employeeRepository.findById(stakeholderId)
                            .orElseGet(EmployeeInfo::new);

            employeeInfo.setEmployeeId(
                    stakeholderId
            );

            employeeInfo.setEmployeeRole(
                    employeeDetails.getEmployeeRole()
            );

            employeeInfo.setEmployeeDept(
                    employeeDetails.getEmployeeDept()
            );

            employeeInfo.setPayrollStructure(
                    employeeDetails.getPayrollStructure()
            );

            employeeInfo.setSalary(
                    employeeDetails.getSalary()
            );

            employeeRepository.save(employeeInfo);

        } else {

            /*
             * If an existing Employee is changed to another
             * stakeholder category, remove employee-specific data.
             */
            employeeRepository.findById(stakeholderId)
                    .ifPresent(employeeRepository::delete);
        }

        // 9. Return complete updated stakeholder
        return getStakeholderById(
                savedStakeholder.getStakeholderId()
        );
    }

    private Integer getLoggedInUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException(
                    "Authenticated JWT user information is not available"
            );
        }

        Number userIdNumber = jwtAuthentication.getToken().getClaim("user_id");
        Integer userId = userIdNumber.intValue();

        return userId;
    }
    
    public List<StakeholderListResponse> getStakeholdersByType(
            StakeholderType stakeholderType) {

        return stakeholderRepository
                .findByStakeholderCategory(stakeholderType)
                .stream()
                .map(stakeholder -> new StakeholderListResponse(
                        stakeholder.getStakeholderId(),
                        stakeholder.getStakeholderCategory(),
                        stakeholder.getFirstName(),
                        stakeholder.getLastName(),
                        stakeholder.getPrimaryPhoneCode(),
                        stakeholder.getPrimaryPhoneNum(),
                        stakeholder.getEmail(),
                        stakeholder.getCity(),
                        stakeholder.getStateOrProvince(),
                        stakeholder.getCountry(),
                        stakeholder.getPostalCode(),
                        stakeholder.getActive()
                ))
                .toList();
    }
    
    @Transactional
    public StakeholderDetailResponse updateStakeholderStatus(
            Integer stakeholderId,
            Boolean active) {

        StakeholderInfo stakeholder =
                stakeholderRepository.findById(stakeholderId)
                        .orElseThrow(() ->
                                new StakeholderNotFoundException(
                                        "Stakeholder with ID "
                                                + stakeholderId
                                                + " was not found"
                                )
                        );

        Integer loggedInUserId = getLoggedInUserId();

        stakeholder.setActive(active);
        stakeholder.setModifiedBy(loggedInUserId);
        stakeholder.setModifiedDate(Instant.now());

        StakeholderInfo savedStakeholder =
                stakeholderRepository.save(stakeholder);

        return getStakeholderById(savedStakeholder.getStakeholderId());
    }
    
    public StakeholderDetailResponse getStakeholderById(Integer stakeholderId) {

        StakeholderInfo stakeholder = stakeholderRepository
                .findById(stakeholderId)
                .orElseThrow(() ->
                        new StakeholderNotFoundException(
                                "Stakeholder with ID "
                                        + stakeholderId
                                        + " was not found"
                        )
                );

        StakeholderDetailResponse response = new StakeholderDetailResponse();

        response.setStakeholderId(stakeholder.getStakeholderId());
        response.setStakeholderCategory(stakeholder.getStakeholderCategory());
        response.setFirstName(stakeholder.getFirstName());
        response.setLastName(stakeholder.getLastName());

        response.setPrimaryPhoneCode(stakeholder.getPrimaryPhoneCode());
        response.setPrimaryPhoneNum(stakeholder.getPrimaryPhoneNum());

        response.setSecondaryPhoneCode(
                stakeholder.getSecondaryPhoneCode()
        );
        response.setSecondaryPhoneNum(
                stakeholder.getSecondaryPhoneNum()
        );

        response.setEmail(stakeholder.getEmail());

        response.setPrimaryAddress(
                stakeholder.getPrimaryAddress()
        );
        response.setSecondaryAddress(
                stakeholder.getSecondaryAddress()
        );

        response.setCity(stakeholder.getCity());
        response.setStateOrProvince(
                stakeholder.getStateOrProvince()
        );
        response.setCountry(stakeholder.getCountry());
        response.setPostalCode(stakeholder.getPostalCode());
        response.setExtraComments(
                stakeholder.getExtraComments()
        );

        response.setCreatedBy(
                getUserName(stakeholder.getCreatedBy())
        );
        response.setCreatedDate(
                stakeholder.getCreatedDate()
        );

        response.setModifiedBy(
                getUserName(stakeholder.getModifiedBy())
        );
        response.setModifiedDate(
                stakeholder.getModifiedDate()
        );

        response.setActive(stakeholder.getActive());

        /*
         * Employee-specific information
         */
        if (stakeholder.getStakeholderCategory() == StakeholderType.EMPLOYEE) {

            employeeRepository.findById(stakeholderId)
                    .ifPresent(employeeInfo -> {

                        response.setEmployeeRole(
                                employeeInfo.getEmployeeRole()
                        );

                        response.setEmployeeDept(
                                employeeInfo.getEmployeeDept()
                        );

                        response.setPayrollStructure(
                                employeeInfo.getPayrollStructure()
                        );

                        response.setSalary(
                                employeeInfo.getSalary()
                        );
                    });
        }

        return response;
    }
    
    @Transactional
    public void deleteStakeholder(Integer stakeholderId) {

        // 1. Find stakeholder
        StakeholderInfo stakeholder =
                stakeholderRepository.findById(stakeholderId)
                        .orElseThrow(() ->
                                new StakeholderNotFoundException(
                                        "Stakeholder with ID "
                                                + stakeholderId
                                                + " was not found"
                                )
                        );

        /*
         * 2. Employee information uses the same ID as the stakeholder.
         *
         *    Delete employee_info first because it has a foreign-key
         *    relationship to stakeholder_info.
         */
        if (stakeholder.getStakeholderCategory() == StakeholderType.EMPLOYEE) {

            employeeRepository.findById(stakeholderId)
                    .ifPresent(employeeRepository::delete);
        }

        // 3. Delete stakeholder
        stakeholderRepository.delete(stakeholder);
    }
}