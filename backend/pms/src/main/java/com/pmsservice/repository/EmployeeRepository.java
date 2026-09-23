package com.pmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pmsservice.entity.EmployeeInfo;

public interface EmployeeRepository extends JpaRepository<EmployeeInfo, Integer> {
}