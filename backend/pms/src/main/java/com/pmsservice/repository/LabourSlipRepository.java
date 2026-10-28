package com.pmsservice.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import com.pmsservice.entity.LabourSlip;

public interface LabourSlipRepository
        extends JpaRepository<LabourSlip, Integer> {

    Optional<LabourSlip> findByJobNumberAndWorkDate(
            String jobNumber,
            LocalDate workDate
    );

    boolean existsByJobNumberAndWorkDate(
            String jobNumber,
            LocalDate workDate
    );

    List<LabourSlip> findByJobNumberOrderByWorkDateDesc(
            String jobNumber
    );

    List<LabourSlip> findAllByOrderByWorkDateDesc();
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM LabourSlip s
        WHERE s.labourSlipId = :id
        """)
    Optional<LabourSlip> findByIdForUpdate(@Param("id") Integer id);
}
