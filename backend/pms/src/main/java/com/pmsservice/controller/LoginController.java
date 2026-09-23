package com.pmsservice.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmsservice.security.AuthenticationService;

@RestController
@RequestMapping("/api/pms")
public class LoginController {

	private final AuthenticationService authenticationService;

    private static final Logger log =
            LoggerFactory.getLogger(LoginController.class);

    public LoginController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        log.info("Login attempt received for user: {}", loginRequest.getUsername());
        try
        {
        String token = authenticationService.authenticate(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        log.info("User '{}' successfully authenticated.", loginRequest.getUsername());
        
        log.info("Token generated...", token);
        
        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(30 * 60)
                .build();
        
        log.info("Obtained JWT token in Cookie", cookie);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Login successful!"));    
        }
        catch (Exception ex) {

            log.warn("Authentication failed for user '{}'.",
                    loginRequest.getUsername());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "Invalid username or password"
                    ));
        }
    }
}

class LoginRequest {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}