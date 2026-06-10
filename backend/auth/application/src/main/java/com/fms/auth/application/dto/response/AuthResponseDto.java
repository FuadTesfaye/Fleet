package com.fms.auth.application.dto.response;

public record AuthResponseDto(
        UserSummaryDto user,
        TokenResponseDto tokens
) {}
