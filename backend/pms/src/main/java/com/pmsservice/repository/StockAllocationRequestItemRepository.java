package com.pmsservice.repository;

import com.pmsservice.entity.StockAllocationRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAllocationRequestItemRepository
        extends JpaRepository<StockAllocationRequestItem, Integer> {

    List<StockAllocationRequestItem> findByStockAllocationRequestId(
            Integer stockAllocationRequestId);
}
