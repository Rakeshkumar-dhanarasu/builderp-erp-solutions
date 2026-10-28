package com.pmsservice.repository;

import com.pmsservice.entity.StockAllocationRequest;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockAllocationRequestRepository
        extends JpaRepository<StockAllocationRequest, Integer> {

    List<StockAllocationRequest> findByProjectIdOrderByRequestedAtDesc(
            String projectId);

    List<StockAllocationRequest> findByRequestStatusOrderByRequestedAtAsc(
            Short requestStatus);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("""
	    SELECT r
	    FROM StockAllocationRequest r
	    WHERE r.stockAllocationRequestId = :requestId
	    """)
	Optional<StockAllocationRequest> findByIdForUpdate(
	        @Param("requestId") Integer requestId);
	
	@Query(
		    value = "SELECT nextval('stock_allocation_job_number_seq')",
		    nativeQuery = true
		)
	Long getNextJobNumberSequenceValue();

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("""
	    SELECT r
	    FROM StockAllocationRequest r
	    WHERE r.jobNumber = :jobNumber
	    """)
	Optional<StockAllocationRequest> findByJobNumberForUpdate(
	        @Param("jobNumber") String jobNumber);

	Optional<StockAllocationRequest> findByJobNumber(String jobNumber);
	
}
