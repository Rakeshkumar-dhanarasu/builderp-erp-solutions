package com.pmsservice.projection;

import java.math.BigDecimal;

public interface EmployeeLookupProjection {
    Integer getEmployeeId();
    String getEmployeeName();
    BigDecimal getHourlyRate();
}
