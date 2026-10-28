package com.pmsservice.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.ProjectProgress;
import com.pmsservice.projection.ProjectProgressLookupProjection;

@Repository
public interface ProjectProgressRepository extends JpaRepository<ProjectProgress, Integer> {

    List<ProjectProgress> findByProjectId(String projectId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT p
        FROM ProjectProgress p
        WHERE p.projectProgressId = :progressId
        """)
    Optional<ProjectProgress> findByIdForUpdate(
            @Param("progressId") Integer progressId);
    
    @Query(value = """
            SELECT
                pp.project_progress_id AS projectProgressId,
                pp.project_id AS projectId,
                pp.task_id AS taskId,
                qtd.task_name AS taskName,
                pp.sub_task_id AS subTaskId,
                qtd.sub_task_name AS subTaskName,
                pp.status AS status
            FROM public.project_progress pp
            JOIN public.quotation_task_details qtd
                ON qtd.utid = pp.quotation_task_detail_id
            WHERE pp.project_id = :projectId
              AND pp.status <> 13
              AND pp.target_quantity > pp.quantity_completed
            ORDER BY qtd.task_name, qtd.sub_task_name
            """, nativeQuery = true)
    List<ProjectProgressLookupProjection> findAvailableForStockRequest(
            @Param("projectId") String projectId);


    @Query(value = """
            SELECT
                pp.project_progress_id AS projectProgressId,
                pp.project_id AS projectId,
                pp.task_id AS taskId,
                qtd.task_name AS taskName,
                pp.sub_task_id AS subTaskId,
                qtd.sub_task_name AS subTaskName,
                pp.status AS status
            FROM public.project_progress pp
            JOIN public.quotation_task_details qtd
                ON qtd.utid = pp.quotation_task_detail_id
            WHERE pp.project_id = :projectId
            ORDER BY pp.task_id, pp.sub_task_id
            """, nativeQuery = true)
    List<ProjectProgressLookupProjection> findProgressForProject(
            @Param("projectId") String projectId);
    
}
