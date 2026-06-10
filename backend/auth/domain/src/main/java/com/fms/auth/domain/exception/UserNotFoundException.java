package com.fms.auth.domain.exception;

import com.fms.common.exception.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String identifier) {
        super("User not found: " + identifier);
    }
}
