package com.pmsservice.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.pmsservice.entity.UserAccount;

@Service
public class JwtService {

	private final JwtEncoder jwtEncoder;

	public JwtService(JwtEncoder jwtEncoder) {
		this.jwtEncoder = jwtEncoder;
	}

	public String generateToken(UserAccount userAccount) {

		Instant issuedAt = Instant.now();
		Instant expiresAt = issuedAt.plus(90, ChronoUnit.MINUTES);

		JwtClaimsSet claims = JwtClaimsSet.builder().issuer("pms-service").subject(userAccount.getUserName())
				.claim("user_id", userAccount.getUserId()).issuedAt(issuedAt).expiresAt(expiresAt).build();
		
		return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
	}
}