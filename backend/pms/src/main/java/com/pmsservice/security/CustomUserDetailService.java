package com.pmsservice.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pmsservice.entity.UserAccount;
import com.pmsservice.repository.UserAccountRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    public CustomUserDetailService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        UserAccount userAccount = userAccountRepository
                .findByUserName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return User.builder()
                .username(userAccount.getUserName())
                .password(userAccount.getUserPassword())
                .disabled(!Boolean.TRUE.equals(userAccount.getActivityStatus()))
                .authorities("USER")
                .build();
    }
}