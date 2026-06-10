package com.fms.auth.application.port.input;

public interface LogoutUseCase {
    void logout(String refreshToken);
}
