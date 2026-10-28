package com.pmsservice.repository;

import com.pmsservice.entity.ProjectAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectActionRepository
        extends JpaRepository<ProjectAction, Integer> {
}
