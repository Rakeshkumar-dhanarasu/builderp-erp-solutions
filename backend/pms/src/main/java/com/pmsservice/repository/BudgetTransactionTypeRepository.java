package com.pmsservice.repository;

import com.pmsservice.entity.BudgetTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetTransactionTypeRepository
        extends JpaRepository<BudgetTransactionType, Short> {

    Optional<BudgetTransactionType> findByTransactionTypeName(
            String transactionTypeName);
}