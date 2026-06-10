package com.fms.auth.domain.exception;

import com.fms.common.exception.ConflictException;

public class UserAlreadyExistsException extends ConflictException {
    public UserAlreadyExistsException(String email) {
        super("User already exists with email: " + email);
    }
}
