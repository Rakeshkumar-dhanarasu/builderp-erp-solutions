
package com.pmsservice.dto.projects;

import java.math.BigDecimal;
import java.util.List;
import com.pmsservice.projection.ProjectProgressLookupProjection;

public class ProjectProgressTrackingResponse {

    private final String projectId;
    private final int totalTasks;
    private final int completedTasks;
    private final int totalSubTasks;
    private final int completedSubTasks;
    private final int inProgressSubTasks;
    private final int initiatedSubTasks;
    private final BigDecimal overallCompletionPercentage;
    private final List<ProjectProgressLookupProjection> subTasks;

    public ProjectProgressTrackingResponse(
            String projectId,
            int totalTasks,
            int completedTasks,
            int totalSubTasks,
            int completedSubTasks,
            int inProgressSubTasks,
            int initiatedSubTasks,
            BigDecimal overallCompletionPercentage,
            List<ProjectProgressLookupProjection> subTasks) {
        this.projectId = projectId;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.totalSubTasks = totalSubTasks;
        this.completedSubTasks = completedSubTasks;
        this.inProgressSubTasks = inProgressSubTasks;
        this.initiatedSubTasks = initiatedSubTasks;
        this.overallCompletionPercentage = overallCompletionPercentage;
        this.subTasks = subTasks;
    }

    public String getProjectId() { return projectId; }
    public int getTotalTasks() { return totalTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public int getTotalSubTasks() { return totalSubTasks; }
    public int getCompletedSubTasks() { return completedSubTasks; }
    public int getInProgressSubTasks() { return inProgressSubTasks; }
    public int getInitiatedSubTasks() { return initiatedSubTasks; }
    public BigDecimal getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }
    public List<ProjectProgressLookupProjection> getSubTasks() {
        return subTasks;
    }
}
