package com.pmsservice.repository;

import com.pmsservice.entity.PoStatusTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PoStatusTableRepository
        extends JpaRepository<PoStatusTable, Integer> {

    List<PoStatusTable> findByPoRequestId_PoRequestIdOrderByPoStatusIdAsc(
            String poRequestId
    );
}