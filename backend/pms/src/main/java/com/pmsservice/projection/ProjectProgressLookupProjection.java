package com.pmsservice.projection;

public interface ProjectProgressLookupProjection {

    Integer getProjectProgressId();

    String getProjectId();

    Short getTaskId();

    String getTaskName();

    Short getSubTaskId();

    String getSubTaskName();
    
    Short getStatus();
}
