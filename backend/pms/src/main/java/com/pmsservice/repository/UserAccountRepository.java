package com.pmsservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pmsservice.entity.UserAccount;

public interface UserAccountRepository extends JpaRepository<UserAccount, Integer> {

    Optional<UserAccount> findByUserName(String userName);

    Optional<UserAccount> findByEmail(String email);
}