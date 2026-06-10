package com.fms.auth.domain.exception;

import com.fms.common.exception.DomainException;

public class InvalidCredentialsException extends DomainException {
    public InvalidCredentialsException() {
        super("INVALID_CREDENTIALS", "Invalid email or password");
    }
}
