package com.fms.auth.application.port.input;

import com.fms.auth.application.command.LoginCommand;
import com.fms.auth.application.dto.response.AuthResponseDto;

public interface LoginUseCase {
    AuthResponseDto login(LoginCommand command);
}
