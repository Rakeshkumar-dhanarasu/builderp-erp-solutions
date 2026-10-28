package com.pmsservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pmsservice.dto.employee.EmployeeLookupResponse;
import com.pmsservice.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeLookupResponse> getActiveEmployees() {
        return employeeRepository.findActiveEmployees()
                .stream()
                .map(employee -> new EmployeeLookupResponse(
                        employee.getEmployeeId(),
                        employee.getEmployeeName()))
                .toList();
    }
}