
package com.pmsservice.repository;

import com.pmsservice.entity.PoQuotation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PoQuotationRepository extends JpaRepository<PoQuotation, String> {

    List<PoQuotation> findByPurchaseOrder_PoRequestId(String poRequestId);

    List<PoQuotation> findByPurchaseOrder_PoRequestIdAndStatus(
        String poRequestId,
        Short status
    );

    void deleteByPurchaseOrder_PoRequestId(String poRequestId);
}
