package com.pmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.enums.StakeholderType;
import com.pmsservice.projection.VendorLookupProjection;

@Repository
public interface StakeholderRepository extends JpaRepository<StakeholderInfo, Integer> {

    List<StakeholderInfo> findByStakeholderCategory(
            StakeholderType stakeholderType);

	@Query(value = """
	        SELECT
	            s.stakeholder_id AS vendorId,
	            CONCAT(s.first_name, ' ', s.last_name) AS vendorName
	        FROM stakeholder_info s
	        WHERE s.is_active = true
	          AND s.stakeholder_category = 'Supplier'
	        ORDER BY s.first_name, s.last_name
	        """, nativeQuery = true)
	List<VendorLookupProjection> findActiveVendors();
}