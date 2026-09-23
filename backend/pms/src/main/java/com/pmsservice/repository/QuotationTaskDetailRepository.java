package com.pmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.QuotationTaskDetail;

@Repository
public interface QuotationTaskDetailRepository extends JpaRepository<QuotationTaskDetail, Integer> {

    List<QuotationTaskDetail> findByQuotationIdAndVersionNumber(
        String quotationId,
        Short versionNumber
    );
}