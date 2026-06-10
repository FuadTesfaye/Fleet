package com.fms.auth.application.port.output;

import com.fms.auth.application.dto.response.TokenResponseDto;
import com.fms.auth.domain.entity.User;

public interface TokenServicePort {
    TokenResponseDto generateTokens(User user);

    TokenResponseDto refresh(String refreshToken);

    void revoke(String refreshToken);

    boolean validateAccessToken(String accessToken);
}
