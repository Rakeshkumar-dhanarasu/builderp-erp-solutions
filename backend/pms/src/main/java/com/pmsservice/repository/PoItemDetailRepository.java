
package com.pmsservice.repository;

import com.pmsservice.entity.PoItemDetail;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PoItemDetailRepository extends JpaRepository<PoItemDetail, Integer> {

    List<PoItemDetail> findByPurchaseOrder_PoRequestId(String poRequestId);

    void deleteByPurchaseOrder_PoRequestId(String poRequestId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT i
        FROM PoItemDetail i
        WHERE i.purchaseOrder.poRequestId = :poRequestId
          AND i.itemRequestId = :itemRequestId
        """)
    Optional<PoItemDetail> findByPoRequestIdAndItemRequestIdForUpdate(
        @Param("poRequestId") String poRequestId,
        @Param("itemRequestId") Integer itemRequestId
    );
}
