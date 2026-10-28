package com.pmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pmsservice.entity.LabourSlipDetail;

public interface LabourSlipDetailRepository
        extends JpaRepository<LabourSlipDetail, Integer> {

    List<LabourSlipDetail>
        findByLabourSlip_LabourSlipIdOrderByLabourSlipDetailIdAsc(
            Integer labourSlipId
        );

    boolean existsByLabourSlip_LabourSlipIdAndEmployeeId(
            Integer labourSlipId,
            Integer employeeId
        );
}
