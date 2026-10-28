package com.pmsservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmsservice.dto.employee.EmployeeLookupResponse;
import com.pmsservice.service.EmployeeService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/pms/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<EmployeeLookupResponse>> getActiveEmployees() {

        List<EmployeeLookupResponse> response =
                employeeService.getActiveEmployees();

        return ResponseEntity.ok(response);
    }
}