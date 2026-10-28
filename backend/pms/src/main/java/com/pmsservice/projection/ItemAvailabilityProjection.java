package com.pmsservice.projection;

public interface ItemAvailabilityProjection {

    Short getItemId();

    String getItemName();

    String getItemCategory();

    Long getAvailableQuantity();
}