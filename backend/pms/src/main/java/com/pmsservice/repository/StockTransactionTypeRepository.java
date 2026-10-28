package com.pmsservice.repository;

import com.pmsservice.entity.StockTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockTransactionTypeRepository
        extends JpaRepository<StockTransactionType, Short> {

    Optional<StockTransactionType> findByStockTransactionTypeName(
        String stockTransactionTypeName
    );
}
