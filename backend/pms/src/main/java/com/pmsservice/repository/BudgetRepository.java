package com.pmsservice.repository;

import com.pmsservice.entity.BudgetInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<BudgetInfo,Integer> {
	Optional<BudgetInfo> findByQuotationId(String quotationId);

    boolean existsByQuotationId(String quotationId);

}
