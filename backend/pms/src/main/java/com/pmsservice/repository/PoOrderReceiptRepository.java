
package com.pmsservice.repository;

import com.pmsservice.entity.PoOrderReceipt;
import com.pmsservice.entity.PoOrderReceiptId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PoOrderReceiptRepository
        extends JpaRepository<PoOrderReceipt, PoOrderReceiptId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT r
        FROM PoOrderReceipt r
        WHERE r.id = :id
        """)
    Optional<PoOrderReceipt> findByIdForUpdate(
        @Param("id") PoOrderReceiptId id
    );

    List<PoOrderReceipt> findById_PoRequestId(String poRequestId);
}
