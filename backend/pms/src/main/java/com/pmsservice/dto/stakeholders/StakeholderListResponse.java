package com.pmsservice.dto;

import com.pmsservice.enums.StakeholderType;

public record StakeholderListResponse(
        Integer stakeholderId,
        StakeholderType stakeholderCategory,
        String firstName,
        String lastName,
        Short primaryPhoneCode,
        Long primaryPhoneNum,
        String email,
        String city,
        String stateOrProvince,
        String country,
        String postalCode,
        Boolean active
) {
}