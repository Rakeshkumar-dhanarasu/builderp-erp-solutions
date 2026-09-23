package com.pmsservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.QuotationDetail;

@Repository
public interface QuotationDetailRepository extends JpaRepository<QuotationDetail, String> {

    Optional<QuotationDetail> findTopByQuotationIdStartingWithOrderByQuotationIdDesc(
            String prefix);
}