package com.pmsservice.service;

import com.pmsservice.dto.CreateStakeholderRequest;
import com.pmsservice.dto.UpdateStakeholderRequest;

import org.springframework.stereotype.Component;

@Component
public class StakeholderSanitizer {

    public void sanitize(CreateStakeholderRequest request) {

        request.setFirstName(trim(request.getFirstName()));
        request.setLastName(trim(request.getLastName()));

        request.setEmail(
            request.getEmail() == null
                ? null
                : request.getEmail().trim().toLowerCase()
        );

        request.setPrimaryAddress(trim(request.getPrimaryAddress()));
        request.setSecondaryAddress(trim(request.getSecondaryAddress()));

        request.setCity(trim(request.getCity()));
        request.setStateOrProvince(trim(request.getStateOrProvince()));
        request.setCountry(trim(request.getCountry()));

        request.setPostalCode(trim(request.getPostalCode()));
        request.setExtraComments(trim(request.getExtraComments()));
    }
    
    public void sanitize(UpdateStakeholderRequest request) {

        if (request == null) {
            return;
        }

        if (request.getFirstName() != null) {
            request.setFirstName(
                    request.getFirstName().trim()
            );
        }

        if (request.getLastName() != null) {
            request.setLastName(
                    request.getLastName().trim()
            );
        }

        if (request.getEmail() != null) {
            request.setEmail(
                    request.getEmail().trim().toLowerCase()
            );
        }

        if (request.getPrimaryAddress() != null) {
            request.setPrimaryAddress(
                    request.getPrimaryAddress().trim()
            );
        }

        if (request.getSecondaryAddress() != null) {
            request.setSecondaryAddress(
                    request.getSecondaryAddress().trim()
            );
        }

        if (request.getCity() != null) {
            request.setCity(
                    request.getCity().trim()
            );
        }

        if (request.getStateOrProvince() != null) {
            request.setStateOrProvince(
                    request.getStateOrProvince().trim()
            );
        }

        if (request.getCountry() != null) {
            request.setCountry(
                    request.getCountry().trim()
            );
        }

        if (request.getPostalCode() != null) {
            request.setPostalCode(
                    request.getPostalCode().trim()
            );
        }

        if (request.getExtraComments() != null) {
            request.setExtraComments(
                    request.getExtraComments().trim()
            );
        }
    }

    private String trim(String value) {

        if (value == null) {
            return null;
        }

        String trimmed = value.trim();

        return trimmed.isEmpty() ? null : trimmed;
    }
}