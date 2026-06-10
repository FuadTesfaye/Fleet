package com.fms.auth.infrastructure.security;

import com.fms.auth.application.dto.response.TokenResponseDto;
import com.fms.auth.application.port.output.TokenServicePort;
import com.fms.auth.domain.entity.User;
import com.fms.auth.infrastructure.cache.TokenCacheAdapter;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeycloakTokenService implements TokenServicePort {

    private final TokenCacheAdapter tokenCacheAdapter;

    @Value("${fms.auth.token.expiry-seconds:3600}")
    private long expirySeconds;

    @Override
    public TokenResponseDto generateTokens(User user) {
        String accessToken = "access-" + user.getUserId().value();
        String refreshToken = UUID.randomUUID().toString();
        tokenCacheAdapter.storeRefreshToken(refreshToken, user.getUserId().value().toString(), expirySeconds * 24);
        return new TokenResponseDto(accessToken, refreshToken, expirySeconds);
    }

    @Override
    public TokenResponseDto refresh(String refreshToken) {
        String userId = tokenCacheAdapter.getUserIdForRefreshToken(refreshToken);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String accessToken = "access-" + userId + "-" + Instant.now().toEpochMilli();
        return new TokenResponseDto(accessToken, refreshToken, expirySeconds);
    }

    @Override
    public void revoke(String refreshToken) {
        tokenCacheAdapter.revokeRefreshToken(refreshToken);
    }

    @Override
    public boolean validateAccessToken(String accessToken) {
        return accessToken != null && accessToken.startsWith("access-");
    }
}
