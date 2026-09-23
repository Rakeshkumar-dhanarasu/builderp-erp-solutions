package com.pmsservice.errorhandle;

public class StakeholderNotFoundException extends RuntimeException {

    public StakeholderNotFoundException(String message) {
        super(message);
    }
}