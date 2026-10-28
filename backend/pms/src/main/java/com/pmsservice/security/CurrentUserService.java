package com.pmsservice.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Integer getUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new IllegalStateException(
                    "Authenticated JWT not found."
            );
        }

        Number userId = jwtAuthentication.getToken().getClaim("user_id");

        if (userId == null) {
            throw new IllegalStateException("User ID not found in JWT.");
        }

        return userId.intValue();
    }
}