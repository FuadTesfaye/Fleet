package com.fms.auth.application.dto.response;

public record TokenResponseDto(
        String accessToken,
        String refreshToken,
        long expiresIn
) {}
