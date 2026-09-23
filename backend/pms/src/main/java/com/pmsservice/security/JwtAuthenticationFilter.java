package com.pmsservice.security;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractTokenFromCookie(request);

        if (token != null) {
        	try {
        		Jwt jwt = jwtDecoder.decode(token);

        		Number userId = jwt.getClaim("user_id");

        		log.info("JWT successfully decoded for subject: {}", jwt.getSubject());
        		log.info("JWT user_id: {}", userId);

        		JwtAuthenticationToken authentication =
        		        new JwtAuthenticationToken(jwt, java.util.Collections.emptyList(), jwt.getSubject());

        		SecurityContextHolder.getContext()
        		        .setAuthentication(authentication);

        	    log.info("JWT authentication placed in SecurityContext.");

        	} catch (JwtException ex) {
        	    log.error("JWT validation failed: {}", ex.getMessage(), ex);
        	    SecurityContextHolder.clearContext();
        	}
        }

        log.info("Before filter chain - authentication: {}",
                SecurityContextHolder.getContext().getAuthentication());

        filterChain.doFilter(request, response);

        log.info("After filter chain - HTTP status: {}", response.getStatus());
    }

    private String extractTokenFromCookie(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}