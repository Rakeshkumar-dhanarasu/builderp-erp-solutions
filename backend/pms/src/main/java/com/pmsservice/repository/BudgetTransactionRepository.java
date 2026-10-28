package com.pmsservice.repository;

import com.pmsservice.entity.BudgetTransaction;
import com.pmsservice.projection.BudgetTransactionProjection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BudgetTransactionRepository
        extends JpaRepository<BudgetTransaction, Integer> {

    List<BudgetTransaction> findByBudget_BudgetIdOrderByPerformedAtDesc(
            Integer budgetId
    );
    
    boolean existsByReferenceIdAndTransactionType_TransactionTypeName(
            String referenceId,
            String transactionTypeName
    );
    
    @Query("""
            SELECT
                t.budgetTransactionId AS budgetTransactionId,
                t.category AS category,
                tt.transactionTypeId AS transactionTypeId,
                tt.transactionTypeName AS transactionTypeName,
                t.amountChange AS amountChange,
                t.balanceBefore AS balanceBefore,
                t.balanceAfter AS balanceAfter,
                t.referenceId AS referenceId,
                t.description AS description,
                t.performedBy AS performedBy,
                t.performedAt AS performedAt
            FROM BudgetTransaction t
            JOIN t.transactionType tt
            WHERE t.budget.budgetId = :budgetId
            ORDER BY t.performedAt DESC
            """)
    List<BudgetTransactionProjection> findTrackingTransactionsByBudgetId(
            @Param("budgetId") Integer budgetId
    );
}