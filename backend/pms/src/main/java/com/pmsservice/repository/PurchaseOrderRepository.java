
package com.pmsservice.repository;

import com.pmsservice.entity.PurchaseOrder;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {

    List<PurchaseOrder> findAllByOrderByPoRequestIdDesc();

    List<PurchaseOrder> findByProject_ProjectIdOrderByPoRequestIdDesc(String projectId);

    PurchaseOrder findTopByProject_ProjectIdOrderByPoRequestIdDesc(String projectId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT p
        FROM PurchaseOrder p
        WHERE p.poRequestId = :poRequestId
        """)
    Optional<PurchaseOrder> findByIdForUpdate(
        @Param("poRequestId") String poRequestId
    );
}
