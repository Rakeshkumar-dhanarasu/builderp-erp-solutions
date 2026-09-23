package com.pmsservice.config;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

    @Bean
    public KeyPair rsaKeyPair() throws Exception {

        KeyPairGenerator keyPairGenerator =
                KeyPairGenerator.getInstance("RSA");

        keyPairGenerator.initialize(2048);

        return keyPairGenerator.generateKeyPair();
    }

    @Bean
    public JwtEncoder jwtEncoder(KeyPair rsaKeyPair) {

        RSAPublicKey publicKey =
                (RSAPublicKey) rsaKeyPair.getPublic();

        RSAPrivateKey privateKey =
                (RSAPrivateKey) rsaKeyPair.getPrivate();

        return NimbusJwtEncoder
                .withKeyPair(publicKey, privateKey)
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(KeyPair rsaKeyPair) {

        RSAPublicKey publicKey =
                (RSAPublicKey) rsaKeyPair.getPublic();

        return NimbusJwtDecoder
                .withPublicKey(publicKey)
                .build();
    }
}