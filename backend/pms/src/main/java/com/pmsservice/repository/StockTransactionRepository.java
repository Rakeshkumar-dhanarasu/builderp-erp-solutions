package com.pmsservice.repository;

import com.pmsservice.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByPurchaseOrder_PoRequestIdOrderByTransactionDateDesc(
        String poRequestId
    );

    List<StockTransaction> findByProject_ProjectIdOrderByTransactionDateDesc(
        String projectId
    );
}
