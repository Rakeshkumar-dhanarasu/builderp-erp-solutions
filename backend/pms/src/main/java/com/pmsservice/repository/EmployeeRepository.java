package com.pmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pmsservice.entity.EmployeeInfo;
import com.pmsservice.projection.EmployeeLookupProjection;

public interface EmployeeRepository extends JpaRepository<EmployeeInfo, Integer> {

    @Query(value = """
            SELECT
                s.stakeholder_id AS employeeId,
                CONCAT(s.first_name, ' ', s.last_name) AS employeeName
            FROM employee_info e
            INNER JOIN stakeholder_info s
                ON s.stakeholder_id = e.employee_id
            WHERE s.is_active = true
            ORDER BY s.first_name, s.last_name
            """, nativeQuery = true)
    List<EmployeeLookupProjection> findActiveEmployees();
    
    @Query(value = """
            SELECT
                s.stakeholder_id AS employeeId,
                CONCAT(s.first_name, ' ', s.last_name) AS employeeName,
                e.salary AS hourlyRate
            FROM employee_info e
            INNER JOIN stakeholder_info s
                ON s.stakeholder_id = e.employee_id
            WHERE s.is_active = true
              AND e.payroll_structure = 'Hourly Wages'
            ORDER BY s.first_name, s.last_name
            """, nativeQuery = true)
    List<EmployeeLookupProjection> findActiveHourlyPaidEmployees();
}