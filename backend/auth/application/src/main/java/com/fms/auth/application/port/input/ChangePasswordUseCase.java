package com.fms.auth.application.port.input;

import com.fms.auth.application.command.ChangePasswordCommand;

public interface ChangePasswordUseCase {
    void changePassword(ChangePasswordCommand command);
}
