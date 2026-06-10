package com.fms.auth.application.port.input;

public interface ValidateTokenUseCase {
    boolean validate(String accessToken);
}
