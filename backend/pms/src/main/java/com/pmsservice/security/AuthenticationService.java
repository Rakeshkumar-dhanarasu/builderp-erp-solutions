package com.pmsservice.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.pmsservice.entity.UserAccount;
import com.pmsservice.repository.UserAccountRepository;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserAccountRepository userAccountRepository;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserAccountRepository userAccountRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userAccountRepository = userAccountRepository;
    }

    public String authenticate(String username, String password) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                username,
                                password
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        UserAccount userAccount =
                userAccountRepository.findByUserName(
                        userDetails.getUsername()
                ).orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found")
                );
        
        return jwtService.generateToken(userAccount);
    }
}