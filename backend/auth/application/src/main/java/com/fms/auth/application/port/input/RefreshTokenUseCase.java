package com.fms.auth.application.port.input;

import com.fms.auth.application.dto.response.TokenResponseDto;

public interface RefreshTokenUseCase {
    TokenResponseDto refresh(String refreshToken);
}
