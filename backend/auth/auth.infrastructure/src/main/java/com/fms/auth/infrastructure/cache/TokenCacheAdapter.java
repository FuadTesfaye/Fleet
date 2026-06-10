package com.fms.auth.infrastructure.cache;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenCacheAdapter {

    private static final String PREFIX = "auth:refresh:";

    private final StringRedisTemplate redisTemplate;

    public void storeRefreshToken(String refreshToken, String userId, long ttlSeconds) {
        redisTemplate.opsForValue().set(PREFIX + refreshToken, userId, ttlSeconds, TimeUnit.SECONDS);
    }

    public String getUserIdForRefreshToken(String refreshToken) {
        return redisTemplate.opsForValue().get(PREFIX + refreshToken);
    }

    public void revokeRefreshToken(String refreshToken) {
        redisTemplate.delete(PREFIX + refreshToken);
    }
}
