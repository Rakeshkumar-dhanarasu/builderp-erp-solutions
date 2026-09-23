package com.pmsservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.QuotationVersion;
import com.pmsservice.entity.QuotationVersionId;

@Repository
public interface QuotationVersionRepository
        extends JpaRepository<QuotationVersion, QuotationVersionId> {

    Optional<QuotationVersion> findByQuotationIdAndVersionNumber(
            String quotationId,
            Short versionNumber);
}