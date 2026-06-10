package com.fms.auth.application.port.input;

import com.fms.auth.application.command.RegisterCommand;
import com.fms.auth.application.dto.response.UserSummaryDto;

public interface RegisterUseCase {
    UserSummaryDto register(RegisterCommand command);
}
