package com.pmsservice.repository;

import com.pmsservice.entity.ItemMaster;
import com.pmsservice.projection.ItemAvailabilityProjection;
import com.pmsservice.projection.ItemLookupProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemMasterRepository
        extends JpaRepository<ItemMaster, Short> {

    @Query(value = """
        SELECT
            item_id AS itemId,
            item_name AS itemName,
            item_category AS itemCategory
        FROM public.item_master
        ORDER BY item_name
        """, nativeQuery = true)
    List<ItemLookupProjection> findItemsForLookup();

    @Query(value = """
        SELECT
            i.item_id AS itemId,
            i.item_name AS itemName,
            i.item_category AS itemCategory,
            COALESCE(SUM(
                CASE
                    WHEN s.item_quantity > 0 THEN s.item_quantity
                    ELSE 0
                END
            ), 0) AS availableQuantity
        FROM public.item_master i
        LEFT JOIN public.item_stock s
            ON s.item_id = i.item_id
        GROUP BY i.item_id, i.item_name, i.item_category
        ORDER BY i.item_name
        """, nativeQuery = true)
    List<ItemAvailabilityProjection> findItemAvailability();
}