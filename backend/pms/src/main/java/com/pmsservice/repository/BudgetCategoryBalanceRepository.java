package com.pmsservice.repository;

import com.pmsservice.entity.BudgetCategoryBalance;
import com.pmsservice.entity.BudgetCategoryBalanceId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetCategoryBalanceRepository
        extends JpaRepository<BudgetCategoryBalance, BudgetCategoryBalanceId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BudgetCategoryBalance b WHERE b.id = :id")
    Optional<BudgetCategoryBalance> findByIdForUpdate(
            @Param("id") BudgetCategoryBalanceId id
    );
    List<BudgetCategoryBalance> findByIdBudgetId(Integer budgetId);
}