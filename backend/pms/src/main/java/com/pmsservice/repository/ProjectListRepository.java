package com.pmsservice.repository;

import com.pmsservice.entity.ProjectList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectListRepository extends JpaRepository<ProjectList, String> {

    Optional<ProjectList> findTopByProjectIdStartingWithOrderByProjectIdDesc(
            String prefix);
}