package com.pmsservice.repository;

import com.pmsservice.entity.ItemStock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface ItemStockRepository extends JpaRepository<ItemStock, Integer> {

    Optional<ItemStock> findByPurchaseOrder_PoRequestIdAndItem_ItemId(
        String poRequestId,
        Short itemId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM ItemStock s
        WHERE s.itemStockId = :itemStockId
        """)
    Optional<ItemStock> findByIdForUpdate(
        @Param("itemStockId") Integer itemStockId
    );
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM ItemStock s
        WHERE s.item.itemId = :itemId
          AND s.itemQuantity > 0
        ORDER BY s.stockedAt ASC, s.itemStockId ASC
        """)
    List<ItemStock> findAvailableBatchesForUpdate(
            @Param("itemId") Short itemId);
    

	@Query("""
	    SELECT COALESCE(SUM(s.itemQuantity), 0)
	    FROM ItemStock s
	    WHERE s.item.itemId = :itemId
	      AND s.itemQuantity > 0
	    """)
	Long getAvailableQuantityByItemId(
	        @Param("itemId") Short itemId);
	
	boolean existsByItem_ItemId(Short itemId);
}
