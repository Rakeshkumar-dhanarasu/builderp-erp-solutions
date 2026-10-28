package com.pmsservice.controller;

import com.pmsservice.dto.projects.CreateProjectRequest;
import com.pmsservice.dto.projects.ProjectDetailResponse;
import com.pmsservice.dto.projects.ProjectListResponse;
import com.pmsservice.dto.projects.ProjectResponse;
import com.pmsservice.projection.ProjectProgressLookupProjection;
import com.pmsservice.service.ProjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pms/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody CreateProjectRequest request) {

        ProjectResponse response =
                projectService.createProject(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<ProjectListResponse>> getAllProjects() {

        List<ProjectListResponse> response =
                projectService.getAllProjects();

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetails(
            @PathVariable String projectId) {

        ProjectDetailResponse response =
                projectService.getProjectDetails(projectId);

        return ResponseEntity.ok(response);
    }
    

	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/{projectId}/progress")
	public ResponseEntity<?> getProjectProgress(
	        @PathVariable String projectId) {
	
	    try {
	        return ResponseEntity.ok(
	                projectService.getProjectProgress(projectId));
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(java.util.Map.of("message", e.getMessage()));
	    }
	}
	
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/{projectId}/progress/stock-request")
	public ResponseEntity<?> getProgressAvailableForStockRequest(
	        @PathVariable String projectId) {
	
	    try {
	        List<ProjectProgressLookupProjection> response =
	                projectService.getProgressAvailableForStockRequest(projectId);
	
	        return ResponseEntity.ok(response);
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(java.util.Map.of("message", e.getMessage()));
	    }
	}

}